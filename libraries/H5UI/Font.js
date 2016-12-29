O2.createClass('H5UI.Font', {
	_sStyle: '',
	_sFont : '',
	_nFontSize : 10,
	_sColor : 'rgb(255, 255, 255)',
	_oControl : null,
	_sOutlineColor: 'rgb(0, 0, 0)',
	_bOutline: false,

	__construct : function(oControl) {
		this._sFont = H5UI.font.defaultFont;
		this._nFontSize = H5UI.font.defaultSize;
		this._sColor = H5UI.font.defaultColor;
		if (oControl === undefined) {
			throw new Error('h5ui.font: no specified control');
		}
		this.setControl(oControl);
	},

	/**
	 * Défini le controle propriétaire
	 * 
	 * @param oControl
	 *            nouveau control propriétaire
	 */
	setControl : function(oControl) {
		this._oControl = oControl;
		this.invalidate();
	},

	/**
	 * Invalide le controle propriétaire afin qu'il se redessineen tenant compte
	 * des changement apporté à l'aspect du texte.
	 */
	invalidate : function() {
		if (this._oControl) {
			this.update();
			this._oControl.invalidate();
		}
	},

	/**
	 * Modification de la police de caractère, on ne change que la variable et
	 * on invalide le controle
	 * 
	 * @param sFont
	 *            nouvelle police
	 */
	setFont : function(sFont) {
		if (this._sFont != sFont) {
			this._sFont = sFont;
			this.invalidate();
		}
	},
	
	setStyle: function(sStyle) {
		if (this._sStyle != sStyle) {
			this._sStyle = sStyle;
			this.invalidate();
		}
	},

	/**
	 * Modifie la taille de la police
	 * 
	 * @param nSize
	 *            nouvelle taille en pixel
	 */
	setSize : function(nSize) {
		if (this._nFontSize != nSize) {
			this._nFontSize = nSize;
			this.invalidate();
		}
	},

	/**
	 * Modification de la couleur
	 * 
	 * @param s
	 *            nouvelle couleur HTML5 (peut etre un gradient)
	 */
	setColor : function(sColor, sOutline) {
		var bInvalid = false;
		if (this._sColor != sColor) {
			this._sColor = sColor;
			bInvalid = true;
		}
		if (this._sOutlineColor != sOutline) {
			this._sOutlineColor = sOutline;
			bInvalid = true;
		}
		this._bOutline = this._sOutlineColor !== undefined;
		if (bInvalid) {
			this.invalidate();
		}
	},

	/**
	 * Calcule la chaine de définition de police de caractère Cette fonction
	 * génère une chaine de caractère utilisable pour définir la propriété Font
	 * d'une instance Canvas2DContext
	 * 
	 * @return string
	 */
	getFontString : function() {
		return (this._sStyle ? this._sStyle + ' ' : '') + this._nFontSize.toString() + 'px ' + this._sFont;
	},

	/**
	 * Applique les changements de taille, de couleur... Le context2D du
	 * controle propriété de cette instance est mis à jour quant au nouvel
	 * aspect de la Font.
	 */
	update : function() {
		var oContext = this._oControl.getSurface();
		oContext.font = this.getFontString();
		oContext.fillStyle = this._sColor;
		if (this._bOutline) {
			oContext.strokeStyle = this._sOutlineColor;
		}
	}
});

