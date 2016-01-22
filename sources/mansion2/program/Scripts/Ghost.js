/**
 * Fait apparaitre un fantome
 */
O2.createClass('MANSION.Script.Ghost', {
	spawn: function(data) {
		data.game.spawnMobile('g_head1', (data.x + 1) * 64 + 32, (data.y - 2) * 64 + 32);
		data.game.spawnMobile('g_head4', (data.x - 1) * 64 + 32, (data.y - 2) * 64 + 32);
		data.remove = true;
	}
});
