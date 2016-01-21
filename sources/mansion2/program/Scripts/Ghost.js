/**
 * Fait apparaitre un fantome
 */
O2.createClass('MANSION.Script.Ghost', {
	spawn: function(data) {
		console.log('GHOST');
		//data.game.spawnMobile('g_head2', data.x * 64 + 32, (data.y - 2) * 64 + 32);
		data.game.spawnMobile('g_head1', (data.x + 1) * 64 + 32, (data.y - 2) * 64 + 32);
		//data.game.spawnMobile('g_head3', (data.x - 1) * 64 + 32, (data.y - 2) * 64 + 32);
		data.remove = true;
	}
});
