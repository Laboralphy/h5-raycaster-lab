<?php
require_once 'fs.php';
// Create a new file

$sData = $HTTP_RAW_POST_DATA;
$aPostData = json_decode($sData);
$sFile = $aPostData->f;
$aData = $aPostData->d;
fw($sFile, json_encode($aData));
