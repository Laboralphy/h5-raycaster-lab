/**
 * Retaliater :
 * Ce thinker ne fait que poursuivre la cible, 
 * S'il est touché, il tire un missile.
 * il se téléporte a proximité de la cible en cas de perte de vue
 */
O2.extendClass('MANSION.GRetaliaterThinker', MANSION.VengefulThinker, {

	_bImHit: false,

	damage: function(nAmount, bCritical) {
		this._bImHit = true;
		__inherited(nAmount, bCritical);
	},

	thinkIdle: function() {
		__inherited();
		var oTarget = this.getTarget();
		if (this.isEntityVisible(oTarget)) {
			if (this._bImHit) {
				this._bImHit = false;
				this.shoot();
			}
			this.setThink('Chase', 120);
		} else {
			this.teleportRandom(128, 256); 
		}
	}
});
