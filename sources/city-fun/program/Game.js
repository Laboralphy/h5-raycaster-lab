O2.extendClass('CITYFUN.Game', O876_Raycaster.GameAbstract, {

	_weapons: null,

	init: function() {

        let wd = LEVEL_DATA[Object.keys(LEVEL_DATA)[0]];
		wd.tiles = TILES_DATA;
		wd.blueprints = BLUEPRINTS_DATA;
		wd.weapons = WEAPONS_DATA;
		this.initRaycaster(wd);
        this.on('enter', (function() {
            this.weapon('w_rick_pistol');
            this.oRaycaster.oCamera.getThinker().on('button0.down', this.gameEventCommand0.bind(this));
        }).bind(this));
	},

	fire: function() {
		let wl = this.oRaycaster.oWeaponLayer;
		wl.fire();
		let p = this.oRaycaster.oCamera;
		let xoffs = 12 * Math.cos(p.fTheta + Math.PI / 2);
		let yoffs = 12 * Math.sin(p.fTheta + Math.PI / 2);
		let m = this.spawnMobile('m_blast_1', xoffs + p.x, yoffs + p.y, p.fTheta);
		m.fSpeed = 64;
		let th = m.getThinker();
		th.nStepSpeed = 1;
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
    MAIN.run(new CITYFUN.Game(CONFIG));
});
