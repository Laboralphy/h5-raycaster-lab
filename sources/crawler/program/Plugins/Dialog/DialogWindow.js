/** 
 * Fenetre de dialogue
 * les paramètre attendu sont :
 * message : contenu du message.
 * buttons : tableau de libellé de boutons
 * noescape : true -> la fenetre ne peut etre fermée par escape
 */
O2.extendClass('UI.DialogWindow', UI.Window, {
	nWidth: 512,
	nHeight: 192,
	nFontSize: 16,
	nPadding: 32,
	oParams: null,
	yText: 64,
	oText: null,
	
	__construct: function(oParams) {
		__inherited({caption: STRINGS._('~win_dialog')});
		this.oParams = oParams;
		this.buildWindowContent();
	},
	
	buildWindowContent: function() {
		this.setSize(this.nWidth, this.nHeight);
		var oText = this.linkControl(new H5UI.Text());
		oText._bWordWrap = true;
		oText._bAutosize = false;
		oText.moveTo(this.nPadding, this.yText);
		oText.setSize(this.nWidth - (this.nPadding * 2), this.nHeight - this.yText - this.nPadding);
		oText.font.setSize(this.nFontSize);
		oText.font.setFont('serif');
		oText.font.setColor('#000000');
		oText._nLineHeight = 4;
		this.oText = oText;
		this.oText.setCaption(this.oParams.message);
		//this.setStatusCaption(STRINGS._('~key_closedialog'));
		this.setCommands(this.oParams.buttons);
	},
	
	command: function(sCommand) {
		switch (sCommand) {
			case 'dlg_close':
				this.close();
				break;
				
			default:
				var p = this.getPlugin('Dialog');
				var e = p.oEvents;
				if (sCommand in e) {
					e[sCommand].apply(p.oGame, []);
				}
				break;
		}
	}
});

