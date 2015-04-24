O2.extendClass('MW.HUDSpellSelector', UI.HUDClient, {
	
	/**
	 * Le spell selector doit permettre de selectionner facilement et
	 * rapidement un sort dans une palette.
	 * La palette étant remplie de manière totalement aléatoire, le
	 * joueur ne peut pas se souvenir de l'ordre des sort et doit pouvoir voir
	 * l'ensemble de sort
	 */
	
	oImage: null,
	oText: null,
	aData: null,
	nIconSize: 32,
	aGiven: null,
	aCooldown: null,
	nDisplayed : -1,
	nMaxDisp: 7,
	sCooldownText: '',
	nLastDrawnIcon: 0,
	
	nLastActiveTime: 0, // last active time
	nCurrentTime: 0, // current game time
	
	draw: function() {
		if (this.oImage) {
			var c = this.oContext;
			var w = this.oCanvas.width;
			var h = this.oCanvas.height;
			c.drawImage(this.oImage, 0, 0, this.oImage.width, this.oImage.height, 0, 0, w, h);
		}
	},
	
	getItemName: function(n) {
		var d = this.aData[this.aGiven[n]];
		if (!d) {
			return null;
		}
		var nIcon = d[0];
		var sName = d[1];
		return [sName, nIcon];
	},
	
	
	update_declare: function(nId, nIcon, sResRef, sName) {
		if (this.aData === null) {
			this.aData = {};
		}
		if (this.aGiven === null) {
			this.aCooldown = [];
		}
		if (this.aCooldown === null) {
			this.aCooldown = [];
		}
		this.aData[sResRef] = [nIcon, sName];
	},
	
	
	update_cooldown: function(bForce) {
		// le cooldown
		var c = this.oContext;
		var nId = this.nDisplayed;
		if (nId < this.aCooldown.length) { // ya bien un cooldown pour l'objet en cours
			var nCD = this.aCooldown[nId]; 
			if (nCD >= this.nCurrentTime) { // coolingdown ?
				var sText;
				var nSec = 1 + (nCD - this.nCurrentTime) / 1000 | 0;
				if (nSec < 60) {
					sText = nSec.toString();
				} else {
					sText = (nSec / 60 | 0).toString() + 'm';
				}
				if (bForce || sText != this.sCooldownText) {
					this.sCooldownText = sText;
					c.fillStyle = '#FAA';
					c.strokeStyle = '#000';
					var x = 6, y = 48, w = 16, h = 12;
					c.fillRect(x, y, w, h);
					c.strokeRect(x, y, w, h);
					c.textBaseline = 'middle';
					c.font = '10px monospace';
					c.fillStyle = '#000';
					c.fillText(sText, x + ((w - c.measureText(sText).width) >> 1), y + (h >> 1) + 1);
					return true;
				}
			} else 	if (this.sCooldownText != '0') {
				// redessiner l'icone
				var nIS = this.nIconSize;
				var xf = this.nLastDrawnIcon * nIS;
				var h = this.oCanvas.height;
				c.drawImage(this.oImage, xf, 0, nIS, nIS, 0, h - nIS, nIS, nIS);
				this.sCooldownText = '0';
			}
		}
		return false;
	},
	
	
	update_display: function(nId) {
		var bFadeOut = false;
		var fAlpha = 0;
		if (nId === null) {
			if (this.nCurrentTime - this.nLastActiveTime > 1000) {
				this.update_cooldown();
				return;
			}
			nId = this.nDisplayed;
			// mais faire un fade out
			bFadeOut = true;
			var a1 = this.nCurrentTime - this.nLastActiveTime;
			fAlpha = (1000 - (a1 << 1) + 1000) / 1000;
			fAlpha = Math.max(0, Math.min(1, fAlpha));
		}
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		var nIS = this.nIconSize; 
		var nIS2 = nIS >> 1;
		var nIS22 = nIS2 + 2;
		
		c.clearRect(0, 0, w, h);
		
		if (!this.aGiven) {
			return;
		}

		// afficher dans le coin inferieur gauche l'icone
		nId = Math.max(0, Math.min(this.aGiven.length - 1, nId));
		if (!this.aData) {
			return;
		}
		var d = this.aData[this.aGiven[nId]];
		if (!d) {
			return;
		}
		var nIcon = d[0];
		var sName = d[1];
		var xf;
		var yBar = 10;
		var nOffset = 0;
		
		if (bFadeOut) {
			c.globalAlpha = fAlpha;
		}

		if (this.aGiven.length > this.nMaxDisp) {
			nOffset = Math.min(
					this.aGiven.length - this.nMaxDisp,
					Math.max(0, nId - (this.nMaxDisp >> 1))
			);
		}
		
		
		if (nId >= 0) {
			xf = nIS22 * (nId - nOffset) - 2;
			c.fillStyle = 'rgba(0, 0, 255, 0.666)';
			c.fillRect(xf, yBar - 2, nIS2 + 4, nIS2 + 4);
		}
		for (var iGiven = 0; iGiven < this.aGiven.length; ++iGiven) {
			xf = nIS * this.aData[this.aGiven[iGiven]][0];
			c.drawImage(this.oImage, xf, 0, nIS, nIS, (iGiven - nOffset) * nIS22, yBar, nIS2, nIS2);
		}
		if (bFadeOut) {
			c.globalAlpha = 1;
		}
		if (this.oText === null) {
			this.oText = new H5UI.Text();
			this.oText.setAutosize(false);
			this.oText.setWordWrap(true);
			this.oText.font.setFont('monospace');
			this.oText.font.setSize(10);
			this.oText.setSize(w - nIS - 4, nIS);
			this.oText.font._bOutline = true;
		}
		this.oText.setCaption(sName);
		this.oText.render();
		if (nId < 0) {
			return;
		}
		xf = nIS * nIcon;
		c.drawImage(this.oImage, xf, 0, nIS, nIS, 0, h - nIS, nIS, nIS);
		this.nLastDrawnIcon = nIcon;
		this.update_cooldown(true);
		
		c.drawImage(this.oText._oCanvas, nIS + 4, h - nIS);
		this.nDisplayed = nId;
	},
	
	update_display_next: function() {
		if (!this.aGiven) {
			return;
		}

		if (this.nDisplayed + 1 < this.aGiven.length) {
			this.update_display(this.nDisplayed + 1);
		} else {
			this.update_display(0);
		}
	},
	
	update_display_left: function() {
		this.update_display(this.nDisplayed - 1);
	},
	
	update_display_right: function() {
		this.update_display(this.nDisplayed + 1);
	},
	
	// commandes possibles
	// display int : affiche le spell spécifié
	// image obj : définition de l'image
	// declare int str : déclare le spell avec numéro d'indice et image
	update: function(sData, sCommand, nParam, nParam2) {
		if (sData) {
			var g = [];
			var oData = JSON.parse(sData);
			var aInv = oData.inv;
			var aNew = oData.newones;
			aInv.forEach(function(s) { 
				if (s) {
					g.push(s); // le resref de l'objet
				}
			});
			// GLOBALE G
			aNew.forEach(function(s) {
				G.popupMessage(STRINGS._('~item_pickup', [STRINGS._('~itm_' + s)]), MW.ICONS[s]);
			});
			this.aGiven = g;
			this.nLastActiveTime = this.nCurrentTime;
			this.update_display(this.nDisplayed);
			return;
		}
		switch (sCommand) {
			case 'next':
				this.nLastActiveTime = this.nCurrentTime;
				this.update_display_next();
				break;
				
			case 'left':
				this.nLastActiveTime = this.nCurrentTime;
				this.update_display_left();
				break;

			case 'right':
				this.nLastActiveTime = this.nCurrentTime;
				this.update_display_right();
				break;
				
			case 'time':
				this.nCurrentTime = nParam;
				this.update_display(null);
				break;
				
			case 'cooldown':
				this.aCooldown[nParam] = this.nCurrentTime + nParam2;
				break;
		}
	}
});
