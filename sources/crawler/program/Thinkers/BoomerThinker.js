/** Thinker Boomer
 * 
 * Suivre la cible jusqu'au contact et EXPLOSER !
 * 
 * Creer les méthode _follow et _attack pour déterminer les comportement à adopter dans ces deux modes
 * Utiliser this.oTarget pour savoir quelle cible est actuellement poursuivie
 */

O2.extendClass('BoomerThinker', MobThinker, {
	_follow: function(nTime) {
		if ((nTime % this.TIME_REACTIVITY) === 0) {
			// correction de l'angle de recherche
			this.chaseTarget(this.getTarget());
		}
		var nCT = this.move();
			
		if (nCT == this.COLLISION_TARGET) {
			this.setCastMode(0);
		}
	},

	_cast: function(nTime) {
		// rechercher les mobs des case adjacentes
		this.oGame.gc_attack(this.oMobile, -1);
		this.think = this.thinkDie;
	},

	_attack: function(nTime) {
		// ne rien faire
	}
});
