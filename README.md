# WooCommerce Quote Generator

## **Overview**
WooCommerce Quote Generator is a WordPress plugin that enables customers to request quotes for products in a WooCommerce-powered store. It seamlessly integrates React and PHP, offering an interactive quoting experience via the `[woocommerce-quote-generator]` shortcode.

## **Features**
- **Shortcode-Based Integration**: Easily add a quote generator anywhere using `[woocommerce-quote-generator]`.
- **React-Powered Interface**: A modern and interactive quoting system built with React.
- **WooCommerce Compatibility**: Fully integrates with WooCommerce, ensuring smooth product selection and quote requests.
- **Custom Thank You Page Handling**: Uses custom rewrite rules to manage quote submission redirects.
- **AJAX & Nonce Security**: Implements AJAX-based operations with nonce verification for security.

## **Installation**
1. Download the plugin and upload it to your WordPress site.
2. Activate the plugin from the WordPress admin dashboard.
3. Ensure WooCommerce is installed and activated.
4. Use the shortcode `[woocommerce-quote-generator]` in any post or page to display the quote generator.

## **Usage**
1. Navigate to a page where the shortcode `[woocommerce-quote-generator]` is used.
2. Select WooCommerce products to include in the quote.
3. Submit the quote request through the interactive form.
4. Customers will receive a confirmation, and site admins can manage quotes accordingly.

## **Technical Details**
- **Primary File:** `woocommerce-quote-generator.php`
- **Shortcode Functionality:** Registered via `add_shortcode('woocommerce_quote_generator', 'wqg_display_quote_generator')`.
- **React Integration:** The frontend is powered by a React app (`build/index.js`), enqueued via `wp_enqueue_script`.
- **Custom Rewrite Rules:** Implements a custom "Thank You" page rewrite rule (`thankyou/{order_id}`).
- **API Communication:** Uses `class-quote-generator-api.php` for backend processing.

## **Development**
### **Dependencies**
The plugin relies on:
- `@wordpress/scripts` for build tools.
- `bootstrap` and `react-bootstrap` for UI components.
- `react-phone-input-2` for phone input handling.

### **Building the Plugin**
To build the React app:
```bash
npm install
npm run build
npm run start
```
## **Technical Details**
This plugin is licensed under GPL2. Feel free to modify and distribute it.

## **Author**
Developed by Martin Ndegwa Moche.
