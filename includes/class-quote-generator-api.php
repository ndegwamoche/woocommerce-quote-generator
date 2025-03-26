<?php
class Quote_Generator_API
{
    public function __construct()
    {
        add_action('wp_ajax_fetch_cart_data', [$this, 'fetch_cart_data']);
        add_action('wp_ajax_nopriv_fetch_cart_data', [$this, 'fetch_cart_data']);

        add_action('wp_ajax_create_order', [$this, 'create_order']);
        add_action('wp_ajax_nopriv_create_order', [$this, 'create_order']);

        add_action('wp_ajax_fetch_order_details', [$this, 'fetch_order_details']);
        add_action('wp_ajax_nopriv_fetch_order_details', [$this, 'fetch_order_details']);
    }

    public function fetch_order_details()
    {
        if (!isset($_GET['order_id'])) {
            wp_send_json_error(['message' => 'Order ID is required.']);
            wp_die();
        }

        $order_id = intval($_GET['order_id']);
        $order = wc_get_order($order_id);

        if (!$order) {
            wp_send_json_error(['message' => 'Order not found.']);
            wp_die();
        }

        // Get Customer Details
        $customer_data = [
            'id'         => $order->get_customer_id(),
            'email'      => $order->get_billing_email(),
            'first_name' => $order->get_billing_first_name(),
            'last_name'  => $order->get_billing_last_name(),
            'phone'      => $order->get_billing_phone(),
        ];

        // Get Billing Address
        $billing_address = $order->get_address('billing');

        // Get Shipping Address
        $shipping_address = $order->get_address('shipping');

        // Get Ordered Items
        $items = [];
        foreach ($order->get_items() as $item_id => $item) {
            $product = $item->get_product();
            $items[] = [
                'product_id'   => $item->get_product_id(),
                'name'         => $item->get_name(),
                'quantity'     => $item->get_quantity(),
                'total_price'  => wc_price($item->get_total()),
                'image'        => wp_get_attachment_url($product->get_image_id()),
            ];
        }

        // Get Order Total & Status
        $order_data = [
            'order_id'       => $order_id,
            'status'         => $order->get_status(),
            'total'          => wc_price($order->get_total()),
            'currency'       => $order->get_currency(),
            'payment_method' => $order->get_payment_method_title(),
            'date_created'   => $order->get_date_created()->date('Y-m-d H:i:s'),
            'customer'       => $customer_data,
            'billing'        => $billing_address,
            'shipping'       => $shipping_address,
            'items'          => $items,
        ];

        wp_send_json_success(['order' => $order_data]);
        wp_die();
    }

    public function fetch_cart_data()
    {
        if (!WC()->cart) {
            wp_send_json_error(['message' => 'Cart is empty or unavailable.']);
            wp_die();
        }

        $cart = WC()->cart->get_cart();
        $cart_items = [];

        foreach ($cart as $cart_item_key => $cart_item) {
            $product = $cart_item['data'];
            $cart_items[] = [
                'id'       => $product->get_id(),
                'name'     => $product->get_name(),
                'price'    => wc_price($product->get_price()),
                'quantity' => $cart_item['quantity'],
                'total'    => wc_price($cart_item['line_total']),
            ];
        }

        wp_send_json_success(['cart' => $cart_items]);
        wp_die();
    }

    private function formatPhoneNumber($phoneNumber)
    {
        // Ensure it's a string and remove spaces
        $phoneNumber = trim($phoneNumber);

        // Check if it starts with "+2540" or "2540" and fix it
        if (strpos($phoneNumber, "+2540") === 0) {
            $phoneNumber = "254" . substr($phoneNumber, 5);
        } elseif (strpos($phoneNumber, "2540") === 0) {
            $phoneNumber = "254" . substr($phoneNumber, 4);
        }

        return $phoneNumber;
    }

    public function create_order()
    {
        if (!WC()->cart || WC()->cart->is_empty()) {
            wp_send_json_error(['message' => 'Cart is empty.']);
            wp_die();
        }

        // Get JSON input from the request body
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            wp_send_json_error(['message' => 'Invalid request data.']);
            wp_die();
        }

        // Extract customer data
        $email = sanitize_email($data['email'] ?? '');
        $first_name = sanitize_text_field($data['first_name'] ?? '');
        $last_name = sanitize_text_field($data['last_name'] ?? '');
        $phone = sanitize_text_field($data['phone'] ?? '');
        $finalTotal = sanitize_text_field($data['finalTotal'] ?? 0);
        $order_details = sanitize_text_field($data['order_details'] ?? '');

        //remove the zeros
        $phone = $this->formatPhoneNumber($phone);

        // Prepare billing address
        $billing_address = [
            'first_name' => $first_name,
            'last_name'  => $last_name,
            'email'      => $email,
            'phone'      => $phone,
            'address_1'  => sanitize_text_field($data['billing']['address_1'] ?? ''),
            'city'       => sanitize_text_field($data['billing']['city'] ?? ''),
            'state'      => sanitize_text_field($data['billing']['state'] ?? ''),
            'postcode'   => sanitize_text_field($data['billing']['postcode'] ?? ''),
            'country'    => sanitize_text_field($data['billing']['country'] ?? ''),
        ];

        // Prepare shipping address
        $shipping_address = [
            'first_name' => $first_name,
            'last_name'  => $last_name,
            'address_1'  => sanitize_text_field($data['shipping']['address_1'] ?? ''),
            'city'       => sanitize_text_field($data['shipping']['city'] ?? ''),
            'state'      => sanitize_text_field($data['shipping']['state'] ?? ''),
            'postcode'   => sanitize_text_field($data['shipping']['postcode'] ?? ''),
            'country'    => sanitize_text_field($data['shipping']['country'] ?? ''),
        ];

        $order = wc_create_order();

        if ($email) {
            $order->set_customer_id(email_exists($email) ? get_user_by('email', $email)->ID : 0);
        }

        if ($order_details) {
            $order->add_order_note($order_details);
        }

        $order->set_billing_email($email);
        $order->set_billing_first_name($first_name);
        $order->set_billing_last_name($last_name);

        // Add products from cart
        foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
            $product_id = $cart_item['product_id'];
            $quantity = $cart_item['quantity'];
            $order->add_product(wc_get_product($product_id), $quantity);
        }

        // Set billing and shipping addresses
        $order->set_address($billing_address, 'billing');
        $order->set_address($shipping_address, 'shipping');

        // Add shipping cost
        if (!empty($data['shipping_method']['method_id']) && isset($data['shipping_method']['cost'])) {
            $shipping_title = sanitize_text_field($data['shipping_method']['title'] ?? 'Shipping');
            $shipping_rate = new WC_Shipping_Rate(
                $data['shipping_method']['method_id'],
                $shipping_title,
                floatval($data['shipping_method']['cost']),
                [], // Taxes (optional)
                $data['shipping_method']['method_id']
            );
            $order->add_shipping($shipping_rate);
        }

        $order->calculate_totals();
        $order->update_status('processing', 'Quotation created');
        $order->save();

        WC()->cart->empty_cart();

        wp_send_json_success(['message' => 'Quotation created successfully!', 'order_id' => $order->get_id()]);
        wp_die();
    }
}

new Quote_Generator_API();
