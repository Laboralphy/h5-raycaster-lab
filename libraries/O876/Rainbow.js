/** Rainbow - Color Code Convertor Boîte à outil graphique
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 * good to GIT
 */

O2.createClass('O876.Rainbow', {
	
	COLORS: {
		aliceblue : '#F0F8FF',
		antiquewhite : '#FAEBD7',
		aqua : '#00FFFF',
		aquamarine : '#7FFFD4',
		azure : '#F0FFFF',
		beige : '#F5F5DC',
		bisque : '#FFE4C4',
		black : '#000000',
		blanchedalmond : '#FFEBCD',
		blue : '#0000FF',
		blueviolet : '#8A2BE2',
		brown : '#A52A2A',
		burlywood : '#DEB887',
		cadetblue : '#5F9EA0',
		chartreuse : '#7FFF00',
		chocolate : '#D2691E',
		coral : '#FF7F50',
		cornflowerblue : '#6495ED',
		cornsilk : '#FFF8DC',
		crimson : '#DC143C',
		cyan : '#00FFFF',
		darkblue : '#00008B',
		darkcyan : '#008B8B',
		darkgoldenrod : '#B8860B',
		darkgray : '#A9A9A9',
		darkgrey : '#A9A9A9',
		darkgreen : '#006400',
		darkkhaki : '#BDB76B',
		darkmagenta : '#8B008B',
		darkolivegreen : '#556B2F',
		darkorange : '#FF8C00',
		darkorchid : '#9932CC',
		darkred : '#8B0000',
		darksalmon : '#E9967A',
		darkseagreen : '#8FBC8F',
		darkslateblue : '#483D8B',
		darkslategray : '#2F4F4F',
		darkslategrey : '#2F4F4F',
		darkturquoise : '#00CED1',
		darkviolet : '#9400D3',
		deeppink : '#FF1493',
		deepskyblue : '#00BFFF',
		dimgray : '#696969',
		dimgrey : '#696969',
		dodgerblue : '#1E90FF',
		firebrick : '#B22222',
		floralwhite : '#FFFAF0',
		forestgreen : '#228B22',
		fuchsia : '#FF00FF',
		gainsboro : '#DCDCDC',
		ghostwhite : '#F8F8FF',
		gold : '#FFD700',
		goldenrod : '#DAA520',
		gray : '#808080',
		grey : '#808080',
		green : '#008000',
		greenyellow : '#ADFF2F',
		honeydew : '#F0FFF0',
		hotpink : '#FF69B4',
		indianred  : '#CD5C5C',
		indigo  : '#4B0082',
		ivory : '#FFFFF0',
		khaki : '#F0E68C',
		lavender : '#E6E6FA',
		lavenderblush : '#FFF0F5',
		lawngreen : '#7CFC00',
		lemonchiffon : '#FFFACD',
		lightblue : '#ADD8E6',
		lightcoral : '#F08080',
		lightcyan : '#E0FFFF',
		lightgoldenrodyellow : '#FAFAD2',
		lightgray : '#D3D3D3',
		lightgrey : '#D3D3D3',
		lightgreen : '#90EE90',
		lightpink : '#FFB6C1',
		lightsalmon : '#FFA07A',
		lightseagreen : '#20B2AA',
		lightskyblue : '#87CEFA',
		lightslategray : '#778899',
		lightslategrey : '#778899',
		lightsteelblue : '#B0C4DE',
		lightyellow : '#FFFFE0',
		lime : '#00FF00',
		limegreen : '#32CD32',
		linen : '#FAF0E6',
		magenta : '#FF00FF',
		maroon : '#800000',
		mediumaquamarine : '#66CDAA',
		mediumblue : '#0000CD',
		mediumorchid : '#BA55D3',
		mediumpurple : '#9370DB',
		mediumseagreen : '#3CB371',
		mediumslateblue : '#7B68EE',
		mediumspringgreen : '#00FA9A',
		mediumturquoise : '#48D1CC',
		mediumvioletred : '#C71585',
		midnightblue : '#191970',
		mintcream : '#F5FFFA',
		mistyrose : '#FFE4E1',
		moccasin : '#FFE4B5',
		navajowhite : '#FFDEAD',
		navy : '#000080',
		oldlace : '#FDF5E6',
		olive : '#808000',
		olivedrab : '#6B8E23',
		orange : '#FFA500',
		orangered : '#FF4500',
		orchid : '#DA70D6',
		palegoldenrod : '#EEE8AA',
		palegreen : '#98FB98',
		paleturquoise : '#AFEEEE',
		palevioletred : '#DB7093',
		papayawhip : '#FFEFD5',
		peachpuff : '#FFDAB9',
		peru : '#CD853F',
		pink : '#FFC0CB',
		plum : '#DDA0DD',
		powderblue : '#B0E0E6',
		purple : '#800080',
		rebeccapurple : '#663399',
		red : '#FF0000',
		rosybrown : '#BC8F8F',
		royalblue : '#4169E1',
		saddlebrown : '#8B4513',
		salmon : '#FA8072',
		sandybrown : '#F4A460',
		seagreen : '#2E8B57',
		seashell : '#FFF5EE',
		sienna : '#A0522D',
		silver : '#C0C0C0',
		skyblue : '#87CEEB',
		slateblue : '#6A5ACD',
		slategray : '#708090',
		slategrey : '#708090',
		snow : '#FFFAFA',
		springgreen : '#00FF7F',
		steelblue : '#4682B4',
		tan : '#D2B48C',
		teal : '#008080',
		thistle : '#D8BFD8',
		tomato : '#FF6347',
		turquoise : '#40E0D0',
		violet : '#EE82EE',
		wheat : '#F5DEB3',
		white : '#FFFFFF',
		whitesmoke : '#F5F5F5',
		yellow : '#FFFF00',
		yellowgreen : '#9ACD32'
	},
	
	/** 
	 * Fabrique une chaine de caractère représentant une couleur au format CSS
	 * @param xData une structure {r: int, g: int, b: int, a: float}
	 * @return code couleur CSS au format rgb(r, g, b) ou rgba(r, g, b, a)
	 */
	rgba: function(xData) {
		return this._buildRGBAFromStructure(this.parse(xData));
	},
	
	/**
	 * Analyse une valeur d'entrée pour construire une structure avec les 
	 * composantes "r", "g", "b", et eventuellement "a".
	 */ 
	parse: function(xData) {
		if (typeof xData === "object") {
			return xData;
		} else if (typeof xData === "number") {
			return this._buildStructureFromInt(xData);
		} else if (typeof xData === "string") {
			xData = xData.toLowerCase();
			if (xData in this.COLORS) {
				xData = this.COLORS[xData];
			}
			switch (xData.length) {
				case 3:
					return this._buildStructureFromString3(xData);
					
				case 4:
					if (xData[0] === '#') {
						return this._buildStructureFromString3(xData.substr(1));
					} else {
						throw new Error('invalid color structure');
					}
					
				case 6:
					return this._buildStructureFromString6(xData);
					
				case 7:
					if (xData[0] === '#') {
						return this._buildStructureFromString6(xData.substr(1));
					} else {
						throw new Error('invalid color structure');
					}
					
				default:
					var rx = xData.match(/^rgb\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)$/);
					if (rx) {
						return {r: rx[1] | 0, g: rx[2] | 0, b: rx[3] | 0};
					} else {
						rx = xData.match(/^rgba\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([.0-9]+) *\)$/);
						if (rx) {
							return {r: rx[1] | 0, g: rx[2] | 0, b: rx[3] | 0, a: parseFloat(rx[4])};
						} else {
							throw new Error('invalid color structure ' + xData);
						}
					}
			}
		}
	},
	
	/**
	 * Génère un spectre entre deux valeurs de couleurs
	 * La fonction renvoi 
	 */
	spectrum: function(sColor1, sColor2, nSteps) {
		var c1 = this.parse(sColor1);
		var c2 = this.parse(sColor2);
		
		var nSecur = 100;
		
		function getMedian(x1, x2) {
			if (x1 === undefined) {
				throw new Error('first color is undefined');
			}
			if (x2 === undefined) {
				throw new Error('second color is undefined');
			}
			return {
				r: (x1.r + x2.r) >> 1,
				g: (x1.g + x2.g) >> 1,
				b: (x1.b + x2.b) >> 1
			};			
		}
		
		function fillArray(a, x1, x2, n1, n2) {
			var m = getMedian(x1, x2);
			var n = (n1 + n2) >> 1;
			if (--nSecur < 0) {
				return a;
			}
			if (Math.abs(n1 - n2) > 1) {
				fillArray(a, x1, m, n1, n);
				fillArray(a, m, x2, n, n2);
			}
			a[n1] = x1;
			a[n2] = x2;
			return a;
		}
		
		return fillArray([], c1, c2, 0, nSteps - 1).map(function(c) {
			return this.rgba(c);
		}, this);
	},
	
	/**
	 * Generate a gradient
	 * @param oPalette palette definition
	 * 
	 * {
	 * 		start: value,
	 * 		stop1: value,
	 * 		stop2: value,
	 * 		...
	 * 		stopN: value,
	 * 		end: value
	 * },
	 * 
	 * example :
	 * {
	 * 		0: '#00F',
	 * 		50: '#FF0',
	 * 		100: '#F00'
	 * }
	 * rappel : une palette d'indices de 0 à 100 dispose de 101 entrée
	 */
	gradient: function(oPalette) {
		var aPalette = [];
		var sColor = null;
		var sLastColor = null;
		var nPal;
		var nLastPal = 0;
		for (var iPal in oPalette) {
			nPal = iPal | 0;
			sColor = oPalette[iPal];
			if (sLastColor !== null) {
				aPalette = aPalette.concat(this.spectrum(sLastColor, sColor, nPal - nLastPal + 1).slice(1));
			} else {
				aPalette[nPal] = this.rgba(sColor);
			}
			sLastColor = sColor;
			nLastPal = nPal;
		}
		return aPalette;
	},

	_buildStructureFromInt: function(n) {
		var r = (n >> 16) & 0xFF;
		var g = (n >> 8) & 0xFF;
		var b = n & 0xFF;
		return {r: r, g: g, b: b};
	},
	
	_buildStructureFromString3: function(s) {
		var r = parseInt('0x' + s[0] + s[0]);
		var g = parseInt('0x' + s[1] + s[1]);
		var b = parseInt('0x' + s[2] + s[2]);
		return {r: r, g: g, b: b};
	},

	_buildStructureFromString6: function(s) {
		var r = parseInt('0x' + s[0] + s[1]);
		var g = parseInt('0x' + s[2] + s[3]);
		var b = parseInt('0x' + s[4] + s[5]);
		return {r: r, g: g, b: b};
	},

	_buildRGBAFromStructure: function(oData) {
		var s1 = 'rgb';
		var s2 = oData.r.toString() + ', ' + oData.g.toString() + ', ' + oData.b.toString();
		if ('a' in oData) {
			s1 += 'a';
			s2 += ', ' + oData.a.toString();
		}
		return s1 + '(' + s2 + ')';
	},
	
	_buildString3FromStructure: function(oData) {
		var sr = ((oData.r >> 4) & 0xF).toString(16);
		var sg = ((oData.g >> 4) & 0xF).toString(16);
		var sb = ((oData.b >> 4) & 0xF).toString(16);
		return sr + sg + sb;
	}
});
