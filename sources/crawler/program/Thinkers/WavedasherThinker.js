/** Thinker Wave Dasher
 * 
 * Foncer sur la cible à double vitesse sans ajuster l'angle.
 * L'angle est régulièrement modifier pour donner l'impression de se déplacer dans un élément mobile (eau ou fort vent)
 * 
 * Creer les méthode _follow et _attack pour déterminer les comportement à adopter dans ces deux modes
 * Utiliser this.oTarget pour savoir quelle cible est actuellement poursuivie
 */

O2.extendClass('WavedasherThinker', DasherThinker, {
	_follow: function(nTime) {
		if ((nTime % this.TIME_REACTIVITY) === 0) {
			this.chaseTarget(this.getTarget());
			this.oMobile.rotate(Math.random() - 0.5);
		}
		__inherited();
	}
});
