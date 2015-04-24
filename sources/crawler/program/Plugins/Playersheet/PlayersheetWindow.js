/** 
 * Fenetre de dialogue
 * les paramètre attendu sont :
 * message : contenu du message.
 * buttons : tableau de libellé de boutons
 * noescape : true -> la fenetre ne peut etre fermée par escape
 */
O2.extendClass('UI.PlayersheetWindow', UI.Window, {
	nWidth: 480,
	nHeight: 360,
	nFontSize: 14,
	nPadding: 24,
	oParams: null,
	yText: 64	,
	oTextAttr: null,
	oTextValue: null,
	
	sColorAttr: '#AAAAAA', 
	sColorValueNorm: '#FFFFFF', 
	sColorValueBuffed: '#00CC00', 
	sColorValueDebuffed: '#CC0000', 
	sColorBG: '#444444',
	
	__construct: function(oParams) {
		__inherited({caption: '~win_playersheet'});
		this.oParams = oParams;
		this.buildWindowContent();
	},
	
	displayAttribute: function(i, sAttribute, sValue, sColor) {
		var nLineHeight = 4;
		var yAttr = this.yText + ((i >> 1) * (this.nFontSize + nLineHeight + 8));
		
		var oBox = this.linkControl(new H5UI.Box());
		oBox.setSize((this.nWidth >> 1) - this.nPadding - (this.nPadding >> 1), this.nFontSize + nLineHeight * 2);
		if (i & 1) {
			oBox.moveTo((this.nWidth >> 1) + (this.nPadding >> 1), yAttr);
		} else {
			oBox.moveTo(this.nPadding, yAttr);
		}
		oBox.setBorder(0);
		oBox.setColor(this.sColorBG);
		
		var oText = oBox.linkControl(new H5UI.Text());
		oText._bWordWrap = false;
		oText._bAutosize = true;
		oText.font.setSize(this.nFontSize);
		oText.font.setFont('serif');
		oText.font.setColor(this.sColorAttr);
		oText._nLineHeight = nLineHeight;
		oText.moveTo(this.nPadding >> 3, nLineHeight);
		oText.setCaption(sAttribute);
		
		oText = oBox.linkControl(new H5UI.Text());
		oText.font.setStyle('bold');
		oText._bWordWrap = false;
		oText._bAutosize = true;
		oText.font.setSize(this.nFontSize);
		oText.font.setFont('monospace');
		oText.font.setColor(sColor);
		oText._nLineHeight = nLineHeight;
		oText.setCaption(sValue);
		oText.render();
		oText.moveTo(oBox.getWidth() - oText.getWidth() - 4, nLineHeight);
	},
	
	buildWindowContent: function() {
		this.setSize(this.nWidth, this.nHeight);
		this.buildData();
		this.setCommands([['~key_gen_close', 'psheet_close', 4]]);
	},
	
	command: function(sCommand) {
		switch (sCommand) {
			case 'psheet_close':
				this.close();
				break;
		}
	},

	getAttrColor: function(a) {
		if (a > 0) {
			return this.sColorValueBuffed;
		} else if (a < 0) {
			return this.sColorValueDebuffed;
		} else {
			return this.sColorValueNorm;
		}
	},
	
	getAttrArray: function(a) {
		if (a === undefined) {
			return ['0', this.getAttrColor(0)];
		} else {
			return [(a[0] + a[1]).toString(), this.getAttrColor(a[1])];
		}
	},
	
	
	
	buildData: function() {
		var c = this.oParams.creature;
		var oAttr = c.getAttributes();
		var aBaseAttr = [
		'vitality', 
		'energy', 
		'power', 
		'speed', 
		'drphysical', 
		'drmagical', 
		'drfire', 
		'drcold', 
		'drelectricity', 
		'drtoxic', 
		'vulnerability',
		'luck'];
		
		var o, sAttr;
		for (var iAttr = 0; iAttr < aBaseAttr.length; iAttr++) {
			sAttr = aBaseAttr[iAttr];
			o =  this.getAttrArray(oAttr[sAttr]);
			this.displayAttribute(iAttr, STRINGS._('~attr_' + sAttr), o[0], o[1]);
		}
	}
});

