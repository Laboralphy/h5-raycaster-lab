/**
 * HUDE Barre de chargement
 * C'est comme une barre de vie mais avec des couleur différente 
 * et un petit clignotement lorsque la barre est au maximum
 */
O2.extendClass('MW.HUDChargeBar', MW.HUDLifeBar, {

	/**
	 * mise à jour de la barre.
	 * Les quantités spécifiée sont compilé pour en faire une jolie barre de progression. 
	 * @param int n quantité actuelle
	 * @param int nMax quantité maximum 
	 */
	update: function(n, nMax) {
		if (n < nMax) {
			this.sFGColor = 'rgb(192, 64, 255)';
			__inherited(n, nMax);
		} else {
			var x = (64 * Math.sin(n / 50) + 64) | 0;
			this.sFGColor = 'rgb(192, ' + x.toString() + ', 255)';
			this.n = 0;
			__inherited(nMax, nMax);
		}
	}
});
