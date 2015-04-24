/** Thinker Healer
 * 
 * Sélectionner une cible, vérifier si des cofactionnaire ont besoin d'aider, les soigner, sinon attaquer la cible
 * 
 * Creer les méthode _follow et _attack pour déterminer les comportement à adopter dans ces deux modes
 * Utiliser this.oTarget pour savoir quelle cible est actuellement poursuivie
 */

O2.extendClass('HealerThinker', MobThinker, {

	

	_follow: function(nTime) {
		if ((nTime % this.TIME_REACTIVITY) === 0) {
			// verifier cofactionnaires
			var aMobs = this.oGame.gc_selectMobilesInCircle(this.oMobile.x, this.oMobile.y, 512);
			if (aMobs.length) {
				// choisir le mob le plus blessé non-joueur et non soit même
				var iMob = 0;				// index de mob
				var oMob = null;			// mob en cours
				var oMobCreature;			// creature du mob en cours
				var nMobs = aMobs.length;	// nombre de mob dans le cercle de recherche
				var oMobMostWounded = null;	// indice du mob le plus blessée
				var nMobWorstWound = 0;		// recors de blessure
				for (iMob = 0; iMob < nMobs; iMob++) {
					oMob = aMobs[iMob];
					if (oMob.getType() == RC.OBJECT_TYPE_MOB && oMob != this.oMobile) {
						oMobCreature = oMob.getData('creature');
						if (oMobCreature.getAttribute('hp') > nMobWorstWound) {
							nMobWorstWound = oMobCreature.getAttribute('hp');
							oMobMostWounded = oMob;
						}
					}
				}
				if (oMobMostWounded) {
					this.chaseTarget(oMobMostWounded);
					this.setCastMode(1);
					return;
				}
			}
			// correction de l'angle de recherche
			if (this.searchForTarget(this.getTarget())) {
				// attack
				this.chaseTarget(this.getTarget());
				this.setAttackMode();
			} else {
				// cible perdue
				this.setWanderMode();
			}
		}
	},
	
	_cast: function(nTime) {
		this.chaseTarget(this.getTarget());
		this.oGame.gc_attack(this.oMobile, this.nCastingTime);
		this.setSearchMode();
	},

	_attack: function(nTime) {
		var g = this.oGame;
		g.gc_attack(this.oMobile, 0);
		this.nBoredTime += g.TIME_FACTOR;
	}
});