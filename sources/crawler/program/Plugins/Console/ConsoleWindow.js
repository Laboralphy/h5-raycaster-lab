O2.extendClass('UI.ConsoleWindow', UI.Window, {

	nWidth: 512,
	nHeight: 256,
	
	oParams: null,
	oText: null,
	
	__construct: function(oParams) {
		__inherited({caption: 'Console'});
		this.oParams = oParams;
		this.buildWindowContent();
		this.setCommands([
		['~key_gen_close', 'console_close', 4]
		]);
	},
	
	buildWindowContent: function() {
		this.setSize(this.nWidth, this.nHeight);
		// texte
		var oText = this.linkControl(new H5UI.Text());
		oText._bWordWrap = true;
		oText._bAutosize = false;
		oText.moveTo(8, 24);
		oText.setSize(524, 290);
		oText.font.setFont('monospace');
		oText.font.setSize(12);
		oText.font.setColor('#000');
		oText.setCaption(this.oParams.lines);
		this.oText = oText;
	},
	
	/**
	 * Cette fonction est déclenchée par les boutons défini dans setCommands.
	 */
	command: function(sCommand) {
		switch (sCommand) {
			case 'console_close':
				this.close();
				break;
		}
	}
});
