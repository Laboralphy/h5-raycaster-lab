O2.extendClass('RCWE.TileBrowser', RCWE.Window, {
	
	onSelect: null,
	onImageLoaded: null,
	onError: null,
	
	oScrollZone: null,
	oImage: null,
	
	nAllowedHeight: null,
	nAllowedWidth: null,
	
	bComplete: false,
	
	
	build: function(sCustomTitle, oOptions) {
		__inherited(sCustomTitle);

		oOptions = oOptions || {};
		oOptions.select = this.tileSelected.bind(this);
		oOptions.load = this.imageLoaded.bind(this);
		
		var tb = this.getToolBar();
		var c = this.getContainer();
		
		var $oScrollZone = $('<div style="overflow-x: scroll; overflow-y: hidden"></div>');
		this.oScrollZone = $oScrollZone;
		c.append($oScrollZone);
		
		var $oImage = $('<img />');
		$oScrollZone.append($oImage);
		tb.imageLoader({load: this.imageSourceSet.bind(this), emptyable: true});
		$oImage.tilesetSelector(oOptions);
		this.oImage = $oImage;

		var $oClear = $('<button type="button">Clear markers</button>');
		$oClear.bind('click', this.cmd_clear.bind(this));
		$oClear.attr('title', 'clear the markers, no texture selected');
		tb.append($oClear);
	},
	
	imageLoaded: function(oEvent) {
		var w = this.oImage.width();
		var h = this.oImage.height();
		if (this.nAllowedWidth && (w < this.nAllowedWidth)) {
			if (this.onError) {
				this.onError('Invalid image width - the width must be greater than ' + this.nAllowedWidth + ' px');
				this.imageSourceSet('');
				return;
			}
		}
		if (this.nAllowedHeight && h != this.nAllowedHeight) {
			if (this.onError) {
				this.onError('Invalid image height - the height must be exactly ' + this.nAllowedHeight + ' px');
				this.imageSourceSet('');
				return;
			}
		}
		this.bComplete = true;
		if (this.onImageLoaded) {
			this.onImageLoaded(this);
		}
	},
	
	
	setMarker: function(nMarker, nIndex) {
		this.oImage.tilesetSelector({ action: 'set', marker: nMarker, index: nIndex});
		if (nIndex === null) {
			this.tileSelected(nMarker, null, null);
		} else {
			var oCanvas = $('canvas', this.oImage.next()).get(nIndex);
			this.tileSelected(nMarker, nIndex, oCanvas);
		}
	},

	imageSourceSet: function(sData) {
		this.bComplete = false;
		if (sData === '') {
			this.oImage.tilesetSelector({'action': 'clear'});
		}
		this.oImage.attr('src', sData);
	},
	
	tileSelected: function(nMarker, nIndex, oCanvas) {
		if (this.onSelect) {
			this.onSelect(this, nMarker, nIndex, oCanvas);
		}
	},
	
	cmd_clear: function(oEvent) {
		this.setMarker(0, null);
		this.setMarker(1, null);
	},
	
	/**
	 * Serialization de l'objet en vue d'une sauvegarde
	 */
	serialize: function() {
		var a = [];
		a.push(this.oImage.attr('src'));
		return a;
	},
	
	unserialize: function(a) {
		this.imageSourceSet(a[0]);
	}
});
