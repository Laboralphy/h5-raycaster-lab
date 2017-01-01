O2.extendClass('MW.DialogPlugin', MW.Plugin, {
	getName: function() {
		return 'dialog';
	},
	
	init: function() {
		this.register('ui_dialog');
	},

	ui_dialog: function(sTitle, sMessage, oCmds) {
		var w = new UI.DialogWindow({
			title: sTitle, 
			message: sMessage, 
			buttons: oCmds
		});
		this.oGame.sendSignal('ui_open', w);
	},
});
