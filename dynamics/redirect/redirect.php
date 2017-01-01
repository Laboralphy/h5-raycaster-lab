<?php
/**
 * Redirects to spcified url with specified http status code
 * @param string $url new url
 * @param integer $statusCode defautlt 303 "moved permantly"
 */
function redirect($url, $statusCode = 303) {
   	header('Location: ' . $url, true, $statusCode);
	die();
}

/**
 * Redirect to specified url relative to the current url
 * @param string $url new url
 * @param integer $statusCode defautlt 303 "moved permantly"
 */ 
function relativeRedirection($url, $statusCode = 303) {
	$aUrl = array_filter(array_merge(
		explode('/', $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']),
		explode('/', $url)
	), function($v) {
		return $v !== '';
	});
	redirect('//' . implode('/', $aUrl), $statusCode);
}

