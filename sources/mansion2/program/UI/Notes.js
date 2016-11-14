O2.extendClass('UI.Notes', UI.Window, {

	_oList: null,

	BUTTON_HEIGHT: 16,
	
	__construct: function(ui) {
		__inherited({caption: MANSION.STRINGS_DATA.UI.notes_title});
		this.setSize(256, 192);
		this.setBackgroundImage('resources/ui/windows/bg-notes.png');

		oBG = this.linkControl(new H5UI.Box());
		oBG.setSize(240, 130 - (this.BUTTON_HEIGHT >> 1));
		oBG.moveTo(8, 31);
		oBG.setColor('#000');

		var oList = this.linkControl(new H5UI.ScrollBox());
		oList.setSize(oBG.getWidth(), oBG.getHeight() - 2);
		oList.moveTo(8, 32);
		this._oList = oList;
		this.setCommands([
			['↩ menu', ui.commandFunction('main'), 0]
		]);
		oList.on('mousewheelup', (function(oEvent) {
			oList.scrollTo(oList.getScrollX(), oList.getScrollY() - (oEvent.button/10 | 0));
		}).bind(this));
		oList.on('mousewheeldown', (function(oEvent) {
			oList.scrollTo(oList.getScrollX(), oList.getScrollY() - (oEvent.button/10 | 0));
		}).bind(this));
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
		//this._oList.clear();
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
		b.oText._set('_bAutosize', false);
		b.oText.setSize(b.getWidth() - 8, this.BUTTON_HEIGHT);
		b.oText.moveTo(4, 4);
		b.setColor('#666', '#999');
		b.oText.font.setColor('#FFF');
		b.setCaption(sTitle);
		b.moveTo(0, iRank * this.BUTTON_HEIGHT);
		b.on('click', ui.commandFunction('note_' + id));
	}

});
