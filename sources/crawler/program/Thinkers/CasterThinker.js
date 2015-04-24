/** Thinker Rusher
 * 
 * Après avoir repéré la cible : lui tirer dessus, en ajustant l'angle
 * si on est touché on strafe
 * 
 * Creer les méthode _follow et _attack pour déterminer les comportement à adopter dans ces deux modes
 * Utiliser this.oTarget pour savoir quelle cible est actuellement poursuivie
 */

O2.extendClass('CasterThinker', MobThinker, {
	nDodging: 3,
	
	
	castSpell: function() {
		// peut gérer jusqu'a 3 spells
		// avec une plus forte probabilité de lancé un sort de niveau 1 que de niveau 3
		/*
		 * proj.m : 40%
		 * sort 1 : 30%
		 * sort 2 : 20%
		 * sort 3 : 10%
		 */
		var n = MathTools.rnd(0, 9);
		switch (n) {
			case 0:
			case 1:
			case 2:
			case 3:
				this.setAttackMode();
				break;

			case 4:
			case 5:
			case 6:
				this.setCastMode(1);
				break;

			case 7:
			case 8:
				this.setCastMode(2);
				break;
				
			case 9:
				this.setCastMode(3);
				break;
		}
	},
	

	_follow: function(nTime) {
		var nCT = null;
		if (this.nDodging < 4) {
			nCT = this.move(this.nDodging);
		}
		if ((nTime % this.TIME_REACTIVITY) === 0) {
			// correction de l'angle de recherche
			this.chaseTarget(this.getTarget());
			var d = (this.distanceToTarget() | 0) >> 7;
			switch (d) {
				case 0: // distance 0 à 128 -> s'éloigner;
					this.nDodging = 3;
					if (MathTools.rnd(0, 100) < this.nProbAttackDodge) {
						this.castSpell();
					}
					break;
					
				case 1: // distance 128 à 256;
				case 2: // distance entre 256 et 384 -> straffer en shootant;
					if (this.nDodging != 1 && this.nDodging != 2) {
						this.nDodging = MathTools.rnd(1, 2);
					}
					if (MathTools.rnd(0, 100) < this.nProbAttackStraf) {
						this.castSpell();
					}
					break;
					
				default: // distance lointaine : se rapprocher pour attaquer
					this.nDodging = 0;
					break;
			}
			switch (nCT) {
				case this.COLLISION_WALL_X:
				case this.COLLISION_WALL_Y:
					if (this.nDodging == 1) {
						this.nDodging = 2;
					} else if (this.nDodging == 2) {
						this.nDodging = 1;
					}
			}
		}
	},
	
	_cast: function(nTime) {
		this.chaseTarget(this.getTarget());
		this.oGame.gc_attack(this.oMobile, this.nCastingTime);
		this.setSearchMode();
	},
	
	_attack: function(nTime) {
		this.oGame.gc_attack(this.oMobile, 0);
	}
});
