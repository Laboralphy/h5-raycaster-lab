O2.createClass('Astar.Point', {
	x : 0,
	y : 0,
	__construct : function(x, y) {
		this.x = x;
		this.y = y;
	}
});

O2.createClass('Astar.Nood', {
	fGCost : 0.0,
	fHCost : 0.0,
	fFCost : 0.0,
	oParent : null,
	oPos : null,

	__construct : function() {
		this.oParent = new Astar.Point(0, 0);
		this.oPos = new Astar.Point(0, 0);
	},

	isRoot : function() {
		return this.oParent.x == this.oPos.x && this.oParent.y == this.oPos.y;
	}
});

O2.createClass('Astar.NoodList', {
	aList : null,

	__construct : function() {
		this.aList = {};
	},

	add : function(oNood) {
		this.set(oNood.oPos.x, oNood.oPos.y, oNood);
	},

	set : function(x, y, oNood) {
		this.aList[this.getKey(x, y)] = oNood;
	},

	count : function() {
		var n = 0, i = '';
		for (i in this.aList) {
			n++;
		}
		return n;
	},

	exists : function(x, y) {
		if (this.getKey(x, y) in this.aList) {
			return true;
		} else {
			return false;
		}
	},

	getKey : function(x, y) {
		return x.toString() + '__' + y.toString();
	},

	get : function(x, y) {
		if (this.exists(x, y)) {
			return this.aList[this.getKey(x, y)];
		} else {
			return null;
		}
	},

	del : function(x, y) {
		delete this.aList[this.getKey(x, y)];
	},

	empty : function() {
		var i = '';
		for (i in this.aList) {
			return false;
		}
		return true;
	}
});

