O2.extendClass('UI.HUDClient', UI.HUDElement, {
	
	_sClass: '',
	
	sendData: function(action, data) {
		data.mod = this._sClass;
		data.action = action;
		this.oGame.csPluginMessage(data);
	}
});
