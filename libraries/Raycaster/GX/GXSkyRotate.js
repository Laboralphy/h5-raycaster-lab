/** Effet graphique temporisé
 * O876 Raycaster project
 * @date 2016-08-08
 * @author Raphaël Marandet
 * 
 * Fait tourner le backgroun sky.
 */
O2.extendClass('O876_Raycaster.GXSkyRotate', O876_Raycaster.GXEffect, {
	sClass: 'SkyRotate',

	fSpeed: 1,
	bOver: false,

	setSpeed: function(fSpeed) {
		this.fSpeed = fSpeed;
	},

	/** Cette fonction doit renvoyer TRUE si l'effet est fini
	* @return bool
	*/
	isOver: function() {
		return this.bOver;
	},

	/** Fonction appelée par le gestionnaire d'effet pour recalculer l'état de l'effet
	*/
	process: function() {
		var rc = this.oRaycaster;
		if (rc.oBackground) {
			rc.fBGOfs += this.fSpeed;
			rc.fBGOfs %= rc.oBackground.width;
		}
	},

	/** Fonction appelée par le gestionnaire d'effet pour le rendre à l'écran
	*/
	render: function() {
	},

	/** Fonction appelée lorsque l'effet se termine de lui même
	* ou stoppé par un clear() du manager
	*/
	done: function() {
		this.terminate();
	},

	/** Permet d'avorter l'effet
	* Il faut coder tout ce qui est nécessaire pour terminer proprement l'effet
	* (restauration de l'état du laby par exemple)
	*/
	terminate: function() {
		this.bOver = true;
	}

});


