O2.extendClass('RCWE.Document', RCWE.Window, {
	build: function() {
		__inherited('');
		var c = this.getContainer();
		c.addClass('document');
		this.getToolBar().remove();
		this._oToolBar = null;
	},
	
	setContent: function(sTitle, sData) {
		var c = this.getContainer();
		c.html('<h1>' + sTitle + '</h1>' + sData);
	},
	
	load: function(sFile) {
		var c = this.getContainer();
		return $.get(sFile, function(sData) {
			c.html(sData);
		});
	}
});