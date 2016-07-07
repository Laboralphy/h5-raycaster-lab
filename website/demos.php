<?php
define('TITLE', 'Demos');
define('SOURCES', '../sources/');
include 'header.php';
include 'mainmenu.php';

function getDemoList() {
	$aList = array();
	foreach (scandir(SOURCES) as $sSource) {
		if (substr($sSource, 0, 1) != '.') {
			$aList[] = $sSource;
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
			<nav><ul>
			
<?php
foreach (getDemoList() as $s) {
	print '<li><a href="' . SOURCES . $s . '/" class="btn">' . $s . '</a></li>';
}
?>		
			</ul></nav>
		</div>
	</div>
</div>

<?php
include 'footer.php';
?>
