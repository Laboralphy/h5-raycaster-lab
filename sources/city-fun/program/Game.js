O2.extendClass('CITYFUN.Game', O876_Raycaster.GameAbstract, {

	_weapons: null,

	init: function() {
		this.on('leveldata', function(wd) {
			wd.data = LEVEL_DATA[Object.keys(LEVEL_DATA)[0]];
			wd.data.tiles = TILES_DATA;
			wd.data.blueprints = BLUEPRINTS_DATA;
            wd.data.weapons = WEAPONS_DATA;
		});

		this.on('enter', function() {
			this.weapon('w_rick_pistol');
			this.oRaycaster.oCamera.getThinker().on('button0.down', this.gameEventCommand0.bind(this));
		});

	},

	fire: function() {
		let wl = this.oRaycaster.oWeaponLayer;
		wl.fire();
		let p = this.oRaycaster.oCamera;
		let xoffs = 12 * Math.cos(p.fTheta + Math.PI / 2);
		let yoffs = 12 * Math.sin(p.fTheta + Math.PI / 2);
		let m = this.spawnMobile('m_blast_1', xoffs + p.x, yoffs + p.y, p.fTheta);
		m.fSpeed = 16;
		let th = m.getThinker();
		th.nStepSpeed = 4;
		th.fire(p);
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
