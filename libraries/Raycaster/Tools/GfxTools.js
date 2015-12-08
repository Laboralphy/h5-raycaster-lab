/** GfxTools Boîte à outil graphique
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */

O2.createObject('GfxTools', {
	/** Calcule une couleur CSS à partir de donnée R G B A 
	 * @param aData objet {r g b a} r, g, b sont des entier 0-255 a est un flottant 0-1
	 * @return chaine CSS utilisable par le canvas
	 */
	buildRGBA : function(xData) {
		return GfxTools.buildRGBAFromStructure(GfxTools.buildStructure(xData));
	},
	
	buildStructure: function(xData) {
		if (typeof xData === "object") {
			return xData;
		} else if (typeof xData === "number") {
			return GfxTools.buildStructureFromInt(xData);
		} else if (typeof xData === "string") {
			switch (xData.length) {
				case 3:
					return GfxTools.buildStructureFromString3(xData);
					
				case 4:
					if (xData[0] === '#') {
						return GfxTools.buildStructureFromString3(xData.substr(1));
					} else {
						throw new Error('invalid color structure');
					}
					
				case 6:
					return GfxTools.buildStructureFromString6(xData);
					
				case 7:
					if (xData[0] === '#') {
						return GfxTools.buildStructureFromString6(xData.substr(1));
					} else {
						throw new Error('invalid color structure');
					}
					
				default:
					var rx = xData.match(/^rgb\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)$/);
					if (rx) {
						return {r: rx[1] | 0, g: rx[2] | 0, b: rx[3] | 0};
					} else {
						throw new Error('invalid color structure ' + xData);
					}
			}
		}
	},
	
	buildStructureFromInt: function(n) {
		var r = (n >> 16) & 0xFF;
		var g = (n >> 8) & 0xFF;
		var b = n & 0xFF;
		return {r: r, g: g, b: b};
	},
	
	buildStructureFromString3: function(s) {
		var r = parseInt('0x' + s[0] + s[0]);
		var g = parseInt('0x' + s[1] + s[1]);
		var b = parseInt('0x' + s[2] + s[2]);
		return {r: r, g: g, b: b};
	},

	buildStructureFromString6: function(s) {
		var r = parseInt('0x' + s[0] + s[1]);
		var g = parseInt('0x' + s[2] + s[3]);
		var b = parseInt('0x' + s[4] + s[5]);
		return {r: r, g: g, b: b};
	},

	buildRGBAFromStructure: function(oData) {
		var s1 = 'rgb';
		var s2 = oData.r.toString() + ', ' + oData.g.toString() + ', ' + oData.b.toString();
		if ('a' in oData) {
			s1 += 'a';
			s2 += ', ' + oData.a.toString();
		}
		return s1 + '(' + s2 + ')';
	},
	
	buildString3FromStructure: function(oData) {
		var sr = ((oData.r >> 4) & 0xF).toString(16);
		var sg = ((oData.g >> 4) & 0xF).toString(16);
		var sb = ((oData.b >> 4) & 0xF).toString(16);
		return sr + sg + sb;
	},
	
	
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
