/**
 * Evader :
 * Ce thinker position l'esprit à une certaine distance.
 * Au bout d'un certain temps : rushe sur la cible
 * Se téléporte a proximité de la cible en cas de perte de vue
 */
O2.extendClass('MANSION.GEvaderThinker', MANSION.VengefulThinker, {

	// distance en-deca de laquelle on rushe
	DISTANCE_SECURITY: 128,

	// distance en-deca de laquelle on s'éloigne
	DISTANCE_MIN: 256,

	// distance au-dela de laquelle on se rapproche
	DISTANCE_MAX: 512,

	// 0 < on rushe < SEC < on retreat < MIN < on évade < MAX < on chase

	thinkIdle: function() {
		__inherited();
		var oTarget = this.getTarget();


		if (this.isEntityVisible(oTarget)) {
			var nDistance = this.distanceTo(oTarget);
			if (nDistance < this.DISTANCE_SECURITY) {
				// on rushe
				this.setThink('Rush', 500);
			} else if (nDistance < this.DISTANCE_MIN) {
				this.setThink('Retreat', 120);
			} else if (nDistance < this.DISTANCE_MAX) {
				this.setThink('Evade', 120);
			} else {
				this.setThink('Chase', 120);
			}
		} else {
			this.teleportRandom(128, 256); 
		}
		
	}
});
