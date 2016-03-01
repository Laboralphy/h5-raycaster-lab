/**
 * Chaser :
 * Ce thinker ne fait que poursuivre la cible, 
 * il se téléporte a proximité de la cible en cas de collision avec un mur
 * ou tout autre obstacle qui l'empecherai d'atteinf se cible
 */
O2.extendClass('MANSION.G_ZigzagThinker', MANSION.VengefulThinker, {
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
