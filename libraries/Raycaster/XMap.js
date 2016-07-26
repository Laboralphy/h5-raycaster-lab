/**
 * Classe de personnalisation des 4 face d'un block Cette classe permet de
 * personaliser l'apparence ou les fonctionnalité d'une face d'un mur
 * Actuellement cette classe gène la personnalisation des texture du mur
 */
O2.createClass('O876_Raycaster.XMap', {
	aMap : null,
	nWidth : 0,
	nHeight : 0,
	nBlockWidth : 0,
	nBlockHeight : 0,
	nShadeFactor : 0,

	/*
	 * attributs de bloc utilisés Il y a 4 groupe d'attribut 1 pourt chaque face
	 * ... par cloneWall : la fonctionnalité de personalisation de la texture -
	 * bWall : flag à true si la texture du mur est personnalisé - oWall :
	 * canvas de la nouvelle texture - x - y ...
	 */

	setSize : function(w, h) {
		this.aMap = [];
		var aBlock, aRow, x, y, nSide;
		this.nWidth = w;
		this.nHeight = h;
		for (y = 0; y < h; y++) {
			aRow = [];
			for (x = 0; x < w; x++) {
				aBlock = [];
				for (nSide = 0; nSide < 6; nSide++) {
					aBlock.push({
						x : x,
						y : y,
						surface : null,
						diffuse: 0
					});
				}
				aRow.push(aBlock);
			}
			this.aMap.push(aRow);
		}
	},

	get : function(x, y, nSide) {
		if (x < 0 || y < 0) {
			throw new Error('x or y out of bound ' + x + ', ' + y);
		}
		return this.aMap[y][x][nSide];
	},

	set : function(x, y, nSide, xValue) {
		this.aMap[y][x][nSide] = xValue;
	},

	setBlockSize: function(w, h) {
		this.nBlockHeight = h;
		this.nBlockWidth = w;
	},

	/**
	 * créer une copie de la texture du mur spécifié.
	 * Renvoie le canvas nouvellement créé pour qu'on puisse dessiner dessus.
	 * Note : cette fonction est pas très pratique mais elle est utilisée par Raycaster.cloneWall
	 * @param oTextures textures murale du laby
	 * @param iTexture numéro de la texture murale
	 * @param x
	 * @param y position du mur (pour indexation)
	 * @param nSide face du block concernée.
	 */
	cloneTexture: function(oTextures, iTexture, x, y, nSide) {
		var oCanvas;
		var oBlock = this.get(x, y, nSide);
		if (oBlock.surface === null) {
			oBlock.surface = oCanvas = O876.CanvasFactory.getCanvas();
		} else {
			oCanvas = oBlock.surface;
			delete oCanvas.__shaded;
		}
		var w = this.nBlockWidth;
		var h;
		if (nSide < 4) {
			h = this.nBlockHeight;
		} else {
			// flat texture
			h = w;
			oBlock.imageData = null;
			oBlock.imageData32 = null;
			
			//oFloor.imageData = oCtx.getImageData(0, 0, oFlat.width, oFlat.height);
			//oFloor.imageData32 = new Uint32Array(oFloor.imageData.data.buffer);
		}
		oCanvas.width = w;
		oCanvas.height = h;
		oCanvas.getContext('2d').drawImage(oTextures, iTexture * w, 0, w, h, 0, 0, w, h);
		return oCanvas;
	},
	
	removeClone: function(x, y, nSide) {
		this.get(x, y, nSide).surface = null;
	}
});
