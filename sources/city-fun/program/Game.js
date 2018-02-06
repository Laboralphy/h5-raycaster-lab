O2.extendClass('CITYFUN.Game', O876_Raycaster.GameAbstract, {

	_weapons: null,

	init: function() {
		this.on('leveldata', function(wd) {
			wd.data = LEVEL_DATA[Object.keys(LEVEL_DATA)[0]];
			wd.data.tiles = TILES_DATA;
            wd.data.weapons = WEAPONS_DATA;
		});

		this.on('enter', function() {
			this.weapon('w_tromblon');
			this.oRaycaster.oCamera.getThinker().on('button0.down', this.gameEventCommand0.bind(this));
		});

	},
	fire: function() {
		let wl = this.oRaycaster.oWeaponLayer;
		wl.fire();
	},

	weapon: function(n) {
		var rc = this.oRaycaster;
		rc.weapon(n);
	},

	gameEventCommand0() {
		this.fire();
	}

});
window.addEventListener('load', function() {
    MAIN.configure(CONFIG);
    MAIN.run();
});
