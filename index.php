<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8"/>
		<title>Raycaster Projects</title>
		<link rel="stylesheet" type="text/css" href="dynamics/website/styles/responsive/normalize.css" media="all"/>
		<link rel="stylesheet" type="text/css" href="dynamics/website/styles/responsive/starter.css" media="all"/>
		<link rel="stylesheet" type="text/css" href="dynamics/website/styles/responsive/custom.css" media="all"/>
		<link rel="stylesheet" type="text/css" href="dynamics/website/styles/responsive/colors.css" media="all"/>
		<!-- MOBILE NO RESCALE DIRECTIVE -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
		<link rel="stylesheet" type="text/css" href="dynamics/website/styles/base.css" media="all" />
	</head>
	<body id="application">
		<div class="row">
			<div class="col lg-12">
				<div class="card">
					<h3 id="ws-title" class="title blue">Raycaster Projects</h3>
					<nav>
						<ul>
							<li><a class="btn" href="http://www.laboralphy.tech/">Laboralphy.tech</a></li>
							<li><a class="btn" href="dynamics/rcwe">Editor</a></li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col lg-12">
				<div class="card">
<?php
require_once 'dynamics/website/source-figure.php';
foreach(scandir('sources') as $sDir) {
    if (substr($sDir, 0, 1) !== '.') {
        printSource($sDir, $sDir);
    }
}
?>
				</div>
			</div>
		</div>
	</body>
</html>				
