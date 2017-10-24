// GX Phone Abstract
// Effets visuels associés au smartphone
// Classe abstraite

O2.extendClass('MANSION.GX.CameraObscura', O876_Raycaster.GXEffect, {
	sClass: 'CameraObscura',
	sTile: 'l_visor',
	oCanvas: null,
	oContext: null,
	bOver: false,
	oEasing: null,
	
	oBlurCvs: null,
	nBlurHeight: 8, // hauteur de la frange horiz en pixels
	nBlurWidth: 8, // hauteur de la frange horiz en pixels
	oVisor: null,
	oScreen: null,
	oScreenContext: null,

	nRaise: 0,
	nTimeIndex: 0,
	nMaxTimeIndex: 10,
	nState: 0, // 0: normal, 10, start raising, 11: raising, 20: start falling, 21, falling
	
	onHidden: null,
	
	SCREEN_W: 195, // screen width
	SCREEN_H: 204, // screen height
	SCREEN_X: 102, // screen position relative to the start of the image skin
	SCREEN_Y: 26,

	xPhone: -1,
	yPhone: -1,
	
	nFlashDuration: 25,
	nChargeDuration: 15,
	oEasingHUD: null,
	bFlash: false,
	sFlashColor: '',
	sFlashGCO: '',
	nFlashTime: 0,
	nPulseTime: 0,
	nEnergy: 0, // amount of energy
	nMaxEnergy: 100, // maximum amount of energy
	
	nCircleSize: 0,
	oCircleColor1: null,
	oCircleColor2: null,
	
	oParticles: null,
	
	aDisplayScore: null,
	nTextSize: 12,
	oScoreCanvas: null,
	nDisplayScoreTime: 60,
	
	oRainbow: null,

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		
		var c = oRaycaster.getRenderCanvas();
		var ctx = c.getContext('2d'); 
		this.oCanvas = c;
		this.oContext = ctx;
		this.oEasing = new O876.Easing();
		
		// phone
		this.oVisor = oRaycaster.getTile(this.sTile);
		this.nBlurHeight = (this.oCanvas.height >> 3);
		this.nBlurWidth = (this.oCanvas.width >> 3);
		
		this.oBlurCvs = O876.CanvasFactory.getCanvas();
		this.oBlurCvs.width = this.nBlurWidth;
		this.oBlurCvs.height = this.nBlurHeight;
		O876.CanvasFactory.setImageSmoothing(this.oBlurCvs.getContext('2d'), true);

		// phone screen
		this.oScreen = O876.CanvasFactory.getCanvas();
		this.oScreen.width = this.SCREEN_W;
		this.oScreen.height = this.SCREEN_H;
		this.oScreenContext = this.oScreen.getContext('2d');
		O876.CanvasFactory.setImageSmoothing(this.oScreenContext, true);
		
		this.oEasingHUD = new O876.Easing();

		this.oScoreCanvas = O876.CanvasFactory.getCanvas();
		this.oScoreCanvas.width = 320;
		this.oScoreCanvas.height = 160;
		ctx = this.oScoreCanvas.getContext('2d');
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.strokeStyle = 'rgb(0, 0, 0)';
		ctx.font = 'bold ' + this.nTextSize.toString() + 'px courier';
		ctx.textBaseline = 'top';
		this.oCircleColor1 = {r: 64, g: 128, b: 255, a: 1};
		this.oCircleColor2 = {r: 150, g: 200, b: 255, a: 1};
		this.oRainbow = new O876.Rainbow();
	},

	update: function(oLogic) {
		if (oLogic.cameraFlashTriggered()) {
			this.flash();
			var lss = oLogic.getLastShotStats();
			var nScore = lss.score;
			if (nScore > 0) {
				var aShotStr = ArrayTools.unique(lss.shots).map(function(s) {
					return MANSION.STRINGS_DATA.SHOTS[s];
				});
				if (lss.subjects && Array.isArray(lss.subjects)) {
					lss.subjects.forEach(function(s) {
						aShotStr.unshift(MANSION.STRINGS_DATA.SUBJECTS[s].title);
					});
				}
				aShotStr.push(MANSION.STRINGS_DATA.SHOTS.score + nScore.toString());
				this.displayScore(aShotStr);
			}		
		}
		this.setEnergyGauges(oLogic.getCameraEnergy(), oLogic.getCameraMaxEnergy());
	},

	
	renderScreen: function() {
		var c = this.oCanvas;
		var s = this.oScreen;
		this.oScreenContext.drawImage(
			c, 
			(c.width - this.SCREEN_W) >> 1, 
			(c.height - this.SCREEN_H) >> 1, 
			this.SCREEN_W, 
			this.SCREEN_H,
			(s.width - this.SCREEN_W) >> 1, 
			(s.height - this.SCREEN_H) >> 1, 
			this.SCREEN_W, 
			this.SCREEN_H
		);
		this.renderHUD();
	},
	
	renderHUD: function() {
		var oScreen = this.oScreen;
		var oScreenCtx = this.oScreenContext;
		var cw = oScreen.width;
		var ch = oScreen.height;
		
		// Photo
		var rcc = this.oCanvas;
		var wNew = ch * rcc.width / rcc.height | 0;
		var xNew = (cw - wNew) >> 1;
		
//		oScreenCtx.fillStyle = '#000';
//		oScreenCtx.drawImage(rcc, 0, 0, rcc.width, rcc.height, xNew, 0, wNew, ch);

		// HUD
		var cs = this.nCircleSize;
		if (cs) {
			var fEnergy = this.nEnergy / this.nMaxEnergy;
			var fEnergyAngle = PI * 2 * fEnergy;
			if (fEnergyAngle) {
				var fSin = 0;
				var c1 = this.oCircleColor1;
				var c2 = this.oCircleColor2;
				if (fEnergy === 1) {
					++this.nPulseTime;
					var fSin = Math.sin(this.nPulseTime);
				}					
				c1.r = 60 + 64 * fSin | 0;
				c1.g = 60 + 32 * fSin | 0;
				c1.a = fEnergy / 2;
				c2.r = 150 + 32 * fSin | 0;
				c2.g = 150 + 64 * fSin | 0;
				c2.a = fEnergy / 2 + 0.5;
				oScreenCtx.strokeStyle = this.oRainbow.rgba(c1);
				oScreenCtx.lineWidth = 5;
				oScreenCtx.beginPath();
				oScreenCtx.arc(cw >> 1, ch >> 1, cs, 0 - PI / 2, fEnergyAngle - PI / 2);
				oScreenCtx.stroke();
				oScreenCtx.strokeStyle = this.oRainbow.rgba(c2);
				oScreenCtx.lineWidth = 1;
				oScreenCtx.beginPath();
				oScreenCtx.arc(cw >> 1, ch >> 1, cs, 0 - PI / 2, fEnergyAngle - PI / 2);
				oScreenCtx.stroke();
			}
			oScreenCtx.strokeStyle = 'rgba(192, 192, 192, 0.333)';
			oScreenCtx.lineWidth = 1;
			oScreenCtx.beginPath();
			oScreenCtx.arc(cw >> 1, ch >> 1, cs, fEnergyAngle - PI / 2, 2 * PI - PI / 2);
			oScreenCtx.stroke();
		}
		
		// particles
		// particles are attracted to the left bottom corner of the screen
		// this.oParticles.render(oPhone);
		
		// scores
		if (this.aDisplayScore) {
			var fAlpha = this.nDisplayScoreTime / 10;
			if (fAlpha < 1) {
				var fSaveAlpha = oScreenCtx.globalAlpha;
				oScreenCtx.globalAlpha = fAlpha;
				oScreenCtx.drawImage(this.oScoreCanvas, -64 * (1 - fAlpha) * (1 - fAlpha), 0);
				oScreenCtx.globalAlpha = fSaveAlpha;
			} else {
				oScreenCtx.drawImage(this.oScoreCanvas, 0, 0);
			}
			if (--this.nDisplayScoreTime <= 0) {
				this.aDisplayScore = null;
			}			
		}		
		
		// flash
		if (this.bFlash) {
			if (this.oEasingHUD.next(++this.nFlashTime).over()) {
				this.bFlash = false;
			} else {
				var sFGCO = this.sFlashGCO;
				var sGCO = '';
				if (sFGCO) {
					sGCO = oScreenCtx.globalCompositeOperation;
					oScreenCtx.globalCompositeOperation = sFGCO;
				}
				oScreenCtx.fillStyle = this.sFlashColor + this.oEasingHUD.val() + ')';
				oScreenCtx.fillRect(xNew, 0, wNew, ch);
				if (sGCO) {
					oScreenCtx.globalCompositeOperation = sGCO;
				}
			}
		}
/*
		oScreenCtx.fillStyle = '#000';
		oScreenCtx.fillRect(0, 0, xNew, ch);
		oScreenCtx.fillRect(cw - xNew, 0, xNew, ch);*/
	},
	
	flash: function() {
		this.nFlashTime = 0;
		this.sFlashColor = 'rgba(255, 255, 255, ';
		this.bFlash = true;
		this.sFlashGCO = '';
		this.oEasingHUD.from(1).to(0).during(this.nFlashDuration).use('cubeDeccel');
	},	
	
	/**
	 * Sends visual feedback when camera is chargin
	 */
	charge: function() {
		this.nFlashTime = 0;
		this.sFlashColor = 'rgba(0, 64, 128, ';
		this.sFlashGCO = 'lighter';
		this.bFlash = true;
		this.oEasingHUD.from(0).to(0.75).during(this.nChargeDuration).use('cubeInOut');
	},
	
	setEnergyGauges: function(nVal, nMax) {
		this.nEnergy = nVal;
		this.nMaxEnergy = nMax;
	},
	
	displayScore: function(aScore) {
		var c = this.oScoreCanvas;
		var ctx = c.getContext('2d');
		this.aDisplayScore = aScore;
		ctx.clearRect(0, 0, c.width, c.height);
		var ts = this.nTextSize;
		aScore.forEach(function(sLine, i) {
			ctx.strokeText(sLine, 16, 4 + i * ts);
			ctx.fillText(sLine, 16, 4 + i * ts);
		});
		this.nDisplayScoreTime = 60;
	},
	

	
	
	isVisible: function() {
		return this.nRaise === 1;
	},	
	
	isHidden: function() {
		return this.nRaise === 0;
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
	 * returns true if the camera is on
	 * @return boolean
	 */
	isRaised: function() {
		return this.getStatus() === 'visible';
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
				this.oEasing.next(++this.nTimeIndex);
				if (this.nTimeIndex >= this.nMaxTimeIndex) {
					this.nState = 0;
				}
				this.nRaise = this.oEasing.val();
			break;

			case 21: // falling
				this.oEasing.next(++this.nTimeIndex);
				if (this.nTimeIndex >= this.nMaxTimeIndex) {
					this.nState = 0;
				}
				this.nRaise = this.oEasing.val();
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
		this.renderScreen();	// renders the application screen
		this.blur();				// blurs the background image
		
		var p = this.oVisor.oImage;	
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
		rccc.drawImage(oScreen, xim, yim);
		rccc.drawImage(p, xPhone, yPhone);
		rccc.globalAlpha = f;
	}
});

O2.mixin(MANSION.GX.CameraObscura, O876.Mixin.Events);
