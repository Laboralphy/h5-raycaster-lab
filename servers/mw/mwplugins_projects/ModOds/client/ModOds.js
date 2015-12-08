O2.extendClass('MW.ModOds', UI.HUDClient, {
	
	oImage: null,
	
	redraw: function() {
		var c = this.oContext;
		var h = this.oCanvas.height;
		var w = this.oCanvas.width;
		c.drawImage(this.oImage, 0, 0, this.oImage.width, this.oImage.height, 0, 0, w, h);
	},

	/**
	 * La fonction update est le point d'entrée du widget,
	 * Elle est invoquée chaque fois que le plugin-serveur appelle la methode Instance::updateHud()
	 * Les paramètres de la methode sont choisis librement mais doivent se correspondre.
	 * ---------------------
	 * structure de oData :
	 * {
	 *   img: contenue (base 64) de l'image
	 * }
	 */
	update: function(oData) {
		var sImg = oData.image;
		this.oImage = new Image();
		this.oImage.addEventListener('load', this.redraw.bind(this));
		this.oImage.src = sImg;
	}
});
