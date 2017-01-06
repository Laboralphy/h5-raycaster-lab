O2.extendClass('UI.Album', UI.Window, {
	
	_oPhoto: null,
	_aPhotos: null,
	_iPhoto: 0,
	_oLegend: null,

	WINDOW_WIDTH: 256,
	WINDOW_HEIGHT: 240,
	PHOTO_X: 32,
	PHOTO_Y: 32,
	PHOTO_BORDER: 8,
	TEXT_X: 16,
	TEXT_Y: 160,
	TEXT_HEIGHT: 52,
	
	/**
	 * Création du widget du menu principal
	 */
	__construct: function(ui) {
		__inherited({caption: ''});
		this.setSize(this.WINDOW_WIDTH, this.WINDOW_HEIGHT);
		this.setBackgroundImage('resources/ui/windows/bg-album.png');
		this._oPhoto = this.linkControl(new H5UI.Image());
		O876.CanvasFactory.setImageSmoothing(this._oPhoto.getSurface(), true);
		this._oPhoto.moveTo(this.PHOTO_X, this.PHOTO_Y);
		this._oPhoto._set('_nBorderWidth', this.PHOTO_BORDER);
		var oText = this.linkControl(new H5UI.Text());
		oText.setWordWrap(true);
		oText.setAutosize(false);
		oText.setSize(this.WINDOW_WIDTH - this.TEXT_X * 2, this.TEXT_HEIGHT);
		oText._set('_nLineHeight', 2);
		oText.moveTo(this.TEXT_X, this.TEXT_Y);
		oText.setFontColor('#CCC', '#000');
		oText.setFontFace('serif');
		oText.setFontSize(11);
		oText.setCaption('');
		this._oLegend = oText;
		
		var S = MANSION.STRINGS_DATA.UI;
		this.setCommands([
			[S.back, ui.commandFunction('mo_album'), 0], 
			null, null,
			[S.prev, ui.commandFunction('album_prev'), 1],
			[S.next, ui.commandFunction('album_next'), 1]
		]);
	},

	loadPhotos: function(aPhotos) {
		this._aPhotos = aPhotos;
	},
	
	/**
	 * Will find a photo with the specified id
	 * throws error if the id is not corresponding to a photo
	 * @param id matching the MANSION.STRINGS_DATA.SUBJECTS key
	 */
	findPhoto: function(id) {
		var ap = this._aPhotos;
		var i = -1;
		ap.some(function(p, x) {
			if (p.ref === id) {
				i = x;
				return true;
			} else {
				return false;
			}
		});
		if (i < 0) {
			throw new Error('photo subject not found : ' + id);
		}
		return i;
	},

	showPhoto: function(iPhoto) {
		if (typeof iPhoto === 'string') {
			iPhoto = this.findPhoto(iPhoto);
		}
		var ap = this._aPhotos;
		if (ap.length) {
			var p = ap[this._iPhoto = Math.max(0, Math.min(iPhoto, ap.length - 1))];
			this.setTitleCaption(MANSION.STRINGS_DATA.SUBJECTS[p.ref].title);
			this._oLegend.setCaption(MANSION.STRINGS_DATA.SUBJECTS[p.ref].description);
			this._oPhoto.setSource(p.data);
		}
	},

	showNextPhoto: function() {
		this.showPhoto(this._iPhoto + 1);
	},

	showPrevPhoto: function() {
		this.showPhoto(this._iPhoto - 1);
	},
});
