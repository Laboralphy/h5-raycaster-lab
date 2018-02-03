O2.extendClass('CITYFUN.Game', O876_Raycaster.GameAbstract, {

	_weapons: null,

	init: function() {
		this.on('leveldata', function(wd) {
			wd.data = LEVEL_DATA[Object.keys(LEVEL_DATA)[0]];
			wd.data.tiles = TILES_DATA;
            wd.data.weapons = WEAPONS_DATA;
		});

		this.on('enter', function() {
		});
	},

	weapon: function(n) {
		var rc = this.oRaycaster;
		rc.weapon(n);
	},



});
window.addEventListener('load', function() {
    MAIN.configure(CONFIG);
    MAIN.run();
});
