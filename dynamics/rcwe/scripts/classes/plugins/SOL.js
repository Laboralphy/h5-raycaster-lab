// save online level
O2.extendClass('RCWE.Plugin.SOL', O876.Mediator.Plugin, {
	
	oAdvPadBody: null,
	oAdvPadToolbar: null,
	oForm: null,

	description: 'This plugin will save your level on the server instead of your localstorage. The server may not accept your level though because it is an experimental feature that should be improved in order to work efficiently in a multi user context.',
	
	getName: function() {
		return 'SOL';
	},
	
	init: function() {
		this.register('saveLevel');
	},
	
	saveLevel: function(oApplication, sName, oXchange) {
		oApplication.exportLevelTemplate(sName);
		oXchange.cancel = true;
	}
});
