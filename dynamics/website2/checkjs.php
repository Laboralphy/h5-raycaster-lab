<?php
require_once('NetworkHelper.php');
if (!NetworkHelper::isLocalHost()) {
	die();
}
define('TITLE', 'Validate Javascript sources');
define('SOURCES', '../../sources/');
include 'header.php';
include 'mainmenu.php';

?>



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



function displayFilesToBeChecked() {
	checkDirectory(array('libraries', 'sources'));
}

?>	




	<div class="checkerSection">
		<style scoped="scoped">
div.checkpad {
	font-family: monospace;
}

div.checkpad progress {
	width: 100%;
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

div.checkpad table.report tr.event td {
	border: solid thin #999;
}

div.options {
	
}

		</style>

		<!-- JQuery plugins -->
		<script type="text/javascript" src="../../externals/jquery/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="../../externals/jshint/jshint.js"></script>
		<script type="text/javascript">

function checkProcess() {
	$('div.output').show();
	var $files = $('div.file');
	var aFiles = [];
	$files.each(function() {
		aFiles.push($(this).data('file'));
	});
	var nMax = aFiles.length;
	var $progress = $('progress');
	$progress.css('visibility', 'visible');
	$progress.attr('max', nMax);
	$progress.attr('value', 0);
	$current = $('div.currentFile');
	var aOptionErrors = {};
	var aAllErrors = [];
	var bAllOtherErrors = false;
	$('input.check-option').each(function() {
		var $opt = $(this);
		aOptionErrors[$opt.data('code')] = $opt.prop('checked');
	});
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
					var sCode = r2.code;
					if (!(sCode in aOptionErrors)) {
						sCode = 'WXXX';
					}
					return aOptionErrors[sCode];
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

		
		</script>
		
	<div class="row">
		<div class="col-lg-12">
			<div class="card">
				<h2>Javascript validation process</h2>
				<div class="">
					<nav>
					<ul>
						<li><a class="btn" href="Javascript:checkProcess();"><span class="icon-clipboard"></span> Run</a></li>
					</ul>
					</nav>
					<div class="options row">
<?php

function generateCheckbox($sOptionCode, $sLabel, $bChecked = false) {
	print '<div class="col-lg-3 col-sm-4 col-xs-6"><input class="check-option" type="checkbox" id="check_' . $sOptionCode . '" ' . ($bChecked ? 'checked="checked"' : '') . ' data-code="' . $sOptionCode . '" /> <label for="check_'. $sOptionCode . '">' . $sLabel . '</label></div>';
}

generateCheckbox('W032', 'unnecessary semi-colon', true);
generateCheckbox('W033', 'missing semi-colon', true);
generateCheckbox('W075', 'duplicate key', true);
generateCheckbox('W041', '=== operator', true);
generateCheckbox('W004', 'already defined', true);
generateCheckbox('W027', 'unreachable break', true);
generateCheckbox('W098', 'unused', true);
generateCheckbox('W069', 'dot notation', true);
generateCheckbox('WXXX', 'all other errors', false);

?>
					</div>
					<div class="checkpad">
					<?php displayFilesToBeChecked(); ?>
						<div class="explain">Will check all source &amp; library files and find javascript errors.</div>
						<div class="output" style="display: none">
							<div class="title">Analysis...</div>
							<div><progress></progress></div>
							<div class="currentFile"></div>
							<div class="report"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
		
		
</div>


<?php
include 'footer.php';
?>
