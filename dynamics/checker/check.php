<?php
/**
 * Will enumerate all regular files recursively inside a directory
 * Will call a callback function for each files found
 * Will not enumerate folders
 */
function findFiles($sDir, $pCallback) {
	$aFiles = scandir($sDir);
	foreach ($aFiles as $sFile) {
		if ($sFile !== '.' && $sFile !== '..') {
			if (is_dir($sDir . '/' . $sFile)) {
				findFiles($sDir . '/' . $sFile, $pCallback);
			} else {
				$pCallback($sDir . '/' . $sFile);
			}
		}
	}
}

function checkDirectory($sDir) {
	$a = array();
	findFiles('../../' . $sDir, function($sFile) use (&$a) {
		if (substr($sFile, -3) === '.js') {
			$a[] = $sFile;
		}
	});
	
}

	</head>
	<body>
<?php
/**
 * Will enumerate all regular files recursively inside a directory
 * Will call a callback function for each files found
 * Will not enumerate folders
 */
function findFiles($sDir, $pCallback) {
	$aFiles = scandir($sDir);
	foreach ($aFiles as $sFile) {
		if ($sFile !== '.' && $sFile !== '..') {
			if (is_dir($sDir . '/' . $sFile)) {
				findFiles($sDir . '/' . $sFile, $pCallback);
			} else {
				$pCallback($sDir . '/' . $sFile);
			}
		}
	}
}

function checkDirectory($sDir) {
	findFiles('../../' . $sDir, function($sFile) {
		if (substr($sFile, -3) === '.js') {
			print '<div class="file">' . $sFile . '</div>' . "\n";
		}
	});
}



function main() {
	checkDirectory('libraries');
}

main();

?>	
	</body>
</html>
