O2.extendClass('MANSION.PhoneApp.Camera', MANSION.PhoneApp.Abstract, {

	sOrientation: 'land',
	name: 'Camera',
	
	nFlashDuration: 25,
	oEasing: null,
	bFlash: false,
	nFlash: 0,
	nEnergy: 0, // amount of energy
	nMaxEnergy: 100, // maximum amount of energy
	
	nCircleSize: 0,
	
	oParticles: null,
	
	aDisplayScore: null,
	nTextSize: 14,
	oScoreCanvas: null,
	nDisplayScoreTime: 60,
	
	
	__construct: function() {
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
			var sColor1, sColor2;
			var fEnergy = this.nEnergy / this.nMaxEnergy;
			var fEnergyAngle = PI * 2 * fEnergy;
			if (fEnergyAngle) {
				oScreenCtx.strokeStyle = 'rgba(64, 128, 255, ' + (fEnergy / 2) + ')';
				oScreenCtx.lineWidth = 5;
				oScreenCtx.beginPath();
				oScreenCtx.arc(cw >> 1, ch >> 1, cs, 0 - PI / 2, fEnergyAngle - PI / 2);
				oScreenCtx.stroke();
				oScreenCtx.strokeStyle = 'rgba(150, 200, 255, ' + (fEnergy / 2 + 0.5) + ')';
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
			if (this.oEasing.move(++this.nFlash)) {
				this.bFlash = false;
			} else {
				oScreenCtx.fillStyle = 'rgba(255, 255, 255, ' + this.oEasing.x + ')';
				oScreenCtx.fillRect(xNew, 0, wNew, ch);
			}
		}

		oScreenCtx.fillStyle = '#000';
		oScreenCtx.fillRect(0, 0, xNew, ch);
		oScreenCtx.fillRect(cw - xNew, 0, xNew, ch);
	},
	
	flash: function() {
		this.nFlash = 0;
		this.bFlash = true;
		this.oEasing.setFunction('cubeDeccel');
		this.oEasing.setMove(1, 0, 0, 0, this.nFlashDuration);
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
