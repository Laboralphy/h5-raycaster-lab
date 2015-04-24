/** Classe de gestion d'un effet dans le temps
 * La classe permet de déterminer le moment où un effet expire
 */
O2.createClass('GC.Effect', {
	sEffect: '',      // code original de l'effet
	nTimeOut: 0,      // "heure" à laquelle l'effet se dissipera
	bExpirable: true, // L'objet est expirable : il est détruit lorsque le compteur est à zero
	bExpired: false,  // L'effet a expiré (sauvegarde du resultat de la fonction isExpired)
	
	/**
	 * Renvoie true si l'effet est expirable (le timeout à un effet radical sur lui
	 */
	expire: function() {
		this.bExpirable = true;
		this.bExpired = true;
		this.nTimeOut = 0;
	},
	
	
	/**
	 * Défini le timeout (heure à laquel l'effet disparait)
	 * @param t 
	 */
	setTimeOut: function(t) {
		this.nTimeOut = t;
	},
	
	/** 
	 * Teste si l'effet expire ou est encore valide (selon le temps spécifié en paramètre
	 * Mise à jour de flag bExpired
	 * @param nTime nombre de cycle
	 * @return bool
	 */
	isExpired: function(nTime) {
		return this.bExpired = this.bExpirable && this.nTimeOut <= nTime;
	},
	
	/**
	 * Renvoie true si la fonction isExpired a précédement renvoyé true.
	 * Cette fonction ne nécessite pas de paramètre de temps
	 * @return bool
	 */
	hasExpired: function() {
		return this.bExpired;
	}
});
