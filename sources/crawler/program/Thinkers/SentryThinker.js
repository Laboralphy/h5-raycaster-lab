/**
 * Thinker Sentry
 * 
 * Chercher une cible et lui tirer dessus sans se déplacer IA Réservée au mob
 * qui ne se déplacent pas
 * 
 * Creer les méthode _follow et _attack pour déterminer les comportement à
 * adopter dans ces deux modes Utiliser this.oTarget pour savoir quelle cible
 * est actuellement poursuivie
 */

O2.extendClass('SentryThinker', MobThinker, {
	TIME_REACTIVITY : 4,

	nSearchingTime : 2500, // delai durant lequel le mob cherche une cible
	nWalkingTime : 0, // delai durant lequel le mob marche avant de s'arreter pour changer de mode
	nWanderingTime : 0, // delai durant lequel le mob s'arrete pour "réfléchir"

	_follow : function(nTime) {
		if ((nTime % this.TIME_REACTIVITY) === 0) {
			// correction de l'angle de recherche
			this.chaseTarget(this.getTarget());
			this.setAttackMode();
		}
	},

	_attack : function(nTime) {
		this.oGame.gc_attack(this.oMobile, 0);
	}
});
