/**
 * Chaser :
 * Ce thinker ne fait que poursuivre la cible, 
 * il se téléporte a proximité de la cible en cas de collision avec un mur
 */
O2.extendClass('MANSION.G_ChaserThinker', MANSION.VengefulThinker, {
	thinkIdle: function() {
		__inherited();
		var oTarget = this.getTarget();
		if (this.isEntityVisible(oTarget)) {
			this.setThink('Chase', 120);
		} else {
			this.teleportRandom(128, 256); 
		}
		
	}
});
