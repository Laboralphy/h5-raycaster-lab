O2.extendClass('UI.StubWindow', UI.Window, {

	nWidth: 540,
	nHeight: 356,
	
	oParams: null,
	
	__construct: function(oParams) {
		__inherited({caption: 'STUB Window'});
		this.oParams = oParams;
		this.buildWindowContent();
		this.setCommands([
		                  ['~key_gen_close', 'stub_close', 4]
		                   ]);
	},
	buildWindowContent: function() {
		this.setSize(this.nWidth, this.nHeight);
	},
	
	/**
	 * Cette fonction est déclenchée par les boutons défini dans setCommands.
	 */
	command: function(sCommand) {
		switch (sCommand) {
			case 'stub_close':
				if (this.oPopup._bVisible) {
					this.getPlugin('Stub').abort();
				} else {
					this.close();
				}
				break;
		}
	}
});
