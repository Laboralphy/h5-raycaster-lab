/** GXEffect : Classe de base pour les effets graphiques temporisés
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */
O2.createClass('O876_Raycaster.GXEffect', {
	sClass: 'Effect',
	oRaycaster: null,     // référence de retour au raycaster (pour le rendu)

	__construct: function(oRaycaster) {
		this.oRaycaster = oRaycaster;
	},

	/** Cette fonction doit renvoyer TRUE si l'effet est fini
	* @return bool
	*/
	isOver: function() {
		return true;
	},

	/** Fonction appelée par le gestionnaire d'effet pour recalculer l'état de l'effet
	*/
	process: function() {
	},

	/** Fonction appelée par le gestionnaire d'effet pour le rendre à l'écran
	*/
	render: function() {
	},

	/** Fonction appelée lorsque l'effet se termine de lui même
	* ou stoppé par un clear() du manager
	*/
	done: function() {
	},

	/** Permet d'avorter l'effet
	* Il faut coder tout ce qui est nécessaire pour terminer proprement l'effet
	* (restauration de l'état du laby par exemple)
	*/
	terminate: function() {
	}
});

