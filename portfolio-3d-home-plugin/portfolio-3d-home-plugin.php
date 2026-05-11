<?php
/**
 * Plugin Name: Portfolio 3D Home
 * Description: Adds a shortcode-powered 3D homepage experience with room-panel mapping to WordPress pages.
 * Version: 0.1.0
 * Author: Site Team
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once plugin_dir_path(__FILE__) . 'includes/class-portfolio-3d-home-plugin.php';

function portfolio_3d_home_bootstrap(): void {
    $plugin = new Portfolio_3D_Home_Plugin(__FILE__);
    $plugin->init();
}

portfolio_3d_home_bootstrap();
