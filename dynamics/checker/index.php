<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>JS checker with JSHINT</title>
		
		<style>
div.checkpad {
	font-family: monospace;
}
			
div.checkpad div.files {
	display: none;
}

div.checkpad div.title {
	font-size: 120%;
	font-weight: bold;
}

div.checkpad div.currentFile {
	opacity: 0.5;
}

div.checkpad progress {
	width: 480px;
}

div.checkpad table.report tr.event td {
	border: solid thin #999;
}


		</style>

		<!-- JQuery plugins -->
		<script type="text/javascript" src="../../externals/jquery/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="../../externals/jshint/jshint.js"></script>
		<script type="text/javascript">

function main() {
	var $files = $('div.file');
	var aFiles = [];
	$files.each(function() {
		aFiles.push($(this).data('file'));
	});
	var nMax = aFiles.length;
	var $progress = $('progress');
	$progress.attr('max', nMax);
	$progress.attr('value', 0);
	$current = $('div.currentFile');
	var i = 0;
	var aReports = [];
	function processNextFile() {
		var f = aFiles.shift();
		if (f) {
			$current.html(f);
			$.get(f, function(data) {
				JSHINT(data, {
					curly: true,
					undef: false,
					unused: false
				}, {
					Uint32Array: false,
					window: false,
					console: false,
					document: false
				});
				var aTr = JSHINT.errors.filter(function(r2) {
					return !!r2;
				}).filter(function(r2) {
					return r2.code === 'W033';
				}).map(function(r2) {
					return '<tr class="event"><td>' + r2.code + '</td><td>' + r2.line + '</td><td>' + r2.character + '</td><td>' + r2.reason + '</td></tr>';
				});
				var sReport = '<table class="report"><tr class="file"><th colspan="3">' + f + '</th></tr><tr class="header"><th>code</th><th>line</th><th>char</th><th>reason</th></tr>' + aTr.join('') + '</table>';
				if (JSHINT.errors.length && aTr.length) {
					aReports.push(sReport);
				}
				processNextFile();
			}, 'text');
		} else {
			$current.html('');
			$('div.checkpad div.report').html(aReports.join(''));
			$('div.checkpad div.title').html('Analysis done.');
			$progress.css('visibility', 'hidden');
		}
		$progress.attr('value', i++);
	}
	processNextFile();
}

$(window).on('load', main);
		
		</script>
	</head>
	<body>
		<div class="checkpad">
			<div class="title">Analysis...</div>
			<div><progress></progress></div>
			<div class="currentFile"></div>
			<div class="report"></div>
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

function checkDirectory($aDir) {
	if (!is_array($aDir)) {
		$aDir = array($aDir);
	}
	print '<div class="files">' . "\n";
	foreach ($aDir as $sDir) {
		findFiles('../../' . $sDir, function($sFile) {
			if (substr($sFile, -3) === '.js') {
				print '<div class="file" data-file="' . $sFile . '">' . $sFile . '</div>' . "\n";
			}
		});
	}
	print '</div>' . "\n";
}



function main() {
	checkDirectory(array('libraries', 'sources'));
}

main();

?>	
		</div>
	</body>
</html>
