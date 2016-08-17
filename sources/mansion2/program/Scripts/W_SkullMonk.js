/**
 * Fait apparaitre un fantome
 */
O2.createClass('MANSION.Script.W_SkullMonk', {
	spawn: function(data) {
		var g = data.game;
		g.spawnWraith
		data.game.spawnGhost('g_pat', (data.x + 1) * 64 + 32, (data.y - 2) * 64 + 32);
		//data.game.spawnMobile('g_head4', (data.x - 1) * 64 + 32, (data.y - 2) * 64 + 32);
		data.remove = true;
	}
});
