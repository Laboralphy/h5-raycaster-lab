<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8"/>
		<title>TITLE</title>
		<link rel="stylesheet" type="text/css" href="styles/responsive/normalize.css" media="all"/>
		<link rel="stylesheet" type="text/css" href="styles/responsive/starter.css" media="all"/>
		<link rel="stylesheet" type="text/css" href="styles/responsive/custom.css" media="all"/>
		<link rel="stylesheet" type="text/css" href="styles/responsive/colors.css" media="all"/>
		<!-- npm install mdi -->
		<!-- <link rel="stylesheet" type="text/css" href="node_modules/mdi/css/materialdesignicons.min.css" media="all"/> -->
		
		<!--[if lt IE 9]>
		<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->

		<!-- MOBILE NO RESCALE DIRECTIVE -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
		<style>
figure {
    border: outset 0.2em #777;
    width: 21.5em;
    background-color: #777;
}
figure img {
    width: 20em;
    margin-left: 0.5em;
}

figure figcaption {
    margin-left: 0.5em;
}
		</style>
	</head>
	<body id="application">
		<!-- 
		
		starter.css
		
		class:row defines a new row 
		-->
		<div class="row">
			<!--
			
			starter.css
			
			class:col defines a new column 
			class:lg-x defines column size when screen is large (x from 0 to 12)
			class:md-x defines column size when screen is medium
			class:sm-x defines column size when screen is small
			class:xs-x defines column size when screen is extra small
			
			priority is "lg" then "md", "sm" and "xs"
			
			-->
			<div class="col lg-12">
				<!--
				
				custom.css
				
				class:card creates a 100% wide card, must be included in a col for better effect
				class:title creates a title
				
				-->
				<div class="card">
					<h3 class="title blue">Raycaster</h3>
					<!--
					
					starter.css
					
					class:btn applied on "a" inside a nav>ul>li
					class:title creates a title
					
					-->
					<nav>
						<ul>
							<li><a class="btn" href="#">Modules</a></li>
							<li><a class="btn" href="#">Sources</a></li>
							<li><a class="btn" href="#">Editor</a></li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col lg-12">
				<div class="card">
<?php
    $aSources = array('mansion');
    foreach ($aSources as $s) {
        print <<<EOT
        <figure>
		    <img src="../../sources/$s/thumbnail.png" />
		    <figcaption>$s</figcaption>
		</figure>
EOT;

    }
?>
				</div>
			</div>
		</div>
	</body>
</html>
