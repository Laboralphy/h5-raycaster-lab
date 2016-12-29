/** 
 * Intro Effect
 * Display flash photo and text
 */
O2.extendClass('MANSION.GX.IntroSplash', O876_Raycaster.GXEffect, {
	sClass: 'IntroSplash',
	oCanvas: null,
	bOver: false,
	
	aText: null,
	oEasingAlpha: null,
	
	oPhoto: null,
	aPhotos: null,
	nPhotoTime: 0,
	oPhotoRect: null,
	nSplash: 0,
	nMaxSplash: 4,
	

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		var rcc = oRaycaster.getRenderCanvas();
		var oCanvas = O876.CanvasFactory.getCanvas();
		oCanvas.width = rcc.width;
		oCanvas.height = rcc.height;
		this.oCanvas = oCanvas;
	},

	/** 
	 * Affiche le splash d'une photo.
	 * La photo apparait à position / taille aléatoire
	 * puis se dessine coorectement dans l'écran
	 */
	splash: function(oPhoto, nMaxSplash) {
		if (nMaxSplash) {
			this.nMaxSplash = nMaxSplash;
		}
		if (Array.isArray(oPhoto)) {
			this.aPhotos = oPhoto;
		} else {
			this.aPhotos = [oPhoto];
		}
		this.nextPhoto();
	},
	
	nextPhoto: function() {
		this.oPhoto = this.aPhotos.shift();
		if (this.oPhoto) {
			this.nPhotoTime = 0;
			this.nSplash = this.nMaxSplash;
		} else {
			this.terminate();
		}
	},

	/** 
	* Cette fonction doit renvoyer TRUE si l'effet est fini
	* @return bool
	*/
	isOver: function() {
		return this.bOver;
	},

	/** Fonction appelée par le gestionnaire d'effet pour recalculer l'état de l'effet
	*/
	process: function() {
		if (this.oPhoto) {
			if (this.nPhotoTime <= 0) {
				--this.nSplash;
				var pr = {
					x: 0,
					y: 0,
					width: this.oPhoto.width,
					height: this.oPhoto.height,
				};
				if (this.nSplash > 0) {
					pr.x = -MAIN.rand() * pr.width;
					pr.y = -MAIN.rand() * pr.height;
					pr.width *= 2;
					pr.height *= 2;
					this.oPhotoRect = pr;
					this.nPhotoTime = 2;
				} else if (this.nSplash === 0) {
					pr.x = this.oCanvas.width - pr.width >> 1;
					pr.y = this.oCanvas.height - pr.height >> 1;
					this.oPhotoRect = pr;
					this.nPhotoTime = 8;
				} else if (this.nSplash < 0) {
					this.nextPhoto();
				}
				
			}
			--this.nPhotoTime;
		}
	},

	/** Fonction appelée par le gestionnaire d'effet pour le rendre à l'écran
	*/
	render: function() {
		var cvs = this.oCanvas;
		var ctx = cvs.getContext('2d');
		if (this.oPhoto && this.oPhotoRect) {
			var p = this.oPhoto;
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, cvs.width, cvs.height);
			var pr = this.oPhotoRect;
			ctx.drawImage(
				this.oPhoto, 
				0, 
				0, 
				this.oPhoto.width, 
				this.oPhoto.height,
				pr.x,
				pr.y,
				pr.width,
				pr.height
			);
		}
		this.oRaycaster.getRenderContext().drawImage(cvs, 0, 0);
	},

	/** Fonction appelée lorsque l'effet se termine de lui même
	* ou stoppé par un clear() du manager
	*/
	done: function() {
		this.terminate();
	},

	/** Permet d'avorter l'effet
	* Il faut coder tout ce qui est nécessaire pour terminer proprement l'effet
	* (restauration de l'état du laby par exemple)
	*/
	terminate: function() {
		this.bOver = true;
	}
});

