/** Effet graphique temporisé
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * 
 * L'écran se colore graduellement d'une couleur unis
 * Permet de produire des effet de fade out pour faire disparaitre le contenu de l'écran
 * - oColor : couleur {r b g a} du fadeout
 * - fAlpha : opacité de départ
 * - fAlpha : Incrément/Décrément d'opacité
 */
O2.extendClass('O876_Raycaster.GXFade', O876_Raycaster.GXEffect, {
	sClass : 'FadeOut',
	oCanvas : null,
	oContext : null,
	oColor : null,
	oRainbow: null,
	oEasing: null,
	bOver: false,
	bNeverEnding: false,

	__construct : function(oRaycaster) {
		__inherited(oRaycaster);
		this.oRainbow = new O876.Rainbow();
		this.oCanvas = this.oRaycaster.getRenderCanvas();
		this.oContext = this.oRaycaster.getRenderContext();
		this.oEasing = new O876.Easing();
	},
	
	fade: function(sColor, fTime, fFrom, fTo) {
		this.oColor = this.oRainbow.parse(sColor);
		this.oEasing.from(fFrom).to(fTo).during(fTime / this.oRaycaster.TIME_FACTOR | 0).use('smoothstep');
		this.bOver = fFrom != fTo;
		return this;
	},
	
	neverEnding: function() {
		this.bNeverEnding = true;
	},

	fadeIn: function(sColor, fTime) {
		return this.fade(sColor, fTime, 1, 0);
	},
	
	fadeOut: function(sColor, fTime) {
		return this.fade(sColor, fTime, 0, 1);
	},
	
	isOver : function() {
		if (!this.bNeverEnding) {
			return this.bOver;
		} else {
			return false;
		}
	},

	process : function() {
        this.bOver = this.oEasing.f();
		this.oColor.a = this.oEasing.x;
	},

	render : function() {
		this.oContext.fillStyle = this.oRainbow.rgba(this.oColor);
		this.oContext.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height);
	},

	terminate : function() {
		this.bNeverEnding = false;
		this.bOver = true;
	}
});
