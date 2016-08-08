/** Effet graphique temporisé
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * 
 * Colore l'ecran d'un couleur unique qui s'estompe avec le temps
 * Permet de produire des effet de flash rouge ou d'aveuglement
 * - oColor : couleur {r b g a} du flash
 * - fAlpha : opacité de départ
 * - fAlphaFade : Incrément/Décrément d'opacité
 */
O2.extendClass('O876_Raycaster.GXFlash', O876_Raycaster.GXFade, {
	sClass: 'Flash',

	setFlash: function(sColor, fAlpha1, fTime) {
		this.oColor = this.oRainbow.parse(sColor);
		this.oEasing
			.from(fAlpha1)
			.to(0)
			.during(fTime / this.oRaycaster.TIME_FACTOR | 0)
			.use('cubeDeccel');
	}
});


