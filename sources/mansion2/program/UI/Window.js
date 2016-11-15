/** 
 * UI : Interface utilisateur
 * @author raphael marandet
 * @date 2013-01-01
 *
 * Window : Fenêtre d'affichage de base
 * Equippée d'un titre et d'une statusbar.
 */

O2.extendClass('UI.Window', H5UI.Box, {
	_sClass: 'UI.Window',
	_oStatusBar: null,
	_oCaptionBar: null,
	_nStatusBarHeight: 16,
	_fStatusBarFontFactor: 0.75,
	_nButtonWidth: 60,
	_nButtonPadding: 8,
	_aCmdButtons: null,
	_oBackgroundImage: null,
	
	/** 
	 * Les paramètres puvent contenir :
	 *   caption: string // titre de la fenetre
	 */
	__construct: function(oParams) {
		__inherited();
		this._oBackgroundImage = this.linkControl(new H5UI.Image());
		this._oBackgroundImage.hide();
		this._oBackgroundImage.moveTo(0, 0);
		this.setColor(UI.clWINDOW, UI.clWINDOW);
		this.setBorder(4, UI.clWINDOW_BORDER, UI.clWINDOW_BORDER);
		var oCaption = this.linkControl(new H5UI.Text());
		oCaption.setFontFace('monospace');
		oCaption.setFontStyle('bold');
		oCaption.setFontSize(UI.FONT_SIZE);
		oCaption.setFontColor('#FFF', '#000');
		oCaption.setCaption(oParams.caption);
		oCaption.moveTo(8, 8);
		this._oCaptionBar = oCaption;
		this._aCmdButtons = [];
	},
	
	close: function() {
		G.ui_close();
	},

	/**
	 * Modification du titre
	 * @param s string
	 */	
	setTitleCaption: function(s) {
		this._oCaptionBar.setCaption(s);
	},
	
	/**
	 * Modification de la status bar
	 * La status bar sert à afficher des info complémentaire sur l'état de la fenetre
	 * Courrament utilisé pour afficher les touche de raccourci
	 * @param s string nouveau contenu du titre
	 */
	 /*
	setStatusCaption: function(s) {
		if (this._oStatusBar === null) {
			var oMsg = this.linkControl(new H5UI.Text());
			oMsg._bWordWrap = false;
			oMsg._bAutosize = true;
			oMsg.setFontSize(this._nStatusBarHeight * this._fStatusBarFontFactor | 0);
			oMsg.setFontFace('arial');
			oMsg.setFontColor('#333333');
			this._oStatusBar = oMsg;
			this._oStatusBar.moveTo(8, this.getHeight() - this._nStatusBarHeight);
		}
		this._oStatusBar.setCaption(s);
		this.invalidate();
		this._oStatusBar.render();
	},*/
	
	/** 
	 * Ajoute une bar de command en bas de la fenetre
	 * un click sur un bouton lance la function "command"
	 * Chaque élément du tableau passé en paramètre a ce format :
	 * [caption, handler onclick, code-couleur]
	 */
	setCommands: function(a) {
		var aColors = [
		    [ UI.clWINDOW, '#BBBBBB' ], // gray
		    [ '#6666DD', '#BBBBFF' ], // blue
		    [ '#44DD44', '#BBFFBB' ], // green
		    [ '#44DDDD', '#BBFFFF' ], // cyan
		    [ '#DD4444', '#FFBBBB' ], // red
		    [ '#DD44DD', '#FFBBFF' ], // purple
		    [ '#DDDD44', '#FFFFBB' ] // yellow
		];
		var b, aColor, x = 0;
		var sCaption, sColor, pHandler;
		for (var i = 0, l = a.length; i < l; ++i) {
			if (a[i] === null) {
				x += 16;
				continue;
			}
			sCaption = a[i][0];
			sColor = a[i][2];
			pHandler = a[i][1];
			b = this.linkControl(new H5UI.Button());
			b.setCaption(sCaption);
			b.setSize(this._nButtonWidth, this._nStatusBarHeight);
			b.oText.setFontSize(UI.FONT_SIZE * 0.85 | 0);
			b.moveTo(x + this._nButtonPadding, this.getHeight() - this._nStatusBarHeight - this._nButtonPadding);
			aColor = aColors[sColor];
			b.setColor(aColor[0], aColor[1]);
			if (pHandler) {
				b.on('click', a[i][1]);
			}
			x += this._nButtonWidth + this._nButtonPadding;
			this._aCmdButtons.push(b);
		}
	},
	
	/**
	 * Renvoie le bouton correspondant au param spécifié
	 * 0 = premier bouton, 1 = deuxième etc...
	 * @param n Numero du bouton
	 * @return objet Button
	 */
	getCommandButton: function(n) {
		return this._aCmdButtons[n];
	},
	
	setBackgroundImage: function(sSrc) {
		this.setColor('transparent');
		var bg = this._oBackgroundImage;
		bg.setSource(sSrc);
		bg.show();
		this.setBorder(0);
	},

	
	
	/**
	 * Modifier la taille conduit à déplacer la status bar
	 */
	setSize: function(w, h) {
		__inherited(w, h);
		if (this._oStatusBar) {
			this._oStatusBar.moveTo(8, this.getHeight() - this._nStatusBarHeight);
		}
	}
});

