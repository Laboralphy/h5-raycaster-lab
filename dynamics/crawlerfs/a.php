<?php
require_once 'fs.php';

$sData = $HTTP_RAW_POST_DATA;
$aPostData = json_decode($sData);
$sFile = $aPostData->f;
$aData = $aPostData->d;
fa($sFile, json_encode($aData));