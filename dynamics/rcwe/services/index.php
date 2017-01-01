<?php 
define('PATH_TO_O876', '../../o876-php');
require_once(PATH_TO_O876 . '/Loader.php');
require_once(PATH_TO_O876 . '/MVC/bootstrap.php');
runApplication(getcwd(), 'program');
