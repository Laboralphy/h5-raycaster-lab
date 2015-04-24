/** Thinker Rusher
 * 
 * Suivre la cible jusqu'au contact et lui taper dessus avec une arme de corps à corps.
 * 
 * Creer les méthode _follow et _attack pour déterminer les comportement à adopter dans ces deux modes
 * Utiliser this.oTarget pour savoir quelle cible est actuellement poursuivie
 */

O2.extendClass('RusherThinker', MobThinker, {
	_follow: function(nTime) {
		if ((nTime % this.TIME_REACTIVITY) === 0) {
			// correction de l'angle de recherche
			this.chaseTarget(this.getTarget());
		}
		var nCT = this.move();
			
		if (nCT == this.COLLISION_TARGET) {
			this.setAttackMode();
		}
	},

	_attack: function(nTime) {
		this.oGame.gc_attack(this.oMobile, 0);
	}
});