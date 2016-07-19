<?php
function redirect($url, $statusCode = 303) {
   header('Location: ' . $url, true, $statusCode);
   die();
}

redirect('//' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . '/dynamics/website/', 301);
