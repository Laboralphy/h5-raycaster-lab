/**
 * Chaser :
 * Ce thinker ne fait que poursuivre la cible, 
 * il se téléporte a proximité de la cible en cas de collision avec un mur
 */
O2.extendClass('MANSION.VSPlacidThinker', MANSION.VengefulThinker, {
	thinkIdle: function() {
		__inherited();
		this.setThink('Chase', 120);
	}
});
