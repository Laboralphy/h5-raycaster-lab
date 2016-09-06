O2.createClass('O876.Astar.Point', {
	x : 0,
	y : 0,
	__construct : function(x, y) {
		this.x = x;
		this.y = y;
	}
});

O2.createClass('O876.Astar.Nood', {
	fGCost : 0.0,
	fHCost : 0.0,
	fFCost : 0.0,
	oParent : null,
	oPos : null,

	__construct : function() {
		this.oParent = new O876.Astar.Point(0, 0);
		this.oPos = new O876.Astar.Point(0, 0);
	},

	isRoot : function() {
		return this.oParent.x == this.oPos.x && this.oParent.y == this.oPos.y;
	}
});

O2.createClass('O876.Astar.NoodList', {
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


O2.createClass('O876.Astar.Grid', {
	bUseDiagonals : false,
	MAX_ITERATIONS : 2048,
	nIterations : 0,
	aTab : null,
	nWidth : 0,
	nHeight : 0,
	oOpList : null,
	oClList : null,
	aPath : null,
	xLast : 0,
	yLast : 0,
	nLastDir : 0,

	GRID_BLOCK_WALKABLE: 0,

	init : function(c) {
		if ('grid' in c) {
			this.aTab = c.grid;
			this.nHeight = c.grid.length;
			this.nWidth = c.grid[0].length;
		}
		if ('diagonals' in c) {
			this.bUseDiagonals = c.diagonals;
		}
		if ('max' in c) {
			this.MAX_ITERATIONS = c.max;
		}
		if ('walkable' in c) {
			this.GRID_BLOCK_WALKABLE = c.walkable;
		}
	},

	reset : function() {
		this.oOpList = new O876.Astar.NoodList();
		this.oClList = new O876.Astar.NoodList();
		this.aPath = [];
		this.nIterations = 0;
	},

	distance : function(x1, y1, x2, y2) {
		var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
		var r = {
			distance: d,
			from: {x: x1, y: y1},
			to: {x: x2, y: y2}
		};
		this.trigger('distance', r);
		return r.distance;
	},

	setCell : function(x, y, n) {
		if (this.aTab[y] !== undefined && this.aTab[y][x] !== undefined) {
			this.aTab[y][x] = n;
		} else {
			throw new Error(
					'O876.Astar: writing tile out of Grid: ' + x + ', ' + y);
		}
	},

	getCell : function(x, y) {
		if (this.aTab[y]) {
			if (x < this.aTab[y].length) {
				return this.aTab[y][x];
			}
		}
		throw new Error('O876.Astar: read tile out of Grid: ' + x + ', ' + y);
	},

	cell: function(x, y, v) {
		if (v === undefined) {
			return this.getCell(x, y);
		} else {
			this.setCell(x, y, v);
			return this;
		}
	},

	isCellWalkable : function(x, y) {
		try {
			var r = {
				walkable: this.getCell(x, y) == this.GRID_BLOCK_WALKABLE,
				cell: {
					x: x, 
					y: y
				}
			};
			this.trigger('walkable', r);
			return r.walkable;
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
					oTmp = new O876.Astar.Nood();
					oTmp.fGCost = this.oClList.get(x, y).fGCost	+ this.distance(i, j, x, y);
					oTmp.fHCost = this.distance(i, j, xArrivee,	yArrivee);
					oTmp.fFCost = oTmp.fGCost + oTmp.fHCost;
					oTmp.oPos = new O876.Astar.Point(i, j);
					oTmp.oParent = new O876.Astar.Point(x, y);

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

	find : function(xFrom, yFrom, xTo, yTo) {
		this.reset();
		var oBest;
		var oDepart = new O876.Astar.Nood();
		oDepart.oPos = new O876.Astar.Point(xFrom, yFrom);
		oDepart.oParent = new O876.Astar.Point(xFrom, yFrom);
		var xCurrent = xFrom;
		var yCurrent = yFrom;
		this.oOpList.add(oDepart);
		this.closeNood(xCurrent, yCurrent);
		this.addAdjacent(xCurrent, yCurrent, xTo, yTo);

		var iIter = 0, MAX = this.MAX_ITERATIONS;

		while (!((xCurrent == xTo) && (yCurrent == yTo)) && (!this.oOpList.empty())) {
			oBest = this.bestNood(this.oOpList);
			xCurrent = oBest.oPos.x;
			yCurrent = oBest.oPos.y;
			this.closeNood(xCurrent, yCurrent);
			this.addAdjacent(oBest.oPos.x, oBest.oPos.y, xTo, yTo);
			if (++iIter > MAX) {
				throw new Error('O876.Astar: too much iterations');
			}
		}
		if (this.oOpList.empty() && !((xCurrent == xTo) && (yCurrent == yTo))) {
			 throw new Error('O876.Astar: no path to destination');
		}
		this.nIterations = iIter;
		this.buildPath(xTo, yTo);
		return this.aPath;
	},

	buildPath : function(xTo, yTo) {
		var oCursor = this.oClList.get(xTo, yTo);
		if (oCursor !== null) {
			while (!oCursor.isRoot()) {
				this.aPath.unshift({
					x: oCursor.oPos.x, 
					y: oCursor.oPos.y
				});
				oCursor = this.oClList.get(oCursor.oParent.x, oCursor.oParent.y);
			}
		}
	}
});


O2.mixin(O876.Astar.Grid, O876.Mixin.Events);