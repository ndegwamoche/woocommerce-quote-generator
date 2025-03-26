<?php

/**
 * Plugin Name: WooCommerce Quote Generator
 * Description: A simple React-PHP WooCommerce quote generator.
 * Version: 1.0.0
 * Author: <a href="https://github.com/ndegwamoche/" target="_blank">Martin Ndegwa Moche</a>
 * Author URI: https://github.com/ndegwamoche/
 * License: GPL2
 * Text Domain: woocommerce-quote-generator
 */

if (!defined('ABSPATH')) {
    exit; // Prevent direct access
}

// Check if WooCommerce is active
if (!in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')))) {
    return;
}

// Include necessary files
require_once plugin_dir_path(__FILE__) . 'includes/class-quote-generator.php';

// Initialize the plugin
function wqg_init_plugin()
{
    new Quote_Generator();
}

add_action('plugins_loaded', 'wqg_init_plugin');


// Shortcode to Display React App
function wqg_display_quote_generator()
{
    return '<div id="woocommerce-quote-generator"></div>';
}
add_shortcode('woocommerce_quote_generator', 'wqg_display_quote_generator');
