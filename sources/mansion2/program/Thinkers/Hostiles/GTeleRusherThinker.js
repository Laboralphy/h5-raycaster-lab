/**
 * Chaser qui se téléporte ou qui rush lorsqu'il est trop près du joueur
 */
O2.extendClass('MANSION.GTeleRusherThinker', MANSION.VengefulThinker, {

	// distance en-deca de laquelle on change de tactique
	DISTANCE_SECURITY: 128,
	
	thinkIdle: function() {
		__inherited();
		var oTarget = this.getTarget();
		
		if (this.isEntityVisible(oTarget)) {
			if (this.distanceTo(oTarget) < this.DISTANCE_SECURITY) {
				var nDecision = MathTools.rnd(1, 3);
				switch (nDecision) {
					case 1:
						this.setThink('Rush', 200);
					break;

					case 2:
					case 3:
						this.teleportRandom(128, 256); 
					break;
				}
			} else {
				this.setThink('Chase', 128);
			}
		} else {
			this.teleportRandom(128, 256); 
		}
	}
});
