O2.extendClass('UI.Notes', UI.Window, {

	_oList: null,
	_oPad: null,
	_oText: null,
	_oBG: null,
	_oScrollBar: null,
	_yCursor: 0,

	_oDisplayed: null,

	ITEM_HEIGHT: 16,
	
	START_Y: 32, // debut de la position de la liste et du pad
	SCROLLBAR_WIDTH: 4, // Epaisseur barre de scroll
	PADDING: 8, // Espacement bordure - composant
	WINDOW_WIDTH: 256,
	WINDOW_HEIGHT: 192,

	__construct: function(ui) {
		__inherited({caption: MANSION.STRINGS_DATA.UI.notes_title});
		this.setSize(this.WINDOW_WIDTH, this.WINDOW_HEIGHT);
		this.setBackgroundImage('resources/ui/windows/bg-notes.png');
		// Background of the pad
		var oBG = this.linkControl(new H5UI.Box());
		var BG_HEIGHT = this.height() - this._nButtonHeight - this._nButtonPadding * 2 - (this.START_Y - 1);
		oBG.setSize(this.WINDOW_WIDTH - this.PADDING * 2, BG_HEIGHT);
		oBG.moveTo(this.PADDING, this.START_Y - 1);
		oBG.setColor('#000');
		this.oBG = oBG;

		// List of articles
		// Clicking on an item of this list will
		// Display the PAD and the text content
		var oList = this.linkControl(new H5UI.ScrollBox());
		oList.setSize(oBG.width(), BG_HEIGHT - 2);
		oList.moveTo(this.PADDING, this.START_Y);
		this._oList = oList;
		oList.on('mousewheelup', (function(oEvent) {
			oList.scrollTo(oList.getScrollX(), oList.getScrollY() - (oEvent.button / 10 | 0));
			oScrollBar.setPosition(oList.getScrollY());
		}).bind(this));
		oList.on('mousewheeldown', (function(oEvent) {
			oList.scrollTo(oList.getScrollX(), oList.getScrollY() - (oEvent.button / 10 | 0));
			oScrollBar.setPosition(oList.getScrollY());
		}).bind(this));

		// The scrollbar (for both list and pad)
		var oScrollBar = this.linkControl(new H5UI.ScrollBar());
		oScrollBar.setSize(this.SCROLLBAR_WIDTH, BG_HEIGHT - 2);
		oScrollBar.moveTo(this.width() - this.PADDING - this.SCROLLBAR_WIDTH, this.START_Y);
		oScrollBar.setOrientation(1);
		this._oScrollBar = oScrollBar;
		oScrollBar.show();
		
		// Pad : the zone on where the text is written
		var oPad = this.linkControl(new H5UI.ScrollBox());
		oPad.setSize(oBG.width(), BG_HEIGHT - 2);
		oPad.moveTo(this.PADDING, this.START_Y);
		oPad.hide();
		this._oPad = oPad;
		oPad.on('mousewheelup', (function(oEvent) {
			oPad.scrollTo(oPad.getScrollX(), oPad.getScrollY() - (oEvent.button / 10 | 0));
			oScrollBar.setPosition(oPad.getScrollY());
		}).bind(this));
		oPad.on('mousewheeldown', (function(oEvent) {
			oPad.scrollTo(oPad.getScrollX(), oPad.getScrollY() - (oEvent.button / 10 | 0));
			oScrollBar.setPosition(oPad.getScrollY());
		}).bind(this));


		this.setCommands([
			[MANSION.STRINGS_DATA.UI.back, ui.commandFunction('note_back'), 0]
		]);
	},
	
	/**
	 * This will create a text item
	 * Please provide the text content.
	 * The text object will be appended to the PAD
	 * @param sText string : text content
	 */
	createTextItem: function(sText) {
		var oText = this._oPad.linkControl(new H5UI.Text());
		oText._set('_nLineHeight', 4);
		oText.moveTo(2, 2 + this._yCursor);
		oText.setFontColor('#CCC');
		oText.setFontFace('serif');
		oText.setFontSize(12);
		oText.setWordWrap(true);
		oText.setAutosize(true);
		oText.setSize(this.oBG.width() - this.PADDING, 0);
		oText.setCaption(sText);
		this._yCursor += oText.height() + 2;
	},

	createImageItem: function(oSrc) {
		var oImg = this._oPad.linkControl(new H5UI.Image());
		oImg.setSource(oSrc);
		oImg.render();
		oImg.moveTo((this.oBG.width() - oImg.width()) >> 1, 2 + this._yCursor);
		this._yCursor += oImg.height() + 2;
	},

	createButtonItem: function(sCaption, pClick) {
		var oButton = this._oPad.linkControl(new H5UI.Button());
		oButton.setSize(this.oBG.width() - this.PADDING * 2, 16);
        oButton.moveTo((this.oBG.width() - oButton.width()) >> 1, 2 + this._yCursor);
		oButton.setCaption(sCaption);
		oButton.on('click', pClick);
        this._yCursor += oButton.height() + 2;
	},

	/**
	 * Display document
	 * { type: text | image
	 */
	displayDocument: function(aItems, pOnClick) {
		this._oList.hide();
		this._oPad.clear();
		this._yCursor = 0;
		var oLoader = new O876_Raycaster.ImageListLoader();
		aItems
			.filter(i => i.type === 'image')
			.forEach(function(i) {
				oLoader.addImage(i.src);
			});
		oLoader.on('load', (function(aImgList) {
			aItems.forEach(function(oItem) {
				switch (oItem.type) {
					case 'title':
                        this.setTitleCaption(oItem.content);
                        break;

					case 'text':
						this.createTextItem(oItem.content);
						break;

					case 'image':
						// les image de aImgList, sont rangées dans le meme ordre
						// que l'objet de définiton initial : aItems
						this.createImageItem(aImgList.shift());
						break;

					case 'button':
						this.createButtonItem(oItem.caption, () => pOnClick(oItem.action));
						break;
				}
			}, this);
			this._oPad.show();
			this.setScrollBarOwner(this._oPad);
		}).bind(this));
		oLoader.loadAll();
	},
	
	displayList: function() {
		this.setTitleCaption(MANSION.STRINGS_DATA.UI.notes_title);
		this._oPad.hide();
		this._oList.show();
		this.setScrollBarOwner(this._oList);
	},

	/**
	 * Définirr le composant associé à la scrollbar
	 */
	setScrollBarOwner: function(oOwner) {
		this._oDisplayed = oOwner;
		oOwner.getContainer().render();
		oOwner.render();
	},

	renderSelf: function() {
		var oOwner = this._oDisplayed;
		if (oOwner) {
			var sb = this._oScrollBar;
			sb.setStepCount(oOwner.getContainer().height());
			sb.setLength(oOwner.height());
			sb.setPosition(oOwner.getScrollY());
		}
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
		b.setSize(this._oList.width(), this.ITEM_HEIGHT);
		b.oText.setAutosize(false);
		b.oText.setSize(b.width() - this.PADDING, this.ITEM_HEIGHT);
		b.oText.moveTo(this.PADDING >> 1, this.PADDING >> 1);
		b.setColor('#666', '#999');
		b.oText.font.setColor('#FFF');
		b.setCaption(sTitle);
		b.moveTo(0, iRank * this.ITEM_HEIGHT);
		b.on('click', ui.commandFunction('note_read', {note: id}));
	}

});
