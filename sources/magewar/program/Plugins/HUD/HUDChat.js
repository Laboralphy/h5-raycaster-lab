O2.extendClass('MW.HUDChat', UI.HUDElement, {
	
	nFontSize: 10,
	oText: null,
	aMessages: null,
	nMaxHeight: 512,
	nLastTimestamp: 0,
	nMessageCount: 12,
	

	autoFadeout: function(nTime) {
		var nChatTime;
		if (MW.Microsyte.bOpen) {
			nChatTime = 0;
		} else {
			nChatTime = nTime - this.nLastTimestamp;
		}
		if (nChatTime < 10000) {
			this.fAlpha = 1;
		} else if (nChatTime < 10500) {
			this.fAlpha = 1 - ((nChatTime - 10000) / 500);
		} else {
			this.fAlpha = 0;
		}
	},
	
	setSize: function(w, h) {
		__inherited(w, h);
		this.nMessageCount = (this.oCanvas.height / 10 | 0) - 1;
		this.aMessages = [];
		for (i = 0; i < this.nMessageCount; ++i) {
			this.aMessages.push('');
		}
	},
	
	
	update: function(sMessage, nTimeMs) {
		var c = this.oContext;
		if (sMessage === null) {
			this.autoFadeout(nTimeMs);
			return;
		} else {
			this.nLastTimestamp = nTimeMs;
		}
		// calculate max number of messages in the window
		if (this.aMessages === null) {
			c.font = '10px monospace';
			this.nMessageCount = (this.oCanvas.height / 10 | 0) - 1;
			this.aMessages = [];
			for (i = 0; i < this.nMessageCount; ++i) {
				this.aMessages.push('');
			}
		}
		// pushing the message and shift the oldest one
		this.aMessages.push(sMessage);
		this.aMessages.shift();
		this.redraw();
	},
	
	redraw: function() {
		var i;
		var c = this.oContext;
		if (this.oText === null) {
			this.oText = new H5UI.Text();
			this.oText.setAutosize(false);
			this.oText.setWordWrap(true);
		}
		this.oText.setSize(this.oCanvas.width, this.nMaxHeight);
		var nLen = this.aMessages.length;
		var y = this.oCanvas.height - 4;
		c.clearRect(0, 0, this.oCanvas.width, this.oCanvas.height);
		c.fillStyle = 'rgba(0, 0, 0, 0.25)';
		c.strokeStyle = 'rgba(0, 0, 0, 0.5)';
		c.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height);
		c.strokeRect(0, 0, this.oCanvas.width, this.oCanvas.height);
		for (i = 0; i < this.nMessageCount; ++i) {
			this.oText.setCaption(this.aMessages[nLen - i - 1]);
			this.oText.render();
			y -= this.oText._yLastWritten;
			c.drawImage(this.oText._oCanvas, 0, y);
		}
	}
});
