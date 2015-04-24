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
	nTime : 0,
	fAlpha : 0,
	fAlphaFade : 0,
	oColor : null,

	__construct : function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d');
	},

	isOver : function() {
		return this.fAlphaFade > 0 ? this.fAlpha >= 1 : this.fAlpha <= 0;
	},

	process : function() {
		this.oColor.a = this.fAlpha;
		if (this.oColor.a < 0) {
			this.oColor.a = 0;
		}
		if (this.oColor.a > 1) {
			this.oColor.a = 1;
		}
		this.fAlpha += this.fAlphaFade;
	},

	render : function() {
		this.oContext.fillStyle = GfxTools.buildRGBA(this.oColor);
		this.oContext.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height);
	},

	terminate : function() {
		this.fAlpha = this.fAlphaFade > 0 ? 1 : 0;
	}
});
