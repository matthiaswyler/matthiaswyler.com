<?php

/**
 * PHP-FPM Socket Connection Test
 * 
 * This script tests the PHP-FPM socket connection directly
 * Run: php test_phpfpm.php
 */

$socketPath = "/Users/user/Library/Application Support/Herd/herd84.sock";

echo "=== PHP-FPM Socket Connection Test ===\n\n";

// 1. Check if socket exists
echo "1. Checking socket file...\n";
if (!file_exists($socketPath)) {
  die("   ❌ Socket file does not exist: $socketPath\n");
}
echo "   ✓ Socket file exists\n";

// 2. Check socket type
echo "\n2. Checking socket type...\n";
if (!is_file($socketPath) && filetype($socketPath) === 'socket') {
  echo "   ✓ Is a valid socket\n";
} else {
  echo "   ⚠ File type: " . filetype($socketPath) . "\n";
}

// 3. Check permissions
echo "\n3. Checking permissions...\n";
$perms = fileperms($socketPath);
$permsOct = substr(sprintf('%o', $perms), -4);
echo "   Permissions: $permsOct\n";
if ($permsOct === '0777' || $permsOct === '0666') {
  echo "   ✓ Permissions are correct (readable/writable)\n";
} else {
  echo "   ⚠ Permissions might be too restrictive\n";
}

// 4. Check owner
echo "\n4. Checking ownership...\n";
$stat = stat($socketPath);
$owner = posix_getpwuid($stat['uid']);
$group = posix_getgrgid($stat['gid']);
echo "   Owner: {$owner['name']} ({$stat['uid']})\n";
echo "   Group: {$group['name']} ({$stat['gid']})\n";

// 5. Test socket connection
echo "\n5. Testing socket connection...\n";
$socket = @stream_socket_client("unix://$socketPath", $errno, $errstr, 2);
if ($socket) {
  echo "   ✓ Successfully connected to socket!\n";
  echo "   ✓ Socket is accepting connections\n";
  fclose($socket);
} else {
  echo "   ❌ Failed to connect: $errstr ($errno)\n";
  echo "   This means PHP-FPM is not accepting connections\n";
}

// 6. Check PHP-FPM process
echo "\n6. Checking PHP-FPM process...\n";
$processes = shell_exec("ps aux | grep 'php-fpm.*8.4.*master' | grep -v grep");
if ($processes) {
  echo "   ✓ PHP-FPM 8.4 master process is running\n";
  $lines = explode("\n", trim($processes));
  foreach ($lines as $line) {
    if (preg_match('/\s+(\d+)\s+/', $line, $matches)) {
      echo "   PID: {$matches[1]}\n";
    }
  }
} else {
  echo "   ❌ PHP-FPM 8.4 master process is NOT running\n";
  echo "   Run: herd restart\n";
}

// 7. Test actual PHP execution (if we can connect)
echo "\n7. Testing PHP execution via socket...\n";
if ($socket = @stream_socket_client("unix://$socketPath", $errno, $errstr, 2)) {
  // This is a simplified test - full FastCGI protocol would be more complex
  echo "   ✓ Socket connection works\n";
  echo "   Note: Full FastCGI protocol test requires cgi-fcgi or similar tool\n";
  fclose($socket);
} else {
  echo "   ⚠ Cannot test execution without socket connection\n";
}

echo "\n=== Test Complete ===\n";
echo "\nIf all checks pass but you still get 502, the issue is likely:\n";
echo "1. Nginx configuration problem\n";
echo "2. FastCGI protocol mismatch\n";
echo "3. PHP-FPM pool configuration issue\n";
echo "\nNext steps:\n";
echo "- Check Nginx error logs: tail -f ~/Library/Application\\ Support/Herd/Log/nginx-error.log\n";
echo "- Check PHP-FPM logs: tail -f ~/Library/Application\\ Support/Herd/Log/php-fpm.log\n";
echo "- Verify Nginx config: Check fastcgi_pass directive in site config\n";
