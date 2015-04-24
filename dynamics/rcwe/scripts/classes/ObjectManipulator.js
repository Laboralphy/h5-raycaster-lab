O2.extendClass('RCWE.ObjectManipulator', RCWE.Window, {
	
	onCommand: null,
	
	build: function() {
		__inherited('Manipulator');
		this.addCommand('✖', 'clear selected objects', this.cmd.bind(this)).data('command', 'clear');
		// ↤↥↦↧
		this.addCommand('↥', 'move selected objects up', this.cmd.bind(this)).data('command', 'moveup');
		this.addCommand('↧', 'move selected objects down', this.cmd.bind(this)).data('command', 'movedown');
		this.addCommand('↤', 'move selected objects left', this.cmd.bind(this)).data('command', 'moveleft');
		this.addCommand('↦', 'move selected objects right', this.cmd.bind(this)).data('command', 'moveright');
		
	},
	
	cmd: function(oEvent) {
		this.onCommand($(oEvent.target).data('command'));
	}
});
