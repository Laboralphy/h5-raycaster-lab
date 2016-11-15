/* globals O2, H5UI */

O2.extendClass('H5UI.ScrollBoxContainer', H5UI.WinControl, {
	_sClass : 'ScrollBoxContainer',
	
	renderSelf : function() {
		this._oContext.clearRect(0, 0, this.getWidth(), this.getHeight());
	}
});
