<?php
declare(strict_types=1);
// PHP port of server/portfolio-api.mjs for hosts that cannot run the Node server.
// Deployed as api/index.php. Auth, sessions, inbox and saved portfolio data live in ../data, outside the web root.
// shortcut: file-based JSON storage without cross-request locking, fine for one admin; move to a database if traffic grows.

const ALLOWED_ORIGINS = ['https://zakaryaoukil.com', 'https://www.zakaryaoukil.com'];
const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];

$root = isset($_SERVER['DOCUMENT_ROOT']) && $_SERVER['DOCUMENT_ROOT'] !== '' ? $_SERVER['DOCUMENT_ROOT'] : dirname(__DIR__);
$dataDir = dirname(rtrim($root, '/')) . '/data';

function out(int $status, $body): never {
    http_response_code($status);
    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
function load_json(string $file, $fallback = []) {
    $raw = @file_get_contents($file);
    if ($raw === false) return $fallback;
    $value = json_decode($raw, true);
    return $value === null ? $fallback : $value;
}
function save_json(string $file, $value): void {
    $dir = dirname($file);
    if (!is_dir($dir)) mkdir($dir, 0700, true);
    $tmp = $file . '.' . bin2hex(random_bytes(6)) . '.tmp';
    file_put_contents($tmp, json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
    chmod($tmp, 0600);
    rename($tmp, $file);
}
function read_body(int $limit) {
    $raw = file_get_contents('php://input', false, null, 0, $limit + 1);
    if ($raw === false || strlen($raw) > $limit) out(413, ['error' => 'Request too large']);
    $value = json_decode($raw);
    if ($value === null) out(400, ['error' => 'Invalid JSON']);
    return $value;
}
function client_ip(): string {
    $forwarded = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')[0]);
    return filter_var($forwarded, FILTER_VALIDATE_IP) ? $forwarded : ($_SERVER['REMOTE_ADDR'] ?? 'local');
}
function iso_now(): string { return gmdate('Y-m-d\TH:i:s') . '.000Z'; }

// Failed-attempt counters (login, mail), expiring after the window.
function attempts_load(string $dir): array {
    $now = time();
    return array_filter(load_json("$dir/attempts.json"), fn($a) => ($a['expires'] ?? 0) > $now);
}
function attempts_count(array $attempts, string $key): int { return (int)($attempts[$key]['count'] ?? 0); }
function attempts_bump(string $dir, array $attempts, array $keys, int $window = 900): void {
    foreach ($keys as $key) $attempts[$key] = ['count' => attempts_count($attempts, $key) + 1, 'expires' => time() + $window];
    if (count($attempts) > 10000) $attempts = [];
    save_json("$dir/attempts.json", $attempts);
}

// ---- portfolio validation (port of validatePortfolio) ----
function prop($o, string $k) { return is_object($o) && property_exists($o, $k) ? $o->$k : null; }
function has($o, string $k): bool { return is_object($o) && property_exists($o, $k); }
function truthy($v): bool { return !($v === null || $v === false || $v === '' || $v === 0 || $v === 0.0); }
function num($v): bool { return is_int($v) || is_float($v); }
function strs($o, array $keys): bool {
    if (!is_object($o)) return false;
    foreach ($keys as $k) { $v = prop($o, $k); if (!is_string($v) || mb_strlen($v) >= 20000) return false; }
    return true;
}
function all_of($list, callable $fn): bool {
    if (!is_array($list)) return false;
    foreach ($list as $item) if (!$fn($item)) return false;
    return true;
}
function all_str($list): bool { return all_of($list, 'is_string'); }
function briefings_ok($item): bool {
    $exec = prop($item, 'executiveBriefing'); $tech = prop($item, 'technicalBriefing');
    return (!truthy($exec) || strs($exec, ['financialExposure', 'regulatoryImpact', 'downtimeRisk', 'mitigationRoi', 'assumptions']))
        && (!truthy($tech) || strs($tech, ['mapping', 'commands', 'patches', 'validation']));
}
function safe_url($v, bool $image = false): bool {
    if (!truthy($v)) return true;
    if (!is_string($v) || strlen($v) > ($image ? 2800000 : 2048)) return false;
    if ($image && preg_match('#^data:image/(?:png|jpeg|webp|gif);base64,#', $v, $m)) {
        $rest = substr($v, strlen($m[0]));
        if ($rest !== '' && strspn($rest, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=') === strlen($rest)) return true;
    }
    if (preg_match('#^/(?!/)#', $v) && !str_contains($v, '\\')) return true;
    $parts = parse_url($v);
    if (!is_array($parts) || !isset($parts['scheme'])) return false;
    $scheme = strtolower($parts['scheme']);
    return $scheme === 'mailto' || (($scheme === 'http' || $scheme === 'https') && !empty($parts['host']));
}
function walk($item, string $parent, int $depth, bool &$valid): void {
    if ($depth > 12) { $valid = false; return; }
    if (!is_object($item) && !is_array($item)) return;
    foreach ((array)$item as $key => $value) {
        $key = (string)$key;
        if (in_array($key, ['__proto__', 'constructor', 'prototype'], true)) $valid = false;
        $device = in_array($parent, ['macos', 'ios', 'android'], true);
        if (is_string($value) && (preg_match('/url\z/i', $key) || $parent === 'media' || $device
            || in_array($key, ['image', 'avatar', 'macosToIos', 'iosToMacos', 'macosToAndroid', 'androidToMacos', 'iosToAndroid', 'androidToIos'], true))) {
            $image = $parent === 'media' || in_array($key, ['image', 'avatar'], true) || $device;
            if (!safe_url($value, $image)) $valid = false;
        }
        if (is_object($value) || is_array($value)) walk($value, $key, $depth + 1, $valid);
    }
}
function valid_portfolio($d): bool {
    if (!is_object($d)) return false;
    $tabs = prop($d, 'tabs'); $projects = prop($d, 'projects'); $config = prop($d, 'config'); $widgets = prop($config, 'widgets');
    if (!is_array($tabs) || !is_array($projects) || !truthy(prop($config, 'bio')) || !truthy($widgets) || count($projects) > 100 || count($tabs) > 30) return false;
    if (has($config, 'pentestReports') && !all_of(prop($config, 'pentestReports'), fn($i) =>
        strs($i, ['id', 'title', 'clientCode', 'date', 'scope', 'severity', 'cvssVector', 'executiveSummary', 'attackVector', 'verifiedStatus'])
        && in_array(prop($i, 'severity'), SEVERITIES, true) && num(prop($i, 'cvssScore')) && prop($i, 'cvssScore') >= 0 && prop($i, 'cvssScore') <= 10
        && all_of(prop($i, 'exploitChain'), fn($s) => strs($s, ['phase', 'description']) && (!has($s, 'codeSnippet') || is_string(prop($s, 'codeSnippet'))))
        && all_str(prop($i, 'remediation')) && briefings_ok($i))) return false;
    if (has($config, 'socRules') && !all_of(prop($config, 'socRules'), fn($i) =>
        strs($i, ['id', 'title', 'format', 'severity', 'mitreTactic', 'mitreTechniqueId', 'description', 'ruleSyntax'])
        && in_array(prop($i, 'format'), ['sigma', 'suricata', 'yara'], true) && in_array(prop($i, 'severity'), SEVERITIES, true)
        && (!has($i, 'logSample') || is_string(prop($i, 'logSample'))) && briefings_ok($i))) return false;
    if (has($config, 'recruiterFastPass')) {
        $fp = prop($config, 'recruiterFastPass'); $roles = prop($fp, 'roles');
        if (!strs($fp, ['workAuthorization', 'availability', 'workPreference', 'clearance', 'publicKeyUrl']) || !is_array($roles) || count($roles) !== 3) return false;
        $ids = array_map(fn($r) => prop($r, 'id'), $roles);
        if (!all_str($ids) || count(array_unique($ids)) !== 3) return false;
        if (!all_of($roles, fn($r) =>
            strs($r, ['id', 'label', 'summary', 'resumeUrl', 'resumeFilename', 'evidenceApp'])
            && in_array(prop($r, 'id'), ['pentest', 'soc', 'systems'], true) && in_array(prop($r, 'evidenceApp'), ['pentest-reports', 'soc-hunting', 'masters-research'], true)
            && is_array(prop($r, 'competencies')) && count(prop($r, 'competencies')) === 4 && all_str(prop($r, 'competencies'))
            && all_str(prop($r, 'certifications')))) return false;
    }
    if (!all_of($tabs, fn($t) => strs($t, ['id', 'name', 'slogan', 'title', 'subtitle', 'icon']))) return false;
    if (count(array_unique(array_map(fn($t) => $t->id, $tabs))) !== count($tabs) || count(array_unique(array_map(fn($t) => $t->name, $tabs))) !== count($tabs)) return false;
    $tabNames = array_map(fn($t) => $t->name, $tabs);
    if (!all_of($projects, fn($p) =>
        strs($p, ['id', 'country', 'title', 'subtitle', 'location', 'description', 'duration', 'distance']) && is_string(prop($p, 'image'))
        && in_array(prop($p, 'country'), $tabNames, true)
        && (!truthy(prop($p, 'tags')) || all_str(prop($p, 'tags')))
        && (!truthy(prop($p, 'architecture')) || all_of(prop($p, 'architecture'), fn($n) => strs($n, ['id', 'label', 'detail'])))
        && (!truthy(prop($p, 'metrics')) || all_of(prop($p, 'metrics'), fn($m) => strs($m, ['label', 'value', 'source'])))
    )) return false;
    if (count(array_unique(array_map(fn($p) => $p->id, $projects))) !== count($projects)) return false;
    if (!all_of(prop($widgets, 'certs'), fn($c) =>
        strs($c, ['id', 'title', 'issuer', 'badge', 'date'])
        && (!truthy(prop($c, 'status')) || in_array(prop($c, 'status'), ['certified', 'in-progress'], true))
        && (prop($c, 'progress') === null || (num(prop($c, 'progress')) && prop($c, 'progress') >= 0 && prop($c, 'progress') <= 100)))) return false;
    if (!truthy(prop($widgets, 'visibility')) || !truthy(prop($widgets, 'about')) || !truthy(prop($widgets, 'neofetch'))) return false;
    $order = prop($widgets, 'order');
    if (truthy($order) && !all_of($order, fn($k) => in_array($k, ['about', 'certs', 'github', 'neofetch', 'clock', 'telemetry', 'notes'], true))) return false;
    $valid = true;
    walk($d, '', 0, $valid);
    return $valid;
}

// ---- routing ----
$route = strtok($_SERVER['REQUEST_URI'] ?? '/', '?');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// The public site on another origin may POST inquiries to /api/mail only; every other route stays same-origin.
$mailOrigin = $route === '/api/mail' && in_array($origin, ALLOWED_ORIGINS, true) ? $origin : '';
if ($mailOrigin !== '') {
    header("Access-Control-Allow-Origin: $mailOrigin");
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
if ($route === '/api/mail' && $method === 'OPTIONS') { http_response_code($mailOrigin !== '' ? 204 : 403); exit; }

if (!in_array($method, ['GET', 'HEAD'], true)) {
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if ($mailOrigin === '' && (($origin !== '' && parse_url($origin, PHP_URL_HOST) !== preg_replace('/:\d+\z/', '', $host)) || ($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site'))
        out(403, ['error' => 'Cross-origin writes are not allowed']);
    if (!str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) out(415, ['error' => 'JSON required']);
}

$token = $_COOKIE['zak_session'] ?? '';
$sessionKey = hash('sha256', is_string($token) ? $token : '');
$sessions = load_json("$dataDir/sessions.json");
$authenticated = is_string($token) && $token !== '' && ($sessions[$sessionKey] ?? 0) > time();
$cookie = fn(string $value, int $expires) => setcookie('zak_session', $value, ['expires' => $expires, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Strict']);

if ($route === '/api/admin/session' && $method === 'GET') out($authenticated ? 200 : 401, ['authenticated' => $authenticated]);

if ($route === '/api/admin/login' && $method === 'POST') {
    $auth = load_json("$dataDir/auth.json");
    if (empty($auth['username']) || empty($auth['passwordHash'])) out(503, ['error' => 'Admin credentials must be configured on the server.']);
    $attempts = attempts_load($dataDir);
    $ipKey = 'login:' . client_ip();
    // The global counter caps brute force even if X-Forwarded-For is rotated.
    if (attempts_count($attempts, $ipKey) >= 5 || attempts_count($attempts, 'login:all') >= 25) out(429, ['error' => 'Too many attempts. Try again in 15 minutes.']);
    $body = read_body(4096);
    $user = prop($body, 'username'); $pass = prop($body, 'password');
    $passOk = is_string($pass) && strlen($pass) <= 1024 && password_verify($pass, $auth['passwordHash']);
    if (!(is_string($user) && hash_equals((string)$auth['username'], $user)) || !$passOk) {
        attempts_bump($dataDir, $attempts, [$ipKey, 'login:all']);
        out(401, ['error' => 'Invalid username or password.']);
    }
    unset($attempts[$ipKey]);
    save_json("$dataDir/attempts.json", $attempts);
    $newToken = bin2hex(random_bytes(32));
    $sessions = array_filter($sessions, fn($expiry) => $expiry > time());
    $sessions[hash('sha256', $newToken)] = time() + 7 * 86400;
    save_json("$dataDir/sessions.json", $sessions);
    $cookie($newToken, time() + 7 * 86400);
    out(200, ['success' => true]);
}
if ($route === '/api/admin/logout' && $method === 'POST') {
    unset($sessions[$sessionKey]);
    save_json("$dataDir/sessions.json", $sessions);
    $cookie('', time() - 3600);
    out(200, ['success' => true]);
}
if ($route === '/api/portfolio-data' && $method === 'GET') {
    $file = is_file("$dataDir/data.json") ? "$dataDir/data.json" : __DIR__ . '/seed.json';
    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    readfile($file);
    exit;
}
if ($route === '/api/mail' && $method === 'POST') {
    $attempts = attempts_load($dataDir);
    $mailKey = 'mail:' . client_ip();
    if (attempts_count($attempts, $mailKey) >= 5) out(429, ['error' => 'Please wait before sending another inquiry.']);
    $body = read_body(20000);
    if (truthy(prop($body, 'website'))) out(200, ['success' => true]); // honeypot: real visitors never fill this hidden field
    foreach (['name', 'email', 'subject', 'message'] as $k) {
        $v = prop($body, $k);
        if (!is_string($v) || trim($v) === '' || mb_strlen($v) > 8000) out(400, ['error' => 'Complete all inquiry fields with a valid email address.']);
    }
    if (!filter_var(prop($body, 'email'), FILTER_VALIDATE_EMAIL)) out(400, ['error' => 'Complete all inquiry fields with a valid email address.']);
    attempts_bump($dataDir, $attempts, [$mailKey]);
    $messages = load_json("$dataDir/messages.json");
    if (count($messages) >= 1000) out(503, ['error' => 'Inbox is full. Please use a published contact link.']);
    $id = bin2hex(random_bytes(12));
    array_unshift($messages, ['id' => $id, 'name' => $body->name, 'email' => $body->email, 'subject' => $body->subject, 'message' => $body->message, 'timestamp' => iso_now(), 'read' => false]);
    save_json("$dataDir/messages.json", $messages);
    out(200, ['success' => true, 'id' => $id, 'message' => 'Inquiry saved to the portfolio inbox.']);
}

if (!$authenticated) out(401, ['error' => 'Your admin session has expired. Sign in again.']);

if ($route === '/api/portfolio-data' && $method === 'POST') {
    $body = read_body(8000000);
    if (!valid_portfolio($body)) out(400, ['error' => 'Invalid portfolio data. Check categories, required fields, progress, and URLs.']);
    unset($body->_localOnly);
    $body->lastUpdated = iso_now();
    save_json("$dataDir/data.json", $body);
    out(200, ['success' => true, 'data' => $body]);
}
if ($route === '/api/messages' && $method === 'GET') out(200, load_json("$dataDir/messages.json"));
if ($route === '/api/messages/delete' && $method === 'POST') {
    $id = prop(read_body(4096), 'id');
    save_json("$dataDir/messages.json", array_values(array_filter(load_json("$dataDir/messages.json"), fn($m) => ($m['id'] ?? null) !== $id)));
    out(200, ['success' => true]);
}
out(404, ['error' => 'Endpoint not found']);
