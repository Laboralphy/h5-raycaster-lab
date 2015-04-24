O2.extendClass('MW.HUDScores', UI.HUDElement, {
	
	nFontSize: 11,
	
	update: function(sScores) {
		var aScores = JSON.parse(sScores);
		var i;
		var c = this.oContext;
		c.clearRect(0, 0, this.oCanvas.width, this.oCanvas.height);
		c.font = 'bold ' + this.nFontSize + 'px courier';
		c.strokeStyle = '#000000';
		c.textBaseline = 'top';
		var sName;
		var sScore;
		var wScore;
		var iScore;
		c.fillStyle = '#FFFFFF';
		for (i = 0; i < aScores.length; ++i) {
			iScore = aScores[i];
			sName = iScore[0];
			sScore = iScore[1].toString();
			wScore = c.measureText(sScore).width;
			c.strokeText(sName, 0, i * (this.nFontSize + 1));
			c.fillText(sName, 0, i * (this.nFontSize + 1));
			c.strokeText(sScore, this.oCanvas.width - wScore, i * (this.nFontSize + 1));
			c.fillText(sScore, this.oCanvas.width - wScore, i * (this.nFontSize + 1));
		}
	}
});