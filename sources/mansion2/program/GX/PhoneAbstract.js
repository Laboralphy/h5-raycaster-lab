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
	aApplications: null,
	sActiveApp: '',

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
	},
	
	openApplication: function(sApplication) {
		if (this.sActiveApp === sApplication) {
			return this.oApplication;
		}
		if (sApplication in this.aApplications) {
			return this.oApplication = this.aApplications[sApplication];
		} else if (sApplication in MANSION.PhoneApp) {
			var A = MANSION.PhoneApp[sApplication];
			return this.oApplication = this.aApplications[sApplication] = new A();
		} else {
			return null;
		}
	},
	
	runApplication: function() {
		if (this.oApplication) {
			this.oApplication.render(this);
		}
	},
	
	/**
	 * Hides the camera
	 * No effect if the phone is already hidden
	 * @param bInstantly boolean, if true : hides the camera immediatly, else hides the camera with animation
	 */
	hide: function(bInstantly) {
		if (this.nRaise === 0) {
			return;
		}
		if (bInstantly) {
			this.nState = 0;
			this.nRaise = 0;
		} else if (this.nState === 0) {
			this.nState = 20;
		}
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
				this.oEasing.setFunction('cubeDeccel');
				this.oEasing.setMove(0.5, 0, 1, 0, this.nMaxTimeIndex);
				this.nTimeIndex = 0;
				this.nState = 11;
			break;
			
			case 11: // raising
			case 21: // falling
				this.oEasing.move(++this.nTimeIndex);
				if (this.nTimeIndex >= this.nMaxTimeIndex) {
					this.nState = 0;
				}
				this.nRaise = this.oEasing.x;
			break;

			case 20: // start failling
				this.oEasing.setFunction('cubeAccel');
				this.oEasing.setMove(1, 0.5, 0, 0, this.nMaxTimeIndex);
				this.nTimeIndex = 0;
				this.nState = 21;
			break;
		}
		this.drawPhone();
	},
	
	render: function() {
		this.drawPhone();
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
	
	control: function() {
		if (this.oApplication) {
			this.oApplication.control.apply(this.oApplication, arguments);
		}
	},
	
	drawPhone: null
});

