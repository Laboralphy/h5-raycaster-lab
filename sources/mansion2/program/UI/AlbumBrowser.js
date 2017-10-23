O2.extendClass('UI.AlbumBrowser', UI.Window, {
	
	_oPhoto: null,
	_aPhotos: null,
	_iPhoto: 0,
	
	_oList: null,
	_nSortType: 0,
	_nSortOrder: 1,
	_oBG: null,
	_oScrollBar: null,

	WINDOW_WIDTH: 256,
	WINDOW_HEIGHT: 240,
	PHOTO_X: 32,
	PHOTO_Y: 32,
	PHOTO_BORDER: 8,
	TEXT_X: 16,
	TEXT_Y: 160,
	TEXT_HEIGHT: 52,
	ITEM_HEIGHT: 32,
	PADDING: 8,
	START_Y: 32, // debut de la position de la liste et du pad
	SCROLLBAR_WIDTH: 4, // Epaisseur barre de scroll
	
	/**
	 * Création du widget du menu principal
	 */
	__construct: function(ui) {
		__inherited({caption: MANSION.STRINGS_DATA.UI.album_title});
		this.setSize(this.WINDOW_WIDTH, this.WINDOW_HEIGHT);
		this.setBackgroundImage('resources/ui/windows/bg-album.png');

		// the background
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

		var S = MANSION.STRINGS_DATA.UI;
		this.setCommands([
			[S.back, ui.commandFunction('main'), 0],
			null,
			[S.sort.dateDesc, ui.commandFunction('alb_sort_date'), 0],
			[S.sort.typeDesc, ui.commandFunction('alb_sort_type'), 0],
		]);
		
		this.displayList();
	},

	sortPhotosBy: function(nType) {
		if (this._nSortType === nType) {
			this._nSortOrder *= -1;
		} else {
			this._nSortType = nType;
		}
		var oBtnSortDate = this._aCmdButtons[1];
		var oBtnSortType = this._aCmdButtons[2];
		switch (this._nSortType * 10 + this._nSortOrder) {
			case -1: // date desc
				oBtnSortDate.setColor('#9C9', '#AFA');
				oBtnSortType.setColor('#999', '#AAA');
				oBtnSortDate.setCaption(MANSION.STRINGS_DATA.UI.sort.dateDesc);
				break;
			case 1: // date asc
				oBtnSortDate.setColor('#9C9', '#AFA');
				oBtnSortType.setColor('#999', '#AAA');
				oBtnSortDate.setCaption(MANSION.STRINGS_DATA.UI.sort.dateAsc);
				break;
			case 9: // type desc
				oBtnSortType.setColor('#9C9', '#AFA');
				oBtnSortDate.setColor('#999', '#AAA');
				oBtnSortType.setCaption(MANSION.STRINGS_DATA.UI.sort.typeDesc);
				break;
			case 11: // type asc
				oBtnSortType.setColor('#9C9', '#AFA');
				oBtnSortDate.setColor('#999', '#AAA');
				oBtnSortType.setCaption(MANSION.STRINGS_DATA.UI.sort.typeAsc);
				break;
		}
	},

	loadPhotos: function(ui, aPhotos) {
		this._oList.clear();
		var nOrder = this._nSortOrder;
		if (!aPhotos) {
			return;
		}
		// une photo = { id: , s: description, n: image }
		switch (this._nSortType) {
			case 0: // date
				this._aPhotos = aPhotos.sort(function (p1, p2) {
					return nOrder * (p1.date - p2.date);
				});
				break;

			case 1: // type
				this._aPhotos = aPhotos.sort(function(p1, p2) {
					return nOrder * (p1.type === p2.type ? p1.date - p2.date : p1.type - p2.type);
				});
				break;

			default:
				this._aPhotos = aPhotos;
				break;
		}
		if (this._aPhotos) {
			this._aPhotos.forEach(function(p, i) {
				this.appendPhoto(ui, i, p);
			}, this);
		}
	},
	
	/**
	 * Définir le composant associé à la scrollbar
	 */
	setScrollBarOwner: function(oOwner) {
		this._oDisplayed = oOwner;
		oOwner.getContainer().render();
		oOwner.render();
	},

	renderSelf: function() {
		var oOwner = this._oList;
		var sb = this._oScrollBar;
		sb.setStepCount(oOwner.getContainer().height());
		sb.setLength(oOwner.height());
		sb.setPosition(oOwner.getScrollY());
	},
	
	displayList: function() {
		this._oList.show();
		this.setScrollBarOwner(this._oList);
	},
	
	/**
	 * Add a new title to the list
	 */
	appendPhoto: function(ui, iRank, oPhoto) {
		var PHOTO_WIDTH = 54;
		var PHOTO_HEIGHT = 30;
		var id = oPhoto.ref, sTitle = MANSION.STRINGS_DATA.SUBJECTS[oPhoto.ref].title;
		var b = this._oList.linkControl(new H5UI.Button());
		b.setSize(this._oList.width(), this.ITEM_HEIGHT);
		b.oText.align('');
		b.oText.setAutosize(false);
		b.oText.setSize(b.width() - PHOTO_WIDTH - this.PADDING, this.ITEM_HEIGHT);
		b.oText.moveTo(PHOTO_WIDTH + this.PADDING, (this.PADDING >> 1) - 4);
		b.setColor('#333', '#666');
		b.oText.font.setColor('#FFF');
		b.setCaption(sTitle);
		b.moveTo(0, iRank * this.ITEM_HEIGHT);
		b.on('click', ui.commandFunction('album_view', {photo: id}));

		var sIcon;
		switch (oPhoto.type) {
			case 1: // ghost
				sIcon = 'i-alb-proof';
				break;

			case 2: // painting
				sIcon = 'i-alb-paint';
				break;

			case 3:
				sIcon = 'i-alb-clue';
				break;

			default:
				sIcon = '';
				break;
		}

		if (sIcon) {
			var oIcon = b.linkControl(new H5UI.Image());
			oIcon._set('_bAutosize', true);
			oIcon.setSource('resources/ui/windows/' + sIcon + '.png');
			oIcon.moveTo(b.width() - 32, (b.height() - 24) >> 1);
		}

		var oImage = b.linkControl(new H5UI.Image());
		oImage._set('_bAutosize', false);
		oImage.setSize(PHOTO_WIDTH, PHOTO_HEIGHT);
		O876.CanvasFactory.setImageSmoothing(oImage.getSurface(), true);
		var CORNER_PADDING = (this.ITEM_HEIGHT - PHOTO_HEIGHT) >> 1;
		oImage.moveTo(CORNER_PADDING, CORNER_PADDING);
		oImage._set('_nBorderWidth', 0);
		oImage.setSource(oPhoto.data);
	}
});
