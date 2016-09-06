<?php
define('TITLE', 'Features');
include 'header.php';
include 'mainmenu.php';

/**
 * The function renders texts
 * Several texts may be specified, each one will be appended to a P tag
 */
function renderParag($aData) {
	$sTitle = array_shift($aData);
	$p = '<p>' . implode('</p><p>', $aData) . '</p>';
	print '<div class="row">
		<div class="col-lg-12">
			<b>' . $sTitle . '</b>
			' . $p . '
		</div>
	</div>';
}


/**
 * The function takes an array of pair (image-ref, caption)
 * and renders a list of div and figures...
 */
function renderImageList($aImages) {
	print '<div class="row">';
	for ($i = 0; $i < count($aImages); $i += 2) {
		$sSrc = $aImages[$i];
		$sCap = $aImages[$i + 1];
		print '<div class="col-lg-4 col-sm-6 col-xs-12">';
		print '<figure><img src="images/' . $sSrc . '"/><figcaption>' . $sCap . '</figcaption></figure>';
		print '</div>';
	}
	print '</div>';
}

/**
 * Renders a card text + image
 * images are optionnals
 */
function renderCard($aText, $aImages = null) {
	print '<div class="card">';
	renderParag($aText);
	if ($aImages) {
		renderImageList($aImages);
	}
	print '</div>';
}

/**
 * Renders several cards
 */
function renderCards($aData) {
	foreach ($aData as $d) {
		if (count($d) > 1) {
			renderCard($d[0], $d[1]);
		} else {
			renderCard($d[0]);
		}
	}
}


?>

<div class="row">
	<div class="col-lg-12">
		<?php
			renderCards(array(
				array(
					array(
						'Basic raycasting',
						'The primary task of a Raycasting Engine is to render 3D simplified environnement. Some would say that Raycasting is a 2.5D algorithm because the 3D environnement is extremly basic : only perpendicular walls only flat floor and ceiling, and so on...',
						'Here are some functionalities provided by my Raycasting Engine :'
					)
				),
				array(
					array(
						'Door management',
						'There are several type of doors, the only difference is the way they open : They can slide to any direction (left, right, top, bottom), there are even double panel sliding doors as well.',
						'The engine manages auto-closing doors, and manual-closing doors.'
					),
					array(
						'feats/open-door/open-door-0.png', 'Double panel door',
						'feats/open-door/open-door-1.png', 'Top sliding door'
					)
				),
				array(
					array(
						'Secret door management',
						'Just like wolfenstein 2D, walls can be pushed to reveal secret areas.'
					),
					array(
						'feats/secret-door/secret-door-0.png', 'This wall has been pushed, and reveals a hidden zone !'
					)
				),
				array(
					array(
						'Sprite management',
						"Animated sprites with composite effect (alpha, opacity...). Each sprite can have several overlays so rendering \"haze\" effects is possible."
					),
					array(
						'feats/sprites/scr3.jpg', 'Sprites from Blight Magic',
						'feats/sprites/scr19.jpg', 'Sprites from Blight Magic',
						'feats/sprites/scr20.jpg', 'Sprites from Blight Magic'
					)
				),
				array(
					array(
						"Floor and ceiling textures",
						"Unlike wolfenstein 3D the floor and ceiling can have texture juste like walls."
					),
					array(
						'feats/floorceil/scr13.jpg', 'Without floor and ceiling textures',
						'feats/floorceil/scr18.jpg', "With floor and ceiling textures (looks better)."
					)
				),
				array(
					array(
						"Fog effect",
						"For dark ambiance, the more distant, the darker the walls & floor appear. The fog can be of any color. And it can have several degrees of thinkness."
					),
					array(
						'feats/fog/fog-0.png', 'Dark fog',
						'feats/fog/fog-1.png', 'No fog',
					)
				),
				array(
					array(
						"Outdoor environnement / sky texture",
						"The wall, the ceiling, and even the floor texture can be replaced by a sky texture, juste the same way as Doom."
					),
					array(
						'feats/sky/sky-0.png', 'Sky is visible outside',
						'feats/sky/sky-1.png', 'Red sky outside',
						'feats/sky/sky-2.png', 'Sky is visible through the ceilling',
						'feats/sky/sky-3.png', 'Dark sky and landscape'
					)
				),
				array(
					array(
						"Double storey building",
						"The wall height can extend up to twice the initial value allowing outdoor area to have higher walls than indoor areas."
					),
					array(
						"feats/twostorey/twostorey-0.png", "Double storey building"
					)
				),
				array(
					array(
						"Animated wall textures",
						"Wall can have animated textures."
					),
					array(
						"feats/animated/aw-0.gif", "Fireplace",
						"feats/animated/aw-1.gif", "Pixel fireplace",
					)
				),
				array(
					array(
						"Dynamic texture modification",
						"Wall, floor and ceiling textures can be modified, allowing programmer to draw anything on it (like drawing on a canvas and using canvas context methods). This ability is used for static lighting (lighten walls that are near light emmiting source)."
					),
					array(
						"feats/decals/decal-0.png", "Ketchup on the wall !",
						"feats/light-effects/light-effects-1.png", "Candles may affect wall textures",
						"feats/light-effects/light-effects-0.png", "Light emmitting objects cast light and shadows on both floor and ceiling"
					)
				),
				array(
					array(
						"Audio system",
						"It can't be heared here but the embedded audio handles distances (close sounds are louder than distant ones). And it handles crossfade background soundtrack.",
					)
				)
			));
		?>	
	</div>
</div>

<?php
include 'footer.php';
?>
