<?php
$h = $this->Document();

$md = $h->query('section.body');
$md->append(
	$this->Card(
		'Welcome to the Raycaster Javascript Framework website.', 
		'<b>What I usually do here : </b>',
		$this->UList(array(
			'Game development', 
			'HTML 5 games dev', 
			'Raycasting games dev'
		))
	)
);

print $h;
