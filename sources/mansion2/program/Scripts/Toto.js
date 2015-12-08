O2.createClass('MANSION.Script.Toto', {
	truc: function(data) {
		data.game.spawnMobile('g_head2', (data.x + 2) * 64 + 32, data.y * 64 + 32);
		data.remove = true;
	}
});
