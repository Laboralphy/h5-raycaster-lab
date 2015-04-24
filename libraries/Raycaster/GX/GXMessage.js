/**
 * Effet graphique temporisé O876 Raycaster project
 * 
 * @date 2012-01-01
 * @author Raphaël Marandet
 * 
 * Affichage d'un message au centre de l'écran - sMessage : Texte à afficher -
 * oColor : couleur {r b g a} du fadeout - fAlpha : opacité de départ - fAlpha :
 * Incrément/Décrément d'opacité
 */
O2.extendClass('O876_Raycaster.GXMessage', O876_Raycaster.GXEffect, {
	sClass: 'Message',
	oCanvas : null,
	oContext : null,
	nTime : 0,
	sMessage : '',
	oMessageCanvas : null,
	xPos : 0,
	yPos : 0,
	xTo : 0,
	yTo : 0,
	yOfs : 48,
	nState : 0,
	fAlpha : 1,
	aPath : null,
	iPath : 0,
	sTextAlign: 'left',
	xTextPos: 0,
	yTextPos: 0,
	nTextHeight: 13,
	fTimePerChar: 150,
	wSize: 512,
	hSize: 40,
	sFontFamily: 'monospace',
	
	// styles
	oStyle: {
		background: 'rgb(255, 255, 255)',
		border: 'rgb(64, 64, 64)',
		text: 'rgb(220, 220, 220)',
		shadow: 'rgb(0, 0, 0)',
		width: 512,
		height: 40,
		font: 'monospace 13',
		speed: 100,
		position: 48
	},
	
	
	oIcon: null,
	

	__construct : function(oRaycaster) {
		__inherited(oRaycaster);
		var s = this.oStyle;
		this.wSize = s.width;
		this.hSize = s.height;
		this.fTimePerChar = s.speed;
		this.yOfs = s.position;
		s.font.toString().split(' ').forEach((function(sFontProp) {
			if (sFontProp | 0) {
				this.nTextHeight = sFontProp | 0;
			} else {
				this.sFontFamily = sFontProp;
			}
		}).bind(this));
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d');
		this.oMessageCanvas = O876.CanvasFactory.getCanvas();
		this.oMessageCanvas.width = this.wSize; 
		this.oMessageCanvas.height = this.hSize;
		this.xPos = this.xTo = (this.oCanvas.width - this.oMessageCanvas.width) >> 1;
		this.yPos = 0;
		this.yTo = 16;
		this.xAcc = 0;
		this.yAcc = -2;
		this.buildPath();
		if (this.sTextAlign == 'center') {
			this.xTextPos = this.oMessageCanvas.width >> 1; 
		} else {
			this.xTextPos = this.oMessageCanvas.height >> 1; 
		}
		this.yTextPos = (this.nTextHeight >> 1) + (this.oMessageCanvas.height >> 1);
	},
	
	drawIcon: function(oSource, x, y, w, h) {
		var nOffset = (this.oMessageCanvas.height - 32) >> 1;
		this.oMessageCanvas.getContext('2d').drawImage(oSource, x, y, w, h, nOffset, nOffset, 32, 32);
		this.xTextPos += 32;
		this.oIcon = null;
	},
	
	setIcon: function(oSource, x, y, w, h) {
		this.oIcon = {
			src: oSource,
			x: x,
			y: y,
			w: w,
			h: h
		};
	},
	
	setMessage: function(sMessage) {
		this.sMessage = sMessage;
		this.nTime = sMessage.length * this.fTimePerChar / this.oRaycaster.TIME_FACTOR | 0;
	},
	
	getTime: function() {
		return this.nTime;
	},

	isOver : function() {
		return this.nState >= 4;
	},

	buildPath : function() {
		this.aPath = [];
		var nWeightPos = 1;
		var nWeightTo = 1;
		var nSum = nWeightPos + nWeightTo;
		var bMove;
		var xPos = this.xPos;
		var yPos = this.yPos;
		do {
			bMove = false;
			if (xPos != this.xTo) {
				if (Math.abs(xPos - this.xTo) < 1) {
					xPos = this.xTo;
				} else {
					xPos = (xPos * nWeightPos + this.xTo * nWeightTo) / nSum;
				}
				bMove = true;
			}
			if (yPos != this.yTo) {
				if (Math.abs(yPos - this.yTo) < 1) {
					yPos = this.yTo;
				} else {
					yPos = (yPos * nWeightPos + this.yTo * nWeightTo) / nSum;
				}
				bMove = true;
			}
			if (bMove) {
				this.aPath.push( [ xPos | 0, yPos + this.yOfs | 0, 1 ]);
			}
		} while (bMove && this.aPath.length < 20);
		for (var i = this.aPath.length - 2; i >= 0; i--) {
			this.aPath[i][2] = Math.max(0, this.aPath[i + 1][2] - 0.2); 
		}
	},

	movePopup : function() {
		if (this.iPath < this.aPath.length) {
			var aPos = this.aPath[this.iPath];
			this.xPos = aPos[0];
			this.yPos = aPos[1];
			this.fAlpha = aPos[2];
			this.iPath++;
		}
	},

	reverseMovePopup : function() {
		if (this.aPath.length) {
			var aPos = this.aPath.pop();
			this.xPos = aPos[0];
			this.yPos = aPos[1];
			this.fAlpha = aPos[2];
		}
	},

	// Début : création du message dans un canvas
	process : function() {
		switch (this.nState) {
		case 0:
			var sMessage = this.sMessage;
			var oCtx = this.oMessageCanvas.getContext('2d');
			oCtx.font = this.nTextHeight.toString() + 'px ' + this.sFontFamily;
			oCtx.textAlign = this.sTextAlign;
			oCtx.fillStyle = this.oStyle.background;
			oCtx.strokeStyle = this.oStyle.border;
			oCtx.fillRect(0, 0, this.oMessageCanvas.width, this.oMessageCanvas.height);
			oCtx.strokeRect(0, 0, this.oMessageCanvas.width, this.oMessageCanvas.height);
			if (this.oIcon) {
				this.drawIcon(this.oIcon.src, this.oIcon.x, this.oIcon.y, this.oIcon.w, this.oIcon.h);
			}
			var nTextWidth = oCtx.measureText(sMessage).width;
			if ((nTextWidth + this.xTextPos + 2) < this.wSize) {
				oCtx.fillStyle = this.oStyle.text;
				oCtx.fillText(sMessage, this.xTextPos + 2, this.yTextPos + 2);
				oCtx.fillStyle = this.oStyle.shadow;
				oCtx.fillText(sMessage, this.xTextPos, this.yTextPos);
			} else {
				// faut mettre sur deux lignes (mais pas plus)
				var sMessage2 = '';
				var aWords = sMessage.split(' ');
				while (aWords.length > 0 && (oCtx.measureText(sMessage2 + aWords[0]).width + this.xTextPos + 8) < this.wSize) {
					sMessage2 += aWords.shift();
					sMessage2 += ' ';
				}
				sMessage = aWords.join(' ');
				oCtx.fillStyle = this.oStyle.text;
				var yLine = (this.nTextHeight >> 1) + 2;
				oCtx.fillText(sMessage2, this.xTextPos + 2, this.yTextPos + 2 - yLine);
				oCtx.fillText(sMessage, this.xTextPos + 2, this.yTextPos + 2 + yLine);
				oCtx.fillStyle = this.oStyle.shadow;
				oCtx.fillText(sMessage2, this.xTextPos, this.yTextPos - yLine);
				oCtx.fillText(sMessage, this.xTextPos, this.yTextPos + yLine);
			}
			this.nState++;
			this.fAlpha = 0;
			break;

		case 1:
			this.movePopup();
			this.nTime--;
			if (this.nTime <= 0) {
				this.yTo = -this.oMessageCanvas.height;
				this.nState++;
			}
			break;

		case 2:
			if (this.aPath.length === 0) {
				this.nState++;
			}
			this.reverseMovePopup();
			break;

		case 3:
			this.oMessageCanvas = null;
			this.terminate();
			break;
		}
	},

	render : function() {
		if (this.fAlpha > 0) {
			var a = this.oContext.globalAlpha;
			this.oContext.globalAlpha = this.fAlpha;
			this.oContext.drawImage(this.oMessageCanvas,
					this.xPos | 0, this.yPos | 0);
			this.oContext.globalAlpha = a;
		}
	},

	terminate : function() {
		this.nState = 4;
	}
});
