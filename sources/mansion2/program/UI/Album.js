O2.extendClass('UI.Album', UI.Window, {
	
	_oPhoto: null,
	
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
		
		this.setCommands([
			['↩ menu', ui.commandFunction('main'), 0], 
			null, 
			['◀prev', ui.commandFunction('album_prev'), 1], 
			['next▶', ui.commandFunction('album_next'), 1]
		]);
	},
	
	loadPhotos: function(aPhotos) {
		if (aPhotos.length) {
			var p = aPhotos[0];
			this._oPhoto.setSource(p.data);
		}
	}
});

