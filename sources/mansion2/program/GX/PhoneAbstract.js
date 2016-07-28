// GX Phone Abstract
// Effets visuels associés au smartphone
// Classe abstraite

O2.extendClass('MANSION.GX.PhoneAbstract', O876_Raycaster.GXEffect, {
	sClass: 'PhoneAbstract',
	sTile: '',
	oCanvas: null,
	oContext: null,
	bOver: false,
	oEasing: null,
	
	oBlurCvs: null,
	nBlurHeight: 8, // hauteur de la frange horiz en pixels
	nBlurWidth: 8, // hauteur de la frange horiz en pixels
	oPhone: null,
	oScreen: null,
	oScreenContext: null,

	nRaise: 0,
	nTimeIndex: 0,
	nMaxTimeIndex: 10,
	nState: 0, // 0: normal, 10, start raising, 11: raising, 20: start falling, 21, falling
	
	oApplication: null,
	onHidden: null,
	
	SCREEN_W: 100, // application screen width
	SCREEN_H: 100, // application screen height
	SCREEN_X: 0, // application screen position relative to the start of the image skin
	SCREEN_Y: 0,

	xPhone: -1,
	yPhone: -1,


	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		
		var c = oRaycaster.oCanvas;
		var ctx = c.getContext('2d'); 
		this.oCanvas = c;
		this.oContext = ctx;
		this.oEasing = new O876.Easing();
		this.aApplications = {};
		
		// phone
		this.oPhone = oRaycaster.getTile(this.sTile);
		this.nBlurHeight = (this.oCanvas.height >> 3);
		this.nBlurWidth = (this.oCanvas.width >> 3);
		
		this.oBlurCvs = O876.CanvasFactory.getCanvas();
		this.oBlurCvs.width = this.nBlurWidth;
		this.oBlurCvs.height = this.nBlurHeight;
		O876.CanvasFactory.setImageSmoothing(this.oBlurCvs.getContext('2d'), true);

		var c = oRaycaster.getRenderCanvas();
		// phone screen
		this.oScreen = O876.CanvasFactory.getCanvas();
		this.oScreen.width = this.SCREEN_W;
		this.oScreen.height = this.SCREEN_H;
		
		this.oScreenContext = this.oScreen.getContext('2d');
		O876.CanvasFactory.setImageSmoothing(this.oScreenContext, true);
	},

	
	setApplication: function(a) {
		this.oApplication = a;
	},
	
	renderApplication: function() {
		if (this.oApplication) {
			this.oApplication.render(this);
		}
	},
	
	getCurrentApplication: function() {
		return this.oApplication;
	},
	
	
	isVisible: function() {
		return this.nRaise === 1;
	},	
	
	/**
	 * Hides the camera
	 * No effect if the phone is already hidden
	 * @param bInstantly boolean, if true : hides the camera immediatly, else hides the camera with animation
	 * @return boolean : true if hiding operation is successful, false otherwise
	 */
	hide: function(onHidden) {
		switch (this.getStatus()) {
			case 'visible':
				this.onHidden = onHidden;
				this.nState = 20;
				return true;
			
			case 'hiding':
				this.onHidden = onHidden;
				return true;
			
			case 'hidden':
				if (onHidden) {
					onHidden();
				}
				return true;
			
			default:
				return false;
		}
	},

	/**
	 * Returns the phone status
	 * regarding its visibility
	 */
	getStatus: function() {
		switch (this.nState) {
			case 10:
			case 11:
				return 'showing';
				
			case 20:
			case 21:
				return 'hiding';
				
			case 0:
				if (this.nRaise === 0) {
					return 'hidden';
				} else if (this.nRaise === 1) {
					return 'visible';
				}
			break;
		}
		return 'unknown';
	},

	
	/**
	 * Shows the camera with animation
	 */
	show: function() {
		if (this.nRaise === 1) {
			return;
		} else if (this.nState === 0) {
			this.nState = 10;
		}
	},
	
	process: function() {
		switch (this.nState) {
			case 10: // start raising
				this.oEasing.from(0.5).to(1).during(this.nMaxTimeIndex).use('cubeDeccel');
				this.nTimeIndex = 0;
				this.nState = 11;
			break;

			case 11: // raising
				this.oEasing.f(++this.nTimeIndex);
				if (this.nTimeIndex >= this.nMaxTimeIndex) {
					this.nState = 0;
				}
				this.nRaise = this.oEasing.x;
			break;

			case 21: // falling
				this.oEasing.f(++this.nTimeIndex);
				if (this.nTimeIndex >= this.nMaxTimeIndex) {
					this.setApplication(null);
					this.nState = 0;
				}
				this.nRaise = this.oEasing.x;
				if (this.nState === 0 && this.onHidden) {
					this.onHidden();
					this.onHidden = null;
				}
			break;

			case 20: // start failling
				this.oEasing.from(1).to(0).during(this.nMaxTimeIndex).use('cubeAccel');
				this.nTimeIndex = 0;
				this.nState = 21;
			break;
		}
	},
	
	done: function() {
	},
	
	isOver: function() {
		return this.bOver;
	},
		
	terminate: function() {
		this.bOver = true;
	},
		
	blur: function() {
		if (this.nRaise === 0) {
			return;
		}
		var blur = this.oBlurCvs;
		var bw = this.nBlurWidth;
		var bh = this.nBlurHeight;
		var rcc = this.oCanvas;
		var rccc = this.oContext;
		var bw3 = rcc.width;
		var bh3 = rcc.height;

		var bSmooth = O876.CanvasFactory.getImageSmoothing(rccc);
		O876.CanvasFactory.setImageSmoothing(rccc, true);
		
		var c = blur.getContext('2d');
		c.drawImage(rcc, 0, 0, bw3, bh3, 0, 0, bw, bh);
		var f = rccc.globalAlpha;
		rccc.globalAlpha = this.nRaise;
		rccc.drawImage(blur, 0, 0, bw, bh, 0, 0, bw3, bh3);
		rccc.globalAlpha = f;
		O876.CanvasFactory.setImageSmoothing(rccc, bSmooth);
	},
	
	/**
	 * This function is call each frame
	 */
	render: function() {
		if (this.nRaise === 0) { // no need to draw anything if not raised
			return;
		}
		var rcc = this.oCanvas;
		var rccc = this.oContext;
		this.renderApplication();	// renders the application screen
		this.blur();				// blurs the background image
		
		var p = this.oPhone.oImage;	
		var rw = rcc.width;			
		var rh = rcc.height;
		var pw = p.width;
		var ph = p.height;
		
		var xPhone = this.xPhone = (rw -pw) >> 1;
		var yPhone = this.yPhone = ((rh - ph) >> 1) + ((1 - this.nRaise) * rh);
		
		var oScreen = this.oScreen;
		var cw = oScreen.width;
		var ch = oScreen.height;
		var xim = xPhone + this.SCREEN_X;
		var yim = yPhone + this.SCREEN_Y;
		
		var f = rccc.globalAlpha;
		rccc.globalAlpha = this.nRaise;
		rccc.drawImage(p, xPhone, yPhone);
		rccc.drawImage(oScreen, xim, yim);
		rccc.globalAlpha = f;
	}
});

