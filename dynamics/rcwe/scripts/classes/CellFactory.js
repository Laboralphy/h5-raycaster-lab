/**
 * This Factory produces Image which are visual representation of blocks
 */
O2.extendClass('RCWE.CellFactory', RCWE.Factory, {
	/**
	 * This fonction creates a factory key, a string corresponding to the
	 * specified item properties. Only visual properties are revelant
	 * Blocks sharing the same visual properties share the same key.
	 * @param RCWE.Block oBlock 
	 * @return string
	 */
	_getItemKey: function(oBlock) {
		if (!oBlock) {
			return null;
		}
		var sData = 'type floor ceil left right doortype';
		var aData = sData.split(' ');
		var aKeys = aData.map(function(sKey) {
			return oBlock.getData(sKey);
		});
		return JSON.stringify(aKeys);
	},

	/**
	 * Render a block, using its visual properties.
	 * Returns the corresponding canvas.
	 * @param RCWE.Block oBlock 
	 * @return Canvas
	 */
	_draw: function(oCanvas, oBlock) {
		if (oBlock) {
			oBlock.renderFlat(oCanvas);
		} else {
			var oContext = oCanvas.getContext('2d');
			oContext.fillStyle = '#DDD';
			oContext.strokeStyle = '#666';
			oContext.fillRect(0, 0, oCanvas.width, oCanvas.height);
			oContext.strokeRect(0, 0, oCanvas.width, oCanvas.height);
		}
	}
});
