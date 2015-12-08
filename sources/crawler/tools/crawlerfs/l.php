<?php
// FILE APPEND CONTROLLER
// append a line of data into a log file.

require_once 'fs.php';

date_default_timezone_set('Europe/Paris');

$sData = $HTTP_RAW_POST_DATA;
$aPostData = json_decode($sData);
$sFile = $aPostData->f;
$aData = $aPostData->d;
fa($sFile, date('[Y-m-d H:i:s]') . ' ' . json_encode($aData) . "\n");