O2.createClass('Astar.Land', {
	bUseDiagonals : false,
	MAX_ITERATIONS : 2048,
	nIterations : 0,
	aTab : null,
	nWidth : 0,
	nHeight : 0,
	oOpList : null,
	oClList : null,
	aPath : null,
	aMoves : null,
	xLast : 0,
	yLast : 0,
	nLastDir : 0,

	LAND_BLOCK_WALKABLE: 0,

	init : function(a) {
		this.aTab = a;
		this.nHeight = a.length;
		this.nWidth = a[0].length;
	},

	reset : function() {
		this.oOpList = new Astar.NoodList();
		this.oClList = new Astar.NoodList();
		this.aPath = [];
		this.aMoves = [];
		this.nIterations = 0;
	},

	distance : function(x1, y1, x2, y2) {
		return MathTools.distance(x1 - x2, y1 - y2);
	},

	setCell : function(x, y, n) {
		if (this.aTab[y] !== undefined && this.aTab[y][x] !== undefined) {
			this.aTab[y][x] = n;
		} else {
			throw new Error(
					'Astar: Land.badCell: writing tile out of land: ' + x + ', ' + y);
		}
	},

	getCell : function(x, y) {
		if (this.aTab[y]) {
			if (x < this.aTab[y].length) {
				return this.aTab[y][x];
			}
		}
		throw new Error('Astar: Land.badTile: read tile out of land: ' + x + ', ' + y);
	},

	isCellWalkable : function(x, y) {
		try {
			return this.getCell(x, y) == this.LAND_BLOCK_WALKABLE;
		} catch (e) {
			return false;
		}
	},

	// Transferer un node de la liste ouverte vers la liste fermee
	closeNood : function(x, y) {
		var n = this.oOpList.get(x, y);
		if (n) {
			this.oClList.set(x, y, n);
			this.oOpList.del(x, y);
		}
	},

	addAdjacent : function(x, y, xArrivee, yArrivee) {
		var i, j;
		var i0, j0;
		var oTmp;
		for (i0 = -1; i0 <= 1; i0++) {
			i = x + i0;
			if ((i < 0) || (i >= this.nWidth)) {
				continue;
			}
			for (j0 = -1; j0 <= 1; j0++) {
				if (!this.bUseDiagonals && (j0 * i0) !== 0) {
					continue;
				}
				j = y + j0;
				if ((j < 0) || (j >= this.nHeight)) {
					continue;
				}
				if ((i == x) && (j == y)) {
					continue;
				}
				if (!this.isCellWalkable(i, j)) {
					continue;
				}

				if (!this.oClList.exists(i, j)) {
					oTmp = new Astar.Nood();
					oTmp.fGCost = this.oClList.get(x, y).fGCost	+ this.distance(i, j, x, y);
					oTmp.fHCost = this.distance(i, j, xArrivee,	yArrivee);
					oTmp.fFCost = oTmp.fGCost + oTmp.fHCost;
					oTmp.oPos = new Astar.Point(i, j);
					oTmp.oParent = new Astar.Point(x, y);

					if (this.oOpList.exists(i, j)) {
						if (oTmp.fFCost < this.oOpList.get(i, j).fFCost) {
							this.oOpList.set(i, j, oTmp);
						}
					} else {
						this.oOpList.set(i, j, oTmp);
					}
				}
			}
		}
	},

	// Recherche le meilleur noeud de la liste et le renvoi
	bestNood : function(oList) {
		var oBest = null;
		var oNood;
		var iNood = '';

		for (iNood in oList.aList) {
			oNood = oList.aList[iNood];
			if (oBest === null) {
				oBest = oNood;
			} else if (oNood.fFCost < oBest.fFCost) {
				oBest = oNood;
			}
		}
		return oBest;
	},

	findPath : function(xFrom, yFrom, xTo, yTo) {
		this.reset();
		var oBest;
		var oDepart = new Astar.Nood();
		oDepart.oPos = new Astar.Point(xFrom, yFrom);
		oDepart.oParent = new Astar.Point(xFrom, yFrom);
		var xCurrent = xFrom;
		var yCurrent = yFrom;
		this.oOpList.add(oDepart);
		this.closeNood(xCurrent, yCurrent);
		this.addAdjacent(xCurrent, yCurrent, xTo, yTo);

		var iIter = 0;

		while (!((xCurrent == xTo) && (yCurrent == yTo)) && (!this.oOpList.empty())) {
			oBest = this.bestNood(this.oOpList);
			xCurrent = oBest.oPos.x;
			yCurrent = oBest.oPos.y;
			this.closeNood(xCurrent, yCurrent);
			this.addAdjacent(oBest.oPos.x, oBest.oPos.y, xTo, yTo);
			if (++iIter > this.MAX_ITERATIONS) {
				throw new Error('Astar: Land.badPath: pathfinder, too much iterations');
			}
		}
		if (this.oOpList.empty()) {
			 throw new Error('Astar: Land.badDest: pathfinder, no path to destination');
		}
		this.nIterations = iIter;
		this.buildPath(xTo, yTo);
		this.transformPath(xFrom, yFrom);
	},

	buildPath : function(xTo, yTo) {
		var oCursor = this.oClList.get(xTo, yTo);
		if (oCursor !== null) {
			while (!oCursor.isRoot()) {
				this.aPath.unshift(new Astar.Point(oCursor.oPos.x, oCursor.oPos.y));
				oCursor = this.oClList.get(oCursor.oParent.x, oCursor.oParent.y);
			}
		}
	},

	getDirFromXY : function(xFrom, yFrom, x, y) {
		// Cas Nord 0
	if (xFrom == x) {
		if ((yFrom - 1) == y) {
			return 0;
		}
		if ((yFrom + 1) == y) {
			return 2;
		}
	}
	if (yFrom == y) {
		if ((xFrom - 1) == x) {
			return 3;
		}
		if ((xFrom + 1) == x) {
			return 1;
		}
	}
},

// Transformer la suite de coordonnées en couple (direction, distance)
	transformPath : function(xFrom, yFrom) {
		var i;
		if (this.aPath.length === 0) {
			return;
		}
		this.xLast = this.aPath[0].x;
		this.yLast = this.aPath[0].y;
		this.nLastDir = this.getDirFromXY(xFrom, yFrom, this.xLast,
				this.yLast);
		var d;
		var n = 1;

		var nLen = this.aPath.length;
		for (i = 1; i < nLen; i++) {
			d = this.getDirFromXY(this.xLast, this.yLast,
					this.aPath[i].x, this.aPath[i].y);
			this.xLast = this.aPath[i].x;
			this.yLast = this.aPath[i].y;
			if (d == this.nLastDir) {
				n++;
			} else {
				this.aMoves.push(this.nLastDir);
				this.aMoves.push(n);
				this.nLastDir = d;
				n = 1;
			}
		}
		this.aMoves.push(this.nLastDir);
		this.aMoves.push(n);
	}
});
