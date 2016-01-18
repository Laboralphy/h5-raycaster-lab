// GX Phone
// Effets visuels associés au smartphone
// Orientation landscape

O2.extendClass('MANSION.GX.PhonePort', O876_Raycaster.GXEffect, {
	sClass: 'PhonePort',
	oCanvas: null,
	oContext: null,
	bOver: false,
	oEasing: null,
	
	oBlurLeft: null,
	nBlurHeight: 8, // hauteur de la frange horiz en pixels
	nBlurWidth: 8, // hauteur de la frange horiz en pixels
	oPhone: null,
	oCopy: null,
	oCopyContext: null,

	nRaise: 1,
	nTimeIndex: 0,
	nMaxTimeIndex: 10,
	nState: 0, // 0: normal, 10, start raising, 11: raising, 20: start falling, 21, falling

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		
		var c = oRaycaster.oCanvas;
		var ctx = c.getContext('2d'); 
		this.oCanvas = c;
		this.oContext = ctx;
		this.oEasing = new O876.Easing();
		this.oEasing.setFunction('smoothstep');
		
		// copy
		this.oCopy = O876.CanvasFactory.getCanvas();
		this.oCopy.width = c.width * 0.75 | 0;
		this.oCopy.height = c.height * 0.75 | 0;
		this.oCopyContext = this.oCopy.getContext('2d');
		O876.CanvasFactory.setImageSmoothing(this.oCopyContext, true);
		
		// phone
		this.oPhone = oRaycaster.getTile('l_smart1');
		this.nBlurWidth = (this.oCanvas.width >> 3) + 1;
		this.nBlurHeight = (this.oCanvas.height >> 3) + 1;
		
		this.oBlurLeft = O876.CanvasFactory.getCanvas();
		this.oBlurLeft.width = this.nBlurWidth;
		this.oBlurLeft.height = this.nBlurHeight;
		O876.CanvasFactory.setImageSmoothing(this.oBlurLeft.getContext('2d'), true);
	},
	
	
	blur: function() {
		var bl = this.oBlurLeft;
		var bw = this.nBlurWidth;
		var bh = this.nBlurHeight;
		var bw3 = bw << 3;
		var bh3 = bh << 3;
		var rcc = this.oCanvas;
		var rccc = this.oContext;

		var bSmooth = O876.CanvasFactory.getImageSmoothing(rccc);
		O876.CanvasFactory.setImageSmoothing(rccc, true);
		
		var c = bl.getContext('2d');
		c.drawImage(rcc, 0, 0, bw3, bh3, 0, 0, bw, bh);
		var f = rccc.globalAlpha;
		rccc.globalAlpha = this.nRaise;
		rccc.drawImage(bl, 0, 0, bw, bh, 0, 0, bw3, bh3);
		rccc.globalAlpha = f;
		O876.CanvasFactory.setImageSmoothing(rccc, bSmooth);
	},
	
	
	drawPhone: function() {
		if (this.nRaise === 0) {
			return;
		}
		this.blur();
		
		var rcc = this.oCanvas;
		var rccc = this.oContext;
		var p = this.oPhone.oImage;
		var rw = this.oCanvas.width;
		var rh = this.oCanvas.height;
		var pw = p.width;
		var ph = p.height;
		
		var xPhone = (rw -pw) >> 1;
		var yPhone = ((rh - ph) >> 1) + ((1 - this.nRaise) * rh);
		var f = rccc.globalAlpha;
		rccc.globalAlpha = this.nRaise;
		rccc.drawImage(p, 0, 0, pw, ph, xPhone, yPhone, pw, ph);
		rccc.globalAlpha = f;
	},
	
	process: function() {
		switch (this.nState) {
			case 10: // start raising
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
	}	
});
