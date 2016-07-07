<?php
define('TITLE', 'Demos');
define('SOURCES', '../sources/');
include 'header.php';
include 'mainmenu.php';

/**
 * Will get all projects that have thumbnail.png
 */
function getDemoList() {
	$aList = array();
	foreach (scandir(SOURCES) as $sSource) {
		if (substr($sSource, 0, 1) != '.') {
			if (file_exists(SOURCES . $sSource . '/thumbnail.png')) {
				$aList[] = $sSource;
			}
		}
	}
	return $aList;
}


?>

<div class="row">
	<div class="col-lg-12">
		<div class="card">
			<h2>Demos and Work in progress</h2>
			<p>Here is a list of demos and Works in progress. Click on any link below to play the corresponding game.</p>
			<div class="row">
<?php
foreach (getDemoList() as $s) {
	$sSrc = SOURCES . $s;
	$sImage = $sSrc . '/thumbnail.png';
	print '<div class="col-lg-3 col-sm-6 col-xs-12">
			<figure>
				<img src="' . $sImage . '"/>
				<figcaption><a href="' . $sSrc . '/" class="btn">' . $s . '</a></figcaption>
			</figure>
		</div>';
//	print '<li><a href="' . SOURCES . $s . '/" class="btn">' . $s . '</a></li>';
}
?>		
			</div>
		</div>
	</div>
</div>

<?php
include 'footer.php';
?>
