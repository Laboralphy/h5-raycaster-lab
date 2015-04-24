O2.extendClass('MW.HUDLifeBar', UI.HUDElement, {
	
	n: 0,
	nMax: 0,
	
	sBGColor: 'rgba(0, 0, 0, 0.5)',
	sFGColor: 'rgb(255, 0, 0)',
	
	/**
	 * mise à jour de la barre de vie
	 * @param n Point de vie en cour, si n est null cela signifie qu'on ne veut modifier que
	 * le nombre max de point de vie
	 * @param nMax nombre max de point de vie si ce nombre est null cela signifie que
	 * l'on veut modifier que le nombre courrant de point de vie
	 */
	update: function(n, nMax) {
		if (n === null) {
			n = this.n;
		}
		if (nMax === null) {
			nMax = this.nMax;
		}
		if (nMax && (this.n != n || this.nMax != nMax)) {
			var c = this.oContext;
			var w = this.oCanvas.width;
			var h = this.oCanvas.height;
			c.fillStyle = this.sBGColor;
			c.clearRect(0, 0, w, h);
			c.fillRect(0, 0, w, h);
			c.fillStyle = this.sFGColor;
			c.fillRect(1, 1, n * (w - 2) / nMax | 0, h - 2);
			this.nMax = nMax;
			this.n = n;
		}
	}
});
