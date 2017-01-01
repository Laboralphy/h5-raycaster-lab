/**
 * Warami
 * Chasse en zig zag
 * se téléporte a proximité de la cible en cas de perte de vue
 */
O2.extendClass('MANSION.GZigZagThinker', MANSION.VengefulThinker, {
	thinkIdle: function() {
		__inherited();
		var oTarget = this.getTarget();
		if (this.isEntityVisible(oTarget)) {
			this.setThink('ZigZagChase', MAIN.rand(300, 400));
		} else {
			this.teleportRandom(128, 256); 
		}
	}
});
