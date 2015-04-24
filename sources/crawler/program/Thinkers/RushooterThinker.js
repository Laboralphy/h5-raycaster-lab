/** Thinker Rusher
 * 
 * Suivre la cible jusqu'au contact tout en lui tirant dessus.
 * 
 * Creer les méthode _follow et _attack pour déterminer les comportement à adopter dans ces deux modes
 * Utiliser this.oTarget pour savoir quelle cible est actuellement poursuivie
 */

O2.extendClass('RushooterThinker', MobThinker, {
	_follow: function(nTime) {
		if ((nTime % this.TIME_REACTIVITY) === 0) {
			// correction de l'angle de recherche
			this.chaseTarget(this.getTarget());
			if (MathTools.rnd(1, 100) < 25) {
				this.setAttackMode();
			}
		}
		var nCT = this.move();
			
		if (nCT == this.COLLISION_TARGET) {
			this.setAttackMode();
		}
	},

	_attack: function(nTime) {
		if (this.isTargetVisible(this.getTarget())) {
			this.oGame.gc_attack(this.oMobile, 0);
		}
	}
});