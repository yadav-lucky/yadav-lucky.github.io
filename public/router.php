<?php
/**
 * Lucky Kumar Yadav — Portfolio
 * PHP built-in server front controller / router.
 *
 * Usage:
 *   php -S localhost:8000 public/router.php
 *
 * Serves the static front-end from /public and exposes:
 *   GET  /api/profile        -> resume data
 *   POST /api/contact        -> store message
 *   POST /api/contact.php    -> same handler
 *   GET  /api/messages       -> list stored messages (demo)
 */

require __DIR__ . '/../php/handlers.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    foreach (env_cors_headers() as $h) {
        header($h);
    }
    http_response_code(204);
    exit;
}

function send_json($status, $payload) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    foreach (env_cors_headers() as $h) {
        header($h);
    }
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function serve_static($uri) {
    $path = parse_url($uri, PHP_URL_PATH);
    if ($path === '/' || $path === '') {
        $path = '/index.html';
    }
    $file = __DIR__ . $path;
    $real = realpath($file);
    $base = realpath(__DIR__);
    if (!$real || strpos($real, $base) !== 0 || !is_file($real)) {
        // SPA fallback
        $real = __DIR__ . '/index.html';
        if (!is_file($real)) {
            http_response_code(404);
            echo 'Not found';
            exit;
        }
    }
    $ext = strtolower(pathinfo($real, PATHINFO_EXTENSION));
    $mime = [
        'html' => 'text/html; charset=utf-8',
        'css'  => 'text/css; charset=utf-8',
        'js'   => 'text/javascript; charset=utf-8',
        'json' => 'application/json; charset=utf-8',
        'svg'  => 'image/svg+xml',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'ico'  => 'image/x-icon',
        'pdf'  => 'application/pdf'
    ];
    header('Content-Type: ' . ($mime[$ext] ?? 'application/octet-stream'));
    foreach (env_cors_headers() as $h) {
        header($h);
    }
    readfile($real);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($uri, PHP_URL_PATH);

if ($method === 'GET' && $path === '/api/profile') {
    $data = profile_get();
    if (!$data) { send_json(500, ['error' => 'Profile data unavailable']); }
    send_json(200, $data);
}

if ($method === 'GET' && $path === '/api/messages') {
    send_json(200, ['count' => count(messages_read()), 'messages' => messages_read()]);
}

if ($method === 'POST' && ($path === '/api/contact' || $path === '/api/contact.php')) {
    [$status, $body] = contact_handle();
    send_json($status, $body);
}

if ($method === 'GET' || $method === 'HEAD') {
    serve_static($uri);
}

send_json(405, ['error' => 'Method not allowed']);
