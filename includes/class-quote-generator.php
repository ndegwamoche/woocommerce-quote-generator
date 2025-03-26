<?php
class Quote_Generator
{
    public function __construct()
    {
        require_once plugin_dir_path(__FILE__) . 'class-quote-generator-api.php';

        add_action('wp_enqueue_scripts', [$this, 'enqueue_quote_generator_app']);
        add_action('init', [$this, 'custom_thankyou_rewrite_rule']);
        add_filter('query_vars', [$this, 'custom_thankyou_query_vars']);
    }

    public function enqueue_quote_generator_app()
    {
        wp_enqueue_script(
            'wqgr-quote-generator-app',
            plugin_dir_url(__FILE__) . '../build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components'],
            filemtime(plugin_dir_path(__FILE__) . '../build/index.js'),
            true
        );

        wp_localize_script('wqgr-quote-generator-app', 'wgrrData', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('wccr_nonce'),
            'plugin_url' => plugin_dir_url(__FILE__),
            'site_url' => get_site_url(),
        ]);
    }

    public function custom_thankyou_rewrite_rule()
    {
        add_rewrite_rule('^thankyou/([0-9]+)/?$', 'index.php?pagename=thankyou&order_id=$matches[1]', 'top');
    }

    public function custom_thankyou_query_vars($vars)
    {
        $vars[] = 'order_id';
        return $vars;
    }
}
