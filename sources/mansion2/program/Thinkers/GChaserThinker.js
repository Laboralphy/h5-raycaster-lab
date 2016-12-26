/**
 * Chaser :
 * Ce thinker ne fait que poursuivre la cible, 
 * se téléporte a proximité de la cible en cas de perte de vue
 */
O2.extendClass('MANSION.GChaserThinker', MANSION.VengefulThinker, {
	thinkIdle: function() {
		__inherited();
		var oTarget = this.getTarget();
		if (this.isEntityVisible(oTarget)) {
			this.setThink('Chase', 120);
		} else {
			var m = this.oMobile;
			this.teleportRandom(128, 256); 
		}
		
	}
});
