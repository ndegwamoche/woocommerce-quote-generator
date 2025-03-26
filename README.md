# WooCommerce Quote Generator

**Version:** 1.0  
**Author:** [Martin Ndegwa Moche](https://www.linkedin.com/in/ndegwamoche/)  
**Description:** This  is a WordPress plugin that allows users to generate product quotes within a WooCommerce store using a simple shortcode [woocommerce-quote-generator]. It integrates React and PHP to provide a seamless quoting experience.

## **Overview**
WooCommerce Quote Generator is a WordPress plugin that enables customers to request quotes for products in a WooCommerce-powered store. It seamlessly integrates React and PHP, offering an interactive quoting experience via the `[woocommerce-quote-generator]` shortcode.

## **Features**
- **Shortcode-Based Integration**: Easily add a quote generator anywhere using `[woocommerce-quote-generator]`.
- **React-Powered Interface**: A modern and interactive quoting system built with React.
- **WooCommerce Compatibility**: Fully integrates with WooCommerce, ensuring smooth product selection and quote requests.
- **Custom Thank You Page Handling**: Uses custom rewrite rules to manage quote submission redirects.
- **AJAX & Nonce Security**: Implements AJAX-based operations with nonce verification for security.

----------

## File Structure
```
woocommerce-quote-generator/
│
├── build/
│ ├── index.js # Compiled React components
│ ├── index.asset.php # Asset dependencies
│
├── includes/
│ ├── class-quote-generator-api.php # Handles admin interface
│ ├── class-quote-generator.php # Handles AJAX requests
│
├── src/
│ ├── components/
│ │ ├── CartSummary.js # React component for the admin form
│ │ ├── CheckoutForm.js # React component for video lists
│ ├── App.js # Main React app entry
│ ├── index.js # React app renderer
│
├── woocommerce-quote-generator.php # Main plugin file
├── package.json # Node.js dependencies
└── README.md
```
----------

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
