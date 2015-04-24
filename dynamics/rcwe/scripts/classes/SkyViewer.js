O2.extendClass('RCWE.SkyViewer', RCWE.Window, {
	
	onImageLoaded: null,
	
	oImage: null,
	
	build: function() {
		__inherited('Sky view');
		
		var tb = this.getToolBar();
		var c = this.getContainer();
		
		tb.imageLoader({load: this.imageSourceSet.bind(this), emptyable: true});
		
		var $oImage = $('<img />');
		c.append($oImage);
		$oImage.bind('load', this.imageLoaded.bind(this));
		this.oImage = $oImage;
	},
	
	imageLoaded: function(oEvent) {
		this.oImage.fadeIn();
		if (this.onImageLoaded) {
			this.onImageLoaded(this);
		}
	},
	
	imageSourceSet: function(sData) {
		var oImg = this.oImage;
		oImg.fadeOut(function() {
			oImg.attr('src', sData).css('max-width', '480px');
		});
	},
	
	getSource: function() {
		return this.oImage.attr('src');
	},
	
	/**
	 * Serialization de l'objet en vue d'une sauvegarde
	 */
	serialize: function() {
		var a = [];
		a.push(this.getSource());
		return a;
	},
	
	unserialize: function(a) {
		this.imageSourceSet(a[0]);
	}
});
