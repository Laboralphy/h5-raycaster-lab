/** Thinker Dasher
 * 
 * Foncer sur la cible à double vitesse sans ajuster l'angle.
 * 
 * Creer les méthode _follow et _attack pour déterminer les comportement à adopter dans ces deux modes
 * Utiliser this.oTarget pour savoir quelle cible est actuellement poursuivie
 */

O2.extendClass('DasherThinker', MobThinker, {
	_follow: function(nTime) {
		// on bouge deux fois : c'est le dash zooouuu !!!
		for (var i = 0; i < 3; ++i) {
			switch(this.move()) {
				case this.COLLISION_TARGET:
				if (this.getTarget() == this.oMobile.oMobileCollision) {
					this.oGame.gc_attack(this.oMobile, 0);
				}
				this.oGame.gc_attack(this.oMobile, 0);
				this.setAttackMode();
				break;
				
				case this.COLLISION_WALL_X:
				case this.COLLISION_WALL_Y:
				case this.COLLISION_MOBILE:
				this.setWanderMode();
				break;
			}
		}
	},

	_attack: function(nTime) {
		this.chaseTarget(this.getTarget());
		this.oGame.gc_attack(this.oMobile, 0);
	}
});