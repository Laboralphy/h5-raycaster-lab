O2.extendClass('UI.Album', UI.Window, {
	
	_oPhoto: null,
	_aPhotos: null,
	_iPhoto: 0,
	
	/**
	 * Création du widget du menu principal
	 */
	__construct: function(ui) {
		__inherited({caption: MANSION.STRINGS_DATA.UI.album_title});
		this.setSize(256, 192);
		this.setBackgroundImage('resources/ui/windows/bg-album.png');
		this._oPhoto = this.linkControl(new H5UI.Image());
		O876.CanvasFactory.setImageSmoothing(this._oPhoto.getSurface(), true);
		this._oPhoto.moveTo(32, 32);
		this._oPhoto._set('_nBorderWidth', 8);
		
		var S = MANSION.STRINGS_DATA.UI;
		this.setCommands([
			[S.back, ui.commandFunction('main'), 0], 
			null, null,
			[S.prev, ui.commandFunction('album_prev'), 1],
			[S.next, ui.commandFunction('album_next'), 1]
		]);
	},

	loadPhotos: function(aPhotos) {
		this._aPhotos = aPhotos;
		if (aPhotos) {
			this.showPhoto(aPhotos.length - 1);
		}
	},

	showPhoto: function(iPhoto) {
		switch (iPhoto) {
			case 'next':
				this.showNextPhoto();
				break;
			case 'prev':
				this.showPrevPhoto();
				break;
			default:
				var ap = this._aPhotos;
				if (ap.length) {
					var p = ap[this._iPhoto = Math.max(0, Math.min(ap.length - 1))];
					this._oPhoto.setSource(p.data);
				}
				break;
		}
	},

	showNextPhoto: function() {
		this.showPhoto(this._iPhoto + 1);
	},

	showPrevPhoto: function() {
		this.showPhoto(this._iPhoto - 1);
	},
});
