/**
 * Dementia
 * Chasse en zig zag (33%) ou en direct (33%)
 * Lorsqu'elle est assez pret elle va se téléporter au hasard et rusher
 * se téléporte a proximité de la cible en cas de perte de vue
 */
O2.extendClass('MANSION.GZigZagTeleRusherThinker', MANSION.VengefulThinker, {

	bRush: false,
	
	thinkIdle: function() {
		__inherited();
		var oTarget = this.getTarget();
		
		if (this.bRush) {
			this.bRush = false;
			this.setThink('Rush', 500);
			return;
		}
		
		if (this.isEntityVisible(oTarget)) {
			var nDecision = MathTools.rnd(1, 2);
			if (this.distanceTo(oTarget) < 128) {
				nDecision += 2;
			}
			switch (nDecision) {
				case 1:
					this.setThink('Chase', 50);
				break;
					
				case 2:
					this.setThink('ZigZagChase', 200);
				break;
				
				case 3:
				case 4:
					this.bRush = true;
					this.teleportRandom(128, 256); 
				break;
			}
		} else {
			this.teleportRandom(128, 256); 
		}
	}
});
