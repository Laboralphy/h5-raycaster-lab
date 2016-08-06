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
O2.extendClass('O876_Raycaster.GXFlash', O876_Raycaster.GXEffect, {
	sClass: 'Flash',
	oCanvas: null,
	oContext: null,
	oColor: null,
	oRainbow: null,
	oEasing: null,
	bOver: false,

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oEasing = new O876.Easing();
		this.oRainbow = oRaycaster.oRainbow;
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d'); 
	},
	
	setFlash: function(sColor, fAlpha1, fAlpha2, fTime) {
		this.oColor = this.oRainbow.parse(sColor);
		this.oEasing.from(fAlpha1).to(fAlpha2).during(fTime).use('linear');
	},

	isOver: function() {
		return this.bOver;
	},

	process: function() {
		this.bOver = this.oEasing.f();
		this.oColor.a = Math.min(1, Math.max(0, this.oEasing.x));
	},

	render: function() {
		this.oContext.fillStyle = this.oRainbow.rgba(this.oColor);
		this.oContext.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height);
	},
	
	done: function() {
		this.terminate();
	},

	terminate: function() {
		this.bOver = true;
	}
});


