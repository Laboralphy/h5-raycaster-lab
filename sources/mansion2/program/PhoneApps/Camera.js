O2.extendClass('MANSION.PhoneApp.Camera', MANSION.PhoneApp.Abstract, {

	sOrientation: 'land',
	name: 'Camera',
	
	nFlashDuration: 25,
	nChargeDuration: 15,
	oEasing: null,
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
	nTextSize: 14,
	oScoreCanvas: null,
	nDisplayScoreTime: 60,
	
	oRainbow: null,
	
	
	__construct: function() {
		this.oRainbow = new O876.Rainbow();
		this.oEasing = new O876.Easing();
		this.oParticles = new MANSION.PhoneApps.Particles();
		this.oScoreCanvas = O876.CanvasFactory.getCanvas();
		this.oScoreCanvas.width = 160;
		this.oScoreCanvas.height = 160;
		var ctx = this.oScoreCanvas.getContext('2d');
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.strokeStyle = 'rgb(0, 0, 0)';
		ctx.font = 'bold ' + this.nTextSize.toString() + 'px courier';
		ctx.textBaseline = 'top';
		this.oCircleColor1 = {r: 64, g: 128, b: 255, a: 1};
		this.oCircleColor2 = {r: 150, g: 200, b: 255, a: 1};
	},
	
	update: function(oLogic) {
		if (oLogic.cameraFlashTriggered()) {
			this.flash();
			var lss = oLogic.getLastShotStats();
			var nDamage = lss.damage;
			if (nDamage > 0) {
				var aShotStr = ArrayTools.unique(lss.shots).map(function(s) {
					return STRINGS_DATA.SHOTS[s];
				});
				aShotStr.push(STRINGS_DATA.SHOTS.score + nDamage.toString());
				this.displayScore(aShotStr);
			}		
		}
		this.setEnergyGauges(oLogic.getCameraEnergy(), oLogic.getCameraMaxEnergy());
	},


	render: function(oPhone) {
		var oScreen = oPhone.oScreen;
		var oScreenCtx = oScreen.getContext('2d');
		var cw = oScreen.width;
		var ch = oScreen.height;
		
		// Photo
		var rcc = oPhone.oCanvas;
		var wNew = ch * rcc.width / rcc.height | 0;
		var xNew = (cw - wNew) >> 1;
		
		oScreenCtx.fillStyle = '#000';
		oScreenCtx.drawImage(rcc, 0, 0, rcc.width, rcc.height, xNew, 0, wNew, ch);

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
				c2.r = 150 + 64 * fSin | 0;
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
			if (this.oEasing.f(++this.nFlashTime)) {
				this.bFlash = false;
			} else {
				var sFGCO = this.sFlashGCO;
				var sGCO = '';
				if (sFGCO) {
					sGCO = oScreenCtx.globalCompositeOperation;
					oScreenCtx.globalCompositeOperation = sFGCO;
				}
				oScreenCtx.fillStyle = this.sFlashColor + this.oEasing.x + ')';
				oScreenCtx.fillRect(xNew, 0, wNew, ch);
				if (sGCO) {
					oScreenCtx.globalCompositeOperation = sGCO;
				}
			}
		}

		oScreenCtx.fillStyle = '#000';
		oScreenCtx.fillRect(0, 0, xNew, ch);
		oScreenCtx.fillRect(cw - xNew, 0, xNew, ch);
	},
	
	flash: function() {
		this.nFlashTime = 0;
		this.sFlashColor = 'rgba(255, 255, 255, ';
		this.bFlash = true;
		this.sFlashGCO = '';
		this.oEasing.from(1).to(0).during(this.nFlashDuration).use('cubeDeccel');
	},	
	
	/**
	 * Sends visual feedback when camera is chargin
	 */
	charge: function() {
		this.nFlashTime = 0;
		this.sFlashColor = 'rgba(0, 64, 128, ';
		this.sFlashGCO = 'lighter';
		this.bFlash = true;
		this.oEasing.from(0).to(0.75).during(this.nChargeDuration).use('cubeInOut');
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

});
