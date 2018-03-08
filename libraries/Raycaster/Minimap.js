O2.createClass('O876_Raycaster.Minimap',  {

	oRaycaster: null,
	aSquares: null,
	aModified: null,
	aColors: null,
	oCanvas: null,
	oContext: null,
	
	aPixels: null,
	
	bRestricted : true, // affichage reduit pour ne pas detecter les autre joeur
	
	reset: function(oRaycaster) {
		this.aColors = [
              '#000000', // mur
              '#FF8888', // missiles
              '#00FF00', // mobiles
              '#00FFFF', 
              '#5588AA', // champ de vision
              '#FF00FF',
              '#FFFF00',
              '#555555', // vide             
              '#777777'  // placeable
		];
		this.oRaycaster = oRaycaster;
		this.aSquares = [];
		this.aModified = [
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		];
		var aSqrRaw;
		var x, y;
		for (y = 0; y < this.oRaycaster.nMapSize; y++) {
			aSqrRaw = [];
			for (x = 0; x < this.oRaycaster.nMapSize; x++) {
				aSqrRaw.push([-1, false, x, y]);
			}
			this.aSquares.push(aSqrRaw);
		}
		if (this.oCanvas === null) {
			this.oCanvas = O876.CanvasFactory.getCanvas();
		}
		this.oCanvas.width = this.oCanvas.height = this.oRaycaster.nMapSize << 2;
		var ctx = this.oCanvas.getContext('2d');

		var pix = [];
		this.aColors.forEach(function(sItem, i, a) {
			var oID = ctx.createImageData(1, 1);
			var d = oID.data;
			d[0] = 100;//parseInt('0x' + sItem.substr(1, 2));
			d[1] = 200;//parseInt('0x' + sItem.substr(3, 2));
			d[2] = 50;//parseInt('0x' + sItem.substr(5, 2));
			d[3] = 1;
			pix.push(oID);
		});
		this.aPixels = pix;
		this.oContext = ctx;
	},
	
	setSquare: function(x, y, n) {
		var q = this.aSquares[y][x];
		if (q[0] != n) {
			q[0] = n;
			if (!q[1]) {
				q[1] = true;
				this.aModified[n].push(q);
			}
		}
	},
	
	getMobileColor: function(aMobiles) {
		var l = aMobiles.length;
		var m, nType, bPlaceable = false;
		for (var i = 0; i < l; ++i) {
			m = aMobiles[i];
			nType = m.getType();
			if (nType == RC.OBJECT_TYPE_PLAYER || nType == RC.OBJECT_TYPE_MOB) {
				return 2;
			}
			if (nType == RC.OBJECT_TYPE_MISSILE) {
				return 1;
			}
			if (nType == RC.OBJECT_TYPE_PLACEABLE) {
				bPlaceable = true;
			}
		}
		return bPlaceable ? 8 : 7;
	},

	updateSquares: function() {
		var rc = this.oRaycaster;
		var nMapSize = rc.nMapSize;
		var x, y, nColor;
		for (y = 0; y < nMapSize; y++) {
			for (x = 0; x < nMapSize; x++) {
				if (this.bRestricted && rc.oCamera.xSector === x && rc.oCamera.ySector === y) {
					nColor = 2;
				} else if (this.bRestricted === false && rc.oMobileSectors.get(x, y).length) {
					nColor = this.getMobileColor(rc.oMobileSectors.get(x, y));  // mobile
				} else if (Marker.getMarkXY(rc.aScanSectors, x, y)) {
					nColor = 4;  // champ de vision joueur
				} else if (rc.getMapPhys(x, y)) {
					nColor = 0;  // mur
				} else {
					nColor = 7;  // vide
				}
				this.setSquare(x, y, nColor);
			}
		}
	},

	getModified: function() {
		return this.aModified;
	},

	renderSurface: function() {
		this.updateSquares();
		var rc = this.oRaycaster;
		var q, mc, m = this.aModified;
		for (var nColor = 0; nColor < m.length; ++nColor) {
			if (this.aColors[nColor]) {
				mc = m[nColor];
				this.oContext.fillStyle = this.aColors[nColor];
				while (mc.length) {
					q = mc.shift();
					this.oContext.fillRect(q[2], q[3], 1, 1);
					q[1] = false;
				}
			}
		}
		rc.getRenderContext().drawImage(this.oCanvas, 2, 2);
	},
	
	render: function() {
		this.updateSquares();
		this.renderSurface();
	}

});
