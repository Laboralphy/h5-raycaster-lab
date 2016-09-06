O2.extendClass('MANSION.PhoneApp.Album', MANSION.PhoneApp.Abstract, {

	sOrientation: 'port',
	name: 'Album',

	oStatusBar: null,
	bAlbumTime: false,
	aPhotos: null,
	oPhotoCvs: null,
	oSubjectCvs: null,
	oNoSubjectCvs: null,
	sPhotoSubject: '',
	nIndex: 0,

	nScreenWidth: 0,
	sPoke: '',

	oBG: null,
	oArrowNext: null,
	oArrowPrev: null,

	__construct: function() {
		this.oStatusBar = new MANSION.PhoneApp.StatusBar();
		var nArrowSize = 32;
		var c, ctx;
		
		c = O876.CanvasFactory.getCanvas(nArrowSize, nArrowSize, true);
		ctx = c.getContext("2d");
		ctx.fillStyle = 'rgba(0, 0, 0, 0.333)';
		ctx.beginPath();
		ctx.arc(nArrowSize >> 1, nArrowSize >> 1, nArrowSize >> 1, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = 'white';
		ctx.strokeStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(nArrowSize >> 2, nArrowSize >> 1);
		ctx.lineTo((nArrowSize >> 2) + (nArrowSize >> 2) + (nArrowSize >> 2), (nArrowSize >> 1) - (nArrowSize >> 2));
		ctx.lineTo((nArrowSize >> 2) + (nArrowSize >> 2) + (nArrowSize >> 2), (nArrowSize >> 1) + (nArrowSize >> 2));
		ctx.lineTo(nArrowSize >> 2, nArrowSize >> 1);
		ctx.fill();
		ctx.stroke();

		this.oArrowPrev = c;

		c = O876.CanvasFactory.getCanvas(nArrowSize, nArrowSize, true);
		ctx = c.getContext("2d");
		ctx.save();
		ctx.translate(nArrowSize, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(this.oArrowPrev, 0, 0);
		ctx.restore();

		this.oArrowNext = c;
	},
	
	update: function(oLogic) {
		this.oStatusBar.update(oLogic);
		if (this.bAlbumTime) {
			// get all photos
			this.aPhotos = oLogic.getAlbum();
			if (Array.isArray(this.aPhotos)) {
				this.nIndex = this.aPhotos.length - 1;
				this.renderPhoto(this.nIndex);
			} else {
				this.nIndex = -1;
			}
			this.bAlbumTime = false;
		}
	},

	renderPhoto: function(n) {
		n = Math.max(0, Math.min(this.aPhotos.length - 1, n));
		var sData = this.aPhotos[n].data;
		this.sPhotoSubject = this.aPhotos[n].ref;
		var oImage = new Image();
		this.oPhotoCvs = null;
		this.oSubjectCvs = null;
		this.sPoke = '';
		oImage.addEventListener('load', (function(oEvent) {
			var img = oEvent.target;
			var p = O876.CanvasFactory.getCanvas(0, 0, true);
			p.width = img.naturalWidth;
			p.height = img.naturalHeight;
			p.getContext('2d').drawImage(img, 0, 0);
			this.oPhotoCvs = p;
			this.nIndex = n;
		}).bind(this));
		oImage.src = sData;
	},

	peek: function(x, y) {
		// if no photo : no need to go further
		this.sPoke = null;
		if (!Array.isArray(this.aPhotos)) {
			return null;
		}
		// computing sensitive area width 
		var sw4 = this.nScreenWidth >> 2;
		var sPoke = null;
		// if cursor outside phone : exit
		if (x < 0 || x > this.nScreenWidth) {
			return null;
		}
		if (x < sw4 && this.nIndex > 0) {
			// cursor is in left area, and there is a previous photo
			sPoke = 'prev';
		} else if (x > (sw4 * 3) && this.nIndex < (this.aPhotos.length - 1)) {
			// cursor is in right area, and there is a next photo
			sPoke = 'next';
		}
		return this.sPoke = sPoke;
	},

	execCommand: function(sCommand, oGame) {
		switch (sCommand) {
			case 'prev':
				this.renderPhoto(this.nIndex - 1);
			break;

			case 'next':
				this.renderPhoto(this.nIndex + 1);
			break;
		}
	},

	open: function() {
		this.bAlbumTime = true;
	},

	render: function(oPhone) {
		var oScreen = oPhone.oScreen;
		var oScreenCtx = oScreen.getContext('2d');
		var cw = oScreen.width;
		var ch = oScreen.height;
		this.nScreenWidth = cw;
		var c, ctx;
		if (!this.oBG) {
			var bg = O876.CanvasFactory.getCanvas(cw, ch, true);
			ctx = bg.getContext('2d');
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, cw, ch);
			this.oBG = bg;
		}
		oScreenCtx.drawImage(this.oBG, 0, this.oStatusBar.SB_HEIGHT);
		var oPhoto = this.oPhotoCvs;
		if (oPhoto) {
			var ph = cw * oPhoto.height / oPhoto.width | 0;
			oScreenCtx.drawImage(
				oPhoto, 
				0, 
				0, 
				oPhoto.width, 
				oPhoto.height, 
				0, 
				this.oStatusBar.SB_HEIGHT,
				cw,
				ph
			);
			if (!this.oSubjectCvs) {
				this.oSubjectCvs = O876.CanvasFactory.getCanvas(cw, 32, true);
				ctx = this.oSubjectCvs.getContext('2d');
				ctx.textBaseline = 'top';
				ctx.textAlign = 'center';
				ctx.fillStyle = 'white';
				ctx.font = '10px monospace';
				ctx.fillText(this.sPhotoSubject, cw >> 1, 0);
				ctx.fillStyle = 'rgb(192, 192, 192)';
				ctx.fillText((this.nIndex + 1).toString() + '/' + this.aPhotos.length, cw >> 1, 16);
			}
			oScreenCtx.drawImage(this.oSubjectCvs, 0, 4 + ph + this.oStatusBar.SB_HEIGHT);
			// Arrows
			var ph2 = ph >> 1;
			switch (this.sPoke) {
				case 'prev':
					oScreenCtx.drawImage(this.oArrowPrev, 0, ph2);
					break;

				case 'next':
					oScreenCtx.drawImage(this.oArrowNext, cw - this.oArrowNext.width, ph2);
					break;
			}
		} else {
			if (!this.oNoSubjectCvs) {
				c = O876.CanvasFactory.getCanvas(cw, 64, true);
				ctx = c.getContext("2d");
				ctx.font = '10px monospace';
				ctx.textBaseline = 'top';
				ctx.textAlign = 'center';
				ctx.fillStyle = 'white';
				ctx.fillText('(' + MANSION.STRINGS_DATA.UI.empty_album + ')', c.width >> 1, c.height >> 1);
				this.oNoSubjectCvs = c;
			}
			oScreenCtx.drawImage(this.oNoSubjectCvs, 0, this.oStatusBar.SB_HEIGHT);
		}

		this.oStatusBar.render(oPhone);
	}
});
