O2.extendClass('MW.ModAccuracy', UI.HUDClient, {
	
	fAccuracy: 0;
	
	/** 
	 * Ecriture du nombre, au milieu du composant
	 * @param fAcc nombre à écrire
	 */
	redraw: function() {
		var fAcc = this.fAccuracy;
		var c = this.oContext;
		var h = this.oCanvas.height;
		var w = this.oCanvas.width;
		c.textBaseLine = 'middle';
		c.fillStyle = 'white';
		var x = 20;
		var y = h >> 1;
		c.clearRect(0, 0, w, h);
		c.drawImage(this.getTile('accuracy_icon'), 0, 0, 32, 32, 0, 0, 16, 16);
		c.fillText(fAcc.toString().substr(0, 4) + '%', x, y);
	},

	/**
	 * La fonction update est le point d'entrée du widget,
	 * Elle est invoquée chaque fois que le plugin-serveur appelle la methode Instance::updateHud()
	 * Les paramètres de la methode sont choisis librement mais doivent se correspondre.
	 * ici : update(fAcc)  parce que le plugin-serveur appelle Instance::updateHud([entities], "accuracy", fAcc);
	 */
	update: function(fAcc) {
		if (fAcc != this.fAccuracy) {
			this.fAccuracy = fAcc;
			this.redraw();
		}
	}
});
