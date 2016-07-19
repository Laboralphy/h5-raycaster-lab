<?php
define('TITLE', 'About');
include 'header.php';
include 'mainmenu.php'; 
?>

<div class="row">
	<div class="col-lg-12">
		<div class="card">
			<h2>What is Raycasting ?</h2>
			<p>A set of algorithms aimed at rendering simple 3D environements</p> 
		</div>
		<div class="card">
			<h2>What can you do with this framework ?</h2>
			<p>This framework provides classes and utilities for creating fast paced raycasting based games.</p>
			<ul>
				<li>The engine is 100% javascript</li>
				<li>Supports any real HTML 5 Browsers like <b>Firefox</b>, Google <b>Chrome</b> and <b>Chromium</b>.</li>
				<li>Fair performances : games will run at around 25 fps on older architectures like Intel Core2 Duo.</li>
				<li>Full screen, Pointer lock, and Audio support (mp3 and ogg).</li>
			</ul>
		</div>
		<div class="card">
			<h2>What does it look like ?</h2>
			<div class="row">
				<div class="col-lg-3 col-sm-6 col-xs-12">
					<figure>
						<img src="images/about/ambush.png"/>
						<figcaption>Reikaster underland (ambush in forest)</figcaption>
					</figure>
				</div>
				<div class="col-lg-3 col-sm-6 col-xs-12">
					<figure>
						<img src="images/about/crawler-1.jpg"/>
						<figcaption>Reikaster underland (underwater)</figcaption>
					</figure>
				</div>
				<div class="col-lg-3 col-sm-6 col-xs-12">
					<figure>
						<img src="images/about/scrmansion-1.png"/>
						<figcaption>The mansion</figcaption>
					</figure>
				</div>
				<div class="col-lg-3 col-sm-6 col-xs-12">
					<figure>
						<img src="images/about/scrmansion-7.png"/>
						<figcaption>The mansion (interior)</figcaption>
					</figure>
				</div>
			</div>
		</div>
		<div class="card">
			<h2>Inspirations</h2>
			<p>The Engine use the very same technics used by old 90's first person shooter games. The most popular in this genre was :</p>
			<div class="row">
				<div class="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-12 col-sm-offset-0">
					<figure>
						<img src="images/about/wolf3d.jpg"/>
						<figcaption>Wolfenstein 3D by Id Sofware</figcaption>
					</figure>
				</div>
			</div>
		</div>
	</div>
</div>

<?php
include 'footer.php';
?>
