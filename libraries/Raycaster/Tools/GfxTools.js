/** GfxTools Boîte à outil graphique
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */

O2.createObject('GfxTools', {
	/**
	 * Dessine un halo lumine sur la surface du canvas
	 */
	drawCircularHaze: function(oCanvas, sOptions) {
		sOptions = sOptions || '';
		var aOptions = sOptions.split(' ');
		var w = oCanvas.width;
		var h = oCanvas.height;
		var wg = Math.max(w, h);

		// gradient noir
		var c3 = O876.CanvasFactory.getCanvas();
		c3.width = c3.height = wg;
		var ctx3 = c3.getContext('2d');
		var oRadial = ctx3.createRadialGradient(
			wg >> 1, wg >> 1, wg >> 2,
			wg >> 1, wg >> 1, wg >> 1
		);
		oRadial.addColorStop(0, 'rgba(0, 0, 0, 0)');
		oRadial.addColorStop(1, 'rgba(0, 0, 0, 1)');
		ctx3.fillStyle = oRadial;
		ctx3.fillRect(0, 0, wg, wg);

		// gradient lumière
		var c2 = O876.CanvasFactory.getCanvas();
		c2.width = w;
		c2.height = h;
		var ctx2 = c2.getContext('2d');
		ctx2.fillStyle = 'rgb(0, 0, 0)';
		ctx2.drawImage(oCanvas, 0, 0);
		if (aOptions.indexOf('top') >= 0) {
			ctx2.drawImage(c3, 0, 0, wg, wg, 0, 0, w, w);
			ctx2.fillRect(0, w, w, h - w);
		} else if (aOptions.indexOf('bottom') >= 0) {
			ctx2.fillRect(0, 0, w, h - w);
			ctx2.drawImage(c3, 0, 0, wg, wg, 0, h - w, w, w);
		} else if (aOptions.indexOf('middle') >= 0) {
			ctx2.fillRect(0, 0, w, (h - w) >> 1);
			ctx2.drawImage(c3, 0, 0, wg, wg, 0, (h - w) >> 1, w, w);
			ctx2.fillRect(0, ((h - w) >> 1) + w, w, (h - w) >> 1);
		} else {
			ctx2.drawImage(c3, 0, 0, wg, wg, 0, 0, w, h);
		}
		
		var oContext = oCanvas.getContext('2d');
		var gco = oContext.globalCompositeOperation;
		oContext.globalCompositeOperation = 'lighter';
		oContext.drawImage(c2, 0, 0);
		if (aOptions.indexOf('strong') >= 0) {
			oContext.drawImage(c2, 0, 0);
		}
		oContext.globalCompositeOperation = gco;
	}	
});
