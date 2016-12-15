O2.extendClass('UI.Notes', UI.Window, {

	_oList: null,
	_oPad: null,
	_oText: null,
	_oBG: null,
	_yCursor: 0,

	BUTTON_HEIGHT: 16,
	
	__construct: function(ui) {
		__inherited({caption: MANSION.STRINGS_DATA.UI.notes_title});
		this.setSize(256, 192);
		this.setBackgroundImage('resources/ui/windows/bg-notes.png');

		var oBG = this.linkControl(new H5UI.Box());
		oBG.setSize(240, 130 - (this.BUTTON_HEIGHT >> 1));
		oBG.moveTo(8, 31);
		oBG.setColor('#000');
		this.oBG = oBG;

		var oList = this.linkControl(new H5UI.ScrollBox());
		oList.setSize(oBG.getWidth(), oBG.getHeight() - 2);
		oList.moveTo(8, 32);
		this._oList = oList;
		oList.on('mousewheelup', (function(oEvent) {
			oList.scrollTo(oList.getScrollX(), oList.getScrollY() - (oEvent.button / 10 | 0));
		}).bind(this));
		oList.on('mousewheeldown', (function(oEvent) {
			oList.scrollTo(oList.getScrollX(), oList.getScrollY() - (oEvent.button / 10 | 0));
		}).bind(this));
		
		var oPad = this.linkControl(new H5UI.ScrollBox());
		oPad.setSize(oBG.getWidth(), oBG.getHeight() - 2);
		oPad.moveTo(8, 32);
		oPad.hide();
		this._oPad = oPad;
		oPad.on('mousewheelup', (function(oEvent) {
			oPad.scrollTo(oPad.getScrollX(), oPad.getScrollY() - (oEvent.button / 10 | 0));
		}).bind(this));
		oPad.on('mousewheeldown', (function(oEvent) {
			oPad.scrollTo(oPad.getScrollX(), oPad.getScrollY() - (oEvent.button / 10 | 0));
		}).bind(this));

		var oText = oPad.linkControl(new H5UI.Text());
		oText._set('_nLineHeight', 4);
		oText.moveTo(2, 2);
		oText.setFontColor('#CCC');
		oText.setFontFace('serif');
		oText.setFontSize(12);
		this._oText = oText;


		this.setCommands([
			[MANSION.STRINGS_DATA.UI.back, ui.commandFunction('note_back'), 0]
		]);
	},
	
	createTextItem: function(sText) {
		var oText = this._oPad.linkControl(new H5UI.Text());
		oText._set('_nLineHeight', 4);
		oText.moveTo(2, 2 + this._yCursor);
		oText.setFontColor('#CCC');
		oText.setFontFace('serif');
		oText.setFontSize(12);
		oText.setWordWrap(true);
		oText.setAutosize(true);
		oText.setSize(this.oBG.getWidth() - 4, 0);
		oText.setCaption(sText);
		this._yCursor += oText.getHeight();
	},

	/**
	 * Display document
	 * { type: text | image
	 */
	displayDocument: function(sTitle, aItems) {
		this.setTitleCaption(sTitle);
		this._oList.hide();
		this._oPad.clear();
		aItems.forEach(function(oItem) {
			switch (oItem.type) {
				case 'text':
					this.createTextItem(oItem.content);
					break;
			}
		}, this);
		this._oPad.show();
	},
	
	displayList: function() {
		this.setTitleCaption(MANSION.STRINGS_DATA.UI.notes_title);
		this._oPad.hide();
		this._oList.show()
	},

	/**
	 * aTitles in an array of plain objets.
	 * each containing : 
	 * {
	      id: string, used for event 
	      title: string, used for display
	    }
	 */
	loadTitles: function(ui, aTitles) {
		this._oList.clear();
		aTitles.forEach((function(x, i) {
			this.appendTitle(ui, i, x.id, x.title);
		}).bind(this));
	},

	/**
	 * Add a new title to the list
	 */
	appendTitle: function(ui, iRank, id, sTitle) {
		var b = this._oList.linkControl(new H5UI.Button());
		b.setSize(this._oList.getWidth(), this.BUTTON_HEIGHT);
		b.oText.setAutosize(false);
		b.oText.setSize(b.getWidth() - 8, this.BUTTON_HEIGHT);
		b.oText.moveTo(4, 4);
		b.setColor('#666', '#999');
		b.oText.font.setColor('#FFF');
		b.setCaption(sTitle);
		b.moveTo(0, iRank * this.BUTTON_HEIGHT);
		b.on('click', ui.commandFunction('note_read', {note: id}));
	}

});
