O2.extendClass('MW.HUDIconPad', UI.HUDElement, {
	
	sLastIconPrint: '',
	oIcons: null,
	oAttributes: null,
	
	/**
	 * Afficher les icones vertes correspondant aux attributs positif
	 * et les icones rouges correspondant aux attributs négatif
	 */
	update: function(oAttributes) {
		var sLIP = '', sAttr = '';
		for (sAttr in oAttributes) {
			sLIP += '[' + sAttr + '/' + oAttributes[sAttr] + ']';
		}
		if (this.oIcons === null) {
			this.oIcons = this.oGame.oRaycaster.oHorde.oTiles.i_icons16.oImage;
		}
		if (sLIP !== this.sLastIconPrint) {
			this.sLastIconPrint = sLIP;
			this.oAttributes = oAttributes;
			this.redraw();
		}
	},
	
	redraw: function() {
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		var oAttributes = this.oAttributes;
		c.clearRect(0, 0, w, h);
		var ad = null, xCol = 0;
		for (var sAttr in oAttributes) {
			ad = null;
			if (oAttributes[sAttr] > 0) {
				ad = MW.ATTRIBUTES_DATA[sAttr].pos;
			} else if (oAttributes[sAttr] < 0) {
				ad = MW.ATTRIBUTES_DATA[sAttr].neg;
			}
			if (ad !== null && ad.icon != null) {
				c.drawImage(this.oIcons, ad.icon << 4, ad.color << 4, 16, 16, xCol, 0, 16, 16);
				xCol += 16;
			}
		}
	}
});
