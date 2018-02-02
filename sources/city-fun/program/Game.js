O2.extendClass('CITYFUN.Game', O876_Raycaster.GameAbstract, {
	init: function() {
		this.on('leveldata', function(wd) {
			wd.data = LEVEL_DATA[Object.keys(LEVEL_DATA)[0]];
			for (var tile in TILES_DATA) {
                wd.data.tiles[tile] = TILES_DATA[tile];
			}
		});

		this.on('enter', function() {
			var rc = this.oRaycaster;
			var wl = new O876_Raycaster.WeaponLayer();
			wl.tile = rc.getTile('w_rick_pistol');
			wl.base(250, 150);
			wl.playAnimation(0);
			rc.weapon(wl);
		})
	}



});
window.addEventListener('load', function() {
    MAIN.configure(CONFIG);
    MAIN.run();
});