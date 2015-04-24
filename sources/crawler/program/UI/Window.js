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
	_nStatusBarHeight: 22,
	_nButtonWidth: 80,
	_nButtonPadding: 4,
	_aCmdButtons: null,
	
	/** 
	 * Les paramètres puvent contenir :
	 *   caption: string // titre de la fenetre
	 */
	__construct: function(oParams) {
		__inherited();
		this.setColor(UI.clWINDOW, UI.clWINDOW);
		this.setBorder(4, UI.clWINDOW_BORDER, UI.clWINDOW_BORDER);
		var oCaption = this.linkControl(new H5UI.Text());
		oCaption.font.setFont('monospace');
		oCaption.font.setSize(12);
		oCaption.font.setColor(UI.clFONT);
		oCaption.setCaption(STRINGS._(oParams.caption));
		oCaption.moveTo(8, 8);
		this._oCaptionBar = oCaption;
		this._aCmdButtons = [];
	},
	
	close: function() {
		G.ui_close();
	},
	
	getPlugin: function(sPlugin) {
		return G.oUI.oPlugins[sPlugin];
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
	setStatusCaption: function(s) {
		if (this._oStatusBar === null) {
			var oMsg = this.linkControl(new H5UI.Text());
			oMsg._bWordWrap = false;
			oMsg._bAutosize = true;
			oMsg.font.setSize(this._nStatusBarHeight * 0.75 | 0);
			oMsg.font.setFont('arial');
			oMsg.font.setColor('#333333');
			this._oStatusBar = oMsg;
			this._oStatusBar.moveTo(8, this.getHeight() - this._nStatusBarHeight);
		}
		this._oStatusBar.setCaption(s);
		this.invalidate();
		this._oStatusBar.render();
	},
	
	commandClick: function() {
		this.getParent().command(this.__command);
	},
	
	/** 
	 * Ajoute une bar de command en bas de la fenetre
	 * un click sur un bouton lance la function "command"
	 */
	setCommands: function(a) {
		var aColors = [[ UI.clWINDOW, '#BBBBBB' ],
		               [ '#6666DD', '#BBBBFF' ], // blue
		               [ '#44DD44', '#BBFFBB' ], // green
		               [ '#44DDDD', '#BBFFFF' ], // cyan
		               [ '#DD4444', '#FFBBBB' ], // red
		               [ '#DD44DD', '#FFBBFF' ], // purple
		               [ '#DDDD44', '#FFFFBB' ]]; // yellow
		
		var b, aColor, x = 0;
		for (var i = 0; i < a.length; i++) {
			if (a[i] === null) {
				x += 16;
				continue;
			}
			b = this.linkControl(new H5UI.Button());
			b.setCaption(STRINGS._(a[i][0]));
			b.setSize(this._nButtonWidth, this._nStatusBarHeight);
			b.moveTo(x + this._nButtonPadding, this.getHeight() - this._nStatusBarHeight - this._nButtonPadding);
			aColor = aColors[a[i][2]];
			b.setColor(aColor[0], aColor[1]);
			b.__command = a[i][1];
			b.onClick = this.commandClick;
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

