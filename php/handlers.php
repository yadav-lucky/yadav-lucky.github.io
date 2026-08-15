<?php
/**
 * Lucky Kumar Yadav — Portfolio
 * PHP handlers (included by public/router.php).
 * Single source of truth: ../data/profile.json
 */

if (!function_exists('env_load')) {
    function env_load() {
        $file = __DIR__ . '/../.env';
        if (!is_readable($file)) {
            return;
        }
        foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0 || strpos($line, '=') === false) {
                continue;
            }
            list($k, $v) = explode('=', $line, 2);
            $k = trim($k);
            $v = trim($v, " \t\"'");
            if (!array_key_exists($k, $_ENV) && getenv($k) === false) {
                putenv("$k=$v");
                $_ENV[$k] = $v;
            }
        }
    }

    function env_cors_headers() {
        $origins = array_filter(array_map('trim', explode(',', (string) getenv('ALLOWED_ORIGINS'))));
        if (empty($origins)) {
            return [];
        }
        return [
            'Access-Control-Allow-Origin: ' . implode(',', $origins),
            'Access-Control-Allow-Methods: GET, POST, OPTIONS',
            'Access-Control-Allow-Headers: Content-Type'
        ];
    }

    env_load();
}

if (!function_exists('profile_get')) {
    function profile_path() {
        return realpath(__DIR__ . '/../data/profile.json');
    }

    function profile_get() {
        $file = profile_path();
        if (!$file || !is_readable($file)) {
            return null;
        }
        $json = file_get_contents($file);
        $data = json_decode($json, true);
        return is_array($data) ? $data : null;
    }

    function messages_path() {
        return __DIR__ . '/../data/messages.json';
    }

    function messages_read() {
        $file = messages_path();
        if (!is_readable($file)) {
            return [];
        }
        $list = json_decode(file_get_contents($file), true);
        return is_array($list) ? $list : [];
    }

    function messages_append(array $record) {
        $file = messages_path();
        $list = messages_read();
        $list[] = $record;
        if (!is_dir(dirname($file))) {
            mkdir(dirname($file), 0755, true);
        }
        return file_put_contents($file, json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }

    function contact_handle() {
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true);
        if (!is_array($payload)) {
            return [400, ['error' => 'Invalid JSON']];
        }

        $name = trim(strval($payload['name'] ?? ''));
        $email = trim(strval($payload['email'] ?? ''));
        $message = trim(strval($payload['message'] ?? ''));

        if (mb_strlen($name) < 2) {
            return [400, ['error' => 'Name is too short.']];
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [400, ['error' => 'Invalid email.']];
        }
        if (mb_strlen($message) < 10) {
            return [400, ['error' => 'Message is too short.']];
        }

        $record = [
            'id' => base_convert(time(), 10, 36) . bin2hex(random_bytes(3)),
            'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
            'email' => htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
            'message' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8'),
            'receivedAt' => gmdate('c'),
            'source' => 'php'
        ];

        messages_append($record);

        return [200, [
            'ok' => true,
            'message' => 'Thanks ' . $record['name'] . '! Your message has been received.',
            'id' => $record['id']
        ]];
    }
}
