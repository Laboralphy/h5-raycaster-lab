O2.extendClass('MW.WinAlchemy', UI.Window, {
	nWidth: 256,
	nHeight: 128,
	oText: null,
	nPadding: 8,
	yText: 26,
	nFontSize: 9,
	
	oOptions: null,
	
	oCompGrid: null,

	__construct: function(oOptions) {
		__inherited({caption: 'Alchemy'});
		this.oOptions = oOptions;
		this.buildWindowContent();
	},
	
	
	buildWindowContent: function() {
		this.setSize(this.nWidth, this.nHeight);
		var oText = this.linkControl(new H5UI.Text());
		oText._bWordWrap = true;
		oText._bAutosize = false;
		oText.moveTo(this.nPadding, this.yText);
		oText.setSize(this.nWidth - this.nPadding - this.nPadding, this.nFontSize * 2 + 4);
		oText.font.setSize(this.nFontSize);
		oText.font.setFont('monospace');
		oText.font.setColor('#000000');
		oText._nLineHeight = 4;
		this.oText = oText;
		this.oText.setCaption('Select the components you want to mix, and click on "Brew".');
		
		var oComponents = new MW.CompGrid();
		var c = this.oOptions.components;
		oComponents._aCounters = [];
		for (var iComp in c) {
			oComponents._aCounters.push(c[iComp]);
		}
		this.linkControl(oComponents);
		oComponents.moveTo((this.nWidth - oComponents.getWidth()) >> 1, 56);
		this.oCompGrid = oComponents;
		
		this.setCommands([
		      ['Close', function() { G.sendSignal('ui_close'); }, 1],
		      ['Brew', this.brew.bind(this), 5]
		]);
	},
	
	brew: function() {
		var c = this.oCompGrid._aSelectedComp;
		
		var nBrew = c.reduce(function(nPrevious, nValue, x) {
			return nPrevious | ((nValue & 2) << x);
		}) >> 1;
		
		this.oOptions.onBrew(nBrew);
	}
});
