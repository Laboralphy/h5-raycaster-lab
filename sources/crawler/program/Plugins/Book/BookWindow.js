/** 
 * Fenetre de lecture de bouquin
 * les paramètre attendu sont :
 * title : titre du bouquin
 * image : url de l'image à afficher à droite
 * pages : tableau à indice numérique des pages
 * les page peuvent contenir des sauts à la ligne.
 */
O2.extendClass('UI.BookWindow', UI.Window, {
	nWidth: 540,
	nHeight: 320,
	nFontSize: 16,
	nPadding: 32,
	nImageWidth: 128,
	yText: 64,
	yTitle: 32,
	oParams: null,
	iPage: 0,
	oText: null,
	oImage: null,
	oGame: null,
	
	__construct: function(oParams) {
		__inherited({caption: STRINGS._('~win_book')});
		this.oParams = oParams;
		this.oGame = oParams.game;
		this.buildWindowContent();
	},
	
	buildWindowContent: function() {
		this.setSize(this.nWidth, this.nHeight);
		var oTitle = this.linkControl(new H5UI.Text());
		oTitle._bWordWrap = false;
		oTitle._bAutosize = true;
		oTitle.moveTo(this.nPadding, this.yTitle);
		oTitle.font.setSize(this.nFontSize * 1.2 | 0);
		oTitle.font.setFont('serif');
		oTitle.font.setStyle('bold');
		oTitle.font.setColor('#000000');
		oTitle.setCaption(this.oParams.title);	
		var oText = this.linkControl(new H5UI.Text());
		oText._bWordWrap = true;
		oText._bAutosize = false;
		oText.moveTo(this.nPadding, this.yText);
		if (this.oParams.images) {
			oText.setSize(this.nWidth - (this.nPadding * 3) - this.nImageWidth, this.nHeight - this.yText - this.nPadding);
			this.oImage = this.linkControl(new H5UI.Image());
			this.oImage.hide();
			this.oImage.__imageWidth = this.nImageWidth;
			this.oImage.moveTo(this.nWidth - this.nPadding - this.nImageWidth, this.yText);
		} else {
			oText.setSize(this.nWidth - (this.nPadding * 2), this.nHeight - this.yText - this.nPadding);
		}
		oText.font.setSize(this.nFontSize);
		oText.font.setFont('serif');
		oText.font.setColor('#000000');
		oText._nLineHeight = 4;
		this.oText = oText;
		
		
		this.setCommands([['~key_gen_close', 'book_close', 4],
		                  null,
		                  ['~key_book_prev', 'book_prev', 1],
		                  ['~key_book_next', 'book_next', 1]
		                  ]);
		this.readPage(0);
	},
	
	command: function(sCommand) {
		switch (sCommand) {
			case 'book_next':
				this.nextPage();
				break;
			
			case 'book_prev':
				this.previousPage();
				break;
				
			case 'book_close':
				this.close();
		}
	},
	
	/** Cette fonction est invoquée par l'image, attention au this
	 * 
	 */
	imageLoaded: function() {
		var oImage = this;
		var t = oImage._oTexture;
		var w = t.width;
		var h = t.height;
		var iw = oImage.__imageWidth;
		var h2 = h * iw / w | 0;
		oImage.setSize(iw, h2);
		oImage._bAutosize = false;
		oImage.show();
		oImage.invalidate();
	},
	
	readPage: function(i) {
		this.iPage = Math.min(this.oParams.pages.length - 1, Math.max(0, i));
		var oBPrev = this.getCommandButton(1);
		var oBNext = this.getCommandButton(2);
		if (this.iPage === 0) {
			oBPrev.hide();
		} else {
			oBPrev.show();
		}
		if (this.iPage == this.oParams.pages.length - 1) {
			oBNext.hide();
		} else {
			oBNext.show();
		}
		var sText = this.oParams.pages[this.iPage];
		this.oText.setCaption(sText);
		if (this.oParams.images) {
			this.oImage.setImage(this.oParams.images[i % this.oParams.images.length]);
			if (this.oImage._oTexture.complete) {
				this.imageLoaded.apply(this.oImage, []);
			} else {
				this.oImage.onLoad = this.imageLoaded;
			}
		}
	},
	
	/**
	 * Tourne la page pour lire la suite
	 * @return bool renvoie true si il reste des page à lire, false sinon
	 */
	nextPage: function() {
		if (this.iPage < (this.oParams.pages.length - 1)) {
			this.readPage(this.iPage + 1);
			return true;
		} else {
			return false;
		}
	},

	/**
	 * Tourne la page pour lire lla page précédente
	 * @return bool renvoie true si il reste des page à lire, false sinon
	 */
	previousPage: function() {
		if (this.iPage > 0) {
			this.readPage(this.iPage - 1);
			return true;
		} else {
			return false;
		}
	}
});

