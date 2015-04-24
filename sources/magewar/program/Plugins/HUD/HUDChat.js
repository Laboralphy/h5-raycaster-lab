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
	
	update: function(sMessage, nTimeMs) {
		var i;
		var c = this.oContext;
		if (sMessage === null) {
			this.autoFadeout(nTimeMs);
			return;
		} else {
			this.nLastTimestamp = nTimeMs;
		}
		if (this.aMessages === null) {
			c.font = '10px monospace';
			this.nMessageCount = (this.oCanvas.height / 10 | 0) - 1;
			this.aMessages = [];
			for (i = 0; i < this.nMessageCount; ++i) {
				this.aMessages.push('');
			}
		}
		this.aMessages.push(sMessage);
		this.aMessages.shift();
		if (this.oText === null) {
			this.oText = new H5UI.Text();
			this.oText.setSize(this.oCanvas.width, this.nMaxHeight);
			this.oText.setAutosize(false);
			this.oText.setWordWrap(true);
		}
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
