/**
 * Classe de personnalisation des 4 face d'un block Cette classe permet de
 * personaliser l'apparence ou les fonctionnalité d'une face d'un mur
 * Actuellement cette classe gène la personnalisation des texture du mur
 */
O2.createClass('O876_Raycaster.XMap', {
	aMap : null,
	nWidth : 0,
	nHeight : 0,
	nWallWidth : 0,
	nWallHeight : 0,
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
				for (nSide = 0; nSide < 4; nSide++) {
					aBlock.push({
						x : x,
						y : y,
						oWall : null,
						bWall : false
					});
				}
				aRow.push(aBlock);
			}
			this.aMap.push(aRow);
		}
	},

	get : function(x, y, nSide) {
		return this.aMap[y][x][nSide];
	},

	set : function(x, y, nSide, xValue) {
		this.aMap[y][x][nSide] = xValue;
	},

	/**
	 * Permet de créer une copie de la texture du mur spécifié.
	 * Renvoie le canvas nouvellement créé pour qu'on puisse dessiner dessus.
	 * Note : cette fonction est pas très pratique mais elle est utilisée par Raycaster.cloneWall
	 * @param oWalls textures murale du laby
	 * @param nWall numéro de la texture murale
	 * @param x
	 * @param y position du mur (pour indexation)
	 * @param nSide face du block concernée.
	 */
	cloneWall : function(oWalls, nWall, x, y, nSide) {
		var oCanvas;
		var oBlock = this.get(x, y, nSide);
		if (oBlock.oWall === null) {
			oBlock.oWall = oCanvas = O876.CanvasFactory.getCanvas();
		} else {
			oCanvas = oBlock.oWall;
		}
		oBlock.bWall = true;
		oCanvas.width = this.nWallWidth;
		oCanvas.height = this.nWallHeight;
		oCanvas.getContext('2d').drawImage(oWalls, nWall * this.nWallWidth, 0, this.nWallWidth, this.nWallHeight, 0, 0, this.nWallWidth, this.nWallHeight);
		return oCanvas;
	}
});
