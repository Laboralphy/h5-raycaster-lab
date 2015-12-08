<?php
$s = $this->name;
?>
<p>The game is built. You can either play it now on your browser, or download the source code as zip archive file.</p>
<ul>
	<li><a href="<?php print "games/work.storage/$s/"; ?>" target="_blank">Run the game online</a></li>
	<li><a href="<?php print "games/z.storage/$s.zip"; ?>">Download the game (zip file)</a></li>
</ul>
<p><button type="button" onclick="W.hidePopup()">Close</button></p>
