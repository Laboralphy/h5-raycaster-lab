O2.extendClass('RCWE.StartPointLocator', RCWE.Window, {

	_id: 'startpointlocator',
	
	build: function() {
		__inherited('Start point locator');
		this.getContainer().addClass('StartPointLocator');
		this.getBody().append('<p>Click anywhere on the level grid to place the starting point. Click on the buttons above to turn the starting point angle.</p>');
		this.addCommand('↶', 'Turn the starting point angle counter clockwise', this.cmd_turnccw.bind(this));
		this.addCommand('↷', 'Turn the starting point angle clockwise', this.cmd_turncw.bind(this));
	},

	cmd_turncw: function() {
		this.doAction('turncw');
	},

	cmd_turnccw: function() {
		this.doAction('turnccw');
	}
});
