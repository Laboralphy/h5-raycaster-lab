/**
 * This Factory produces Image which are visual representation of tags
 */
O2.extendClass('RCWE.TagFactory', RCWE.Factory, {

	/**
	 * The factory key is the tag itself
	 * @param string tag
	 * @return string
	 */
	_getItemKey: function(sTag) {
		return sTag;
	},

	/**
	 * Render a tag
	 * @param string tag
	 */
	_draw: function(oCanvas, sTag) {
		if (sTag) {
			var oContext = oCanvas.getContext('2d');
			oContext.fillStyle = '#FFFF00';
			oContext.strokeStyle = '#000000';
			oContext.font = 'monospace 8px';
			var aTag = sTag.split(' ');
			oContext.strokeText(aTag[0], 0, 10);
			oContext.fillText(aTag[0], 0, 10);
			var sTagLine = aTag.slice(1);
			oContext.strokeText(sTagLine, 0, 22);
			oContext.fillText(sTagLine, 0, 22);
		}
	}
});
