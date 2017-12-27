<?php

function printSource($sName, $sDirectory) {
    print "<figure>
            <img src=\"sources/$sDirectory/thumbnail.png\" />
            <figcaption><a class=\"btn\" href=\"sources/$sDirectory\">$sName</a></figcaption>
        </figure>";
}

function printSources($aSources) {
    foreach ($aSources as $aEntry) {
        printSources($aEntry['name'], $aEntry['dir']);
    }
}
