/**
 * Warami
 * Chasse en zig zag
 * se téléporte a proximité de la cible en cas de perte de vue
 */
O2.extendClass('MANSION.GWaramiThinker', MANSION.VengefulThinker, {
	thinkIdle: function() {
		__inherited();
		var oTarget = this.getTarget();
		if (this.isEntityVisible(oTarget)) {
			this.setThink('ZigZagChase', 300);
		} else {
			this.teleportRandom(128, 256); 
		}
		
	}
});
