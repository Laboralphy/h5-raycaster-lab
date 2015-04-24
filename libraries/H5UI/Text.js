
/**
 * Un composant simple qui affiche un texte Penser à redimensionner correctement
 * le controle, sinon le texte sera invisible
 */
O2.extendClass('H5UI.Text', H5UI.WinControl, {
	_sClass : 'Text',
	_sCaption : '',
	_bAutosize : true,
	_bWordWrap: false,
	_nTextWidth: 0,	
	_nLineHeight: 0,
	_yLastWritten: 0,
	

	// propriété publique
	font : null,

	__construct : function() {
		__inherited();
		this.font = new H5UI.Font(this);
	},

	/**
	 * Modification du caption
	 * 
	 * @param s
	 *            nouveau caption
	 */
	setCaption : function(s) {
		this._set('_sCaption', s);
		if (this._bAutosize && this._bInvalid) {
			this.font.update();
			var oMetrics = this.getSurface().measureText(this._sCaption);
			this.setSize(oMetrics.width, this.font._nFontSize + 1);
		}
	},

	/**
	 * Définition du flag autosize quand ce flag est actif, le control prend la
	 * dimension du texte qu'il contient
	 */
	setAutosize : function(b) {
		this._set('_bAutosize', b);
	},

	/**
	 * Définition du flag wordwrap, quand ce flag est actif, la taille est fixe
	 * et le texte passe à la ligne si celui-ci est plus long que la longeur.
	 */
	setWordWrap : function(b) {
		this._set('_bWordWrap', b);
	},

	renderSelf : function() {
		var oSurface = this.getSurface();
		var oMetrics;
		// Redimensionnement du texte
		oSurface.clearRect(0, 0, this.getWidth(), this.getHeight());
		if (this._bWordWrap){
			this.font.update();
			var aWords;
			var sLine = '', sWord, x = 0, y = 0;
			var sSpace;
			oSurface.textBaseline = 'top';
			var aParas = this._sCaption.split('\n');
			for (var iPara = 0; iPara < aParas.length; iPara++) {
				aWords = aParas[iPara].split(' ');
				while (aWords.length) {
					sWord = aWords.shift();
					sSpace = sLine ? ' ' : '';
					oMetrics = oSurface.measureText(sLine + sSpace + sWord);
					if (oMetrics.width >= this.getWidth()) {
						// flush
						x = 0;
						if (this.font._bOutline) {
							oSurface.strokeText(sLine, x, y);
						}		
						oSurface.fillText(sLine, x, y);
						y += this.font._nFontSize + this._nLineHeight;
						sLine = sWord;
					} else {
						sLine += sSpace + sWord;
						x += oMetrics.width;
					}
				}
				x = 0;
				if (this.font._bOutline) {
					oSurface.strokeText(sLine, x, y);
				}		
				oSurface.fillText(sLine, x, y);
				y += this.font._nFontSize + this._nLineHeight;
				sLine = '';
				this._yLastWritten = y;
			}
		} else {
			if (this._bAutosize) {
				this.font.update();
				oMetrics = oSurface.measureText(this._sCaption);
				this.setSize(oMetrics.width, this.font._nFontSize + 1);
			} else {
			}
			oSurface.textBaseline = 'middle';
			if (this.font._bOutline) {
				oSurface.strokeText(this._sCaption, 0, this.getHeight() >> 1);
			}		
			oSurface.fillText(this._sCaption, 0, this.getHeight() >> 1);
		}
	}
});

