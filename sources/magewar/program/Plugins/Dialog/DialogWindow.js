/** 
 * Fenetre de dialogue
 * les paramètre attendu sont :
 * message : contenu du message.
 * buttons : tableau de libellé de boutons
 * noescape : true -> la fenetre ne peut etre fermée par escape
 */
O2.extendClass('UI.DialogWindow', UI.Window, {
	nWidth: 256,
	nHeight: 128,
	nFontSize: 10,
	nPadding: 16,
	oParams: null,
	yText: 32,
	oText: null,
	
	__construct: function(oParams) {
		__inherited({caption: oParams.title});
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
		oText.font.setFont('monospace');
		oText.font.setColor('#000000');
		oText._nLineHeight = 4;
		this.oText = oText;
		this.oText.setCaption(this.oParams.message);
		this.setCommands(this.oParams.buttons);
	}
});

