O2.extendClass('CITYFUN.Game', O876_Raycaster.GameAbstract, {

	_weapons: null,

	init: function() {
		this.on('leveldata', function(wd) {
			wd.data = LEVEL_DATA[Object.keys(LEVEL_DATA)[0]];
			for (var tile in TILES_DATA) {
                wd.data.tiles[tile] = TILES_DATA[tile];
			}
		});

		this.on('enter', function() {
			var rc = this.oRaycaster;
			var wl;
			this._weapons = [];
			wl = new O876_Raycaster.WeaponLayer();
			wl.tile = rc.getTile('w_rick_pistol_2');
			wl.base(240, 150, 250);
			wl.playAnimation(0);
			this._weapons.push(wl);
			rc.weapon(wl);

			wl = new O876_Raycaster.WeaponLayer();
			wl.tile = rc.getTile('w_tromblon');
			wl.base(240, 150, 250);
			wl.playAnimation(0);
			this._weapons.push(wl);

		})
	},

	weapon: function(n) {
		var rc = this.oRaycaster;
		rc.oWeaponLayer.sheat(() => {
			var wl = this._weapons[n];
			rc.weapon(wl);
			wl.unsheat();
		});
	},



});
window.addEventListener('load', function() {
    MAIN.configure(CONFIG);
    MAIN.run();
});