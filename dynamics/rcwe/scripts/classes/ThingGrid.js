/**
 * This class manages a collection of placeable things on the level grid
 */
O2.createClass('RCWE.ThingGrid', {
	_aThings: null,
	_wCell: 32,
	_wThing: 6,
	_wPad: 2,
	_aPositions: null,
	
	__construct: function() {
		this.setProportions(32);
		this.reset();
	},
	
	setProportions: function(w) {
		this._wCell = w;
		this._wThing = w / 5 | 0;
		this._wPad = w >> 4;
		var wRemain = this._wCell - this._wThing;
		var wPad = this._wPad;
		this._aPositions = [wPad, wRemain >> 1, wRemain - wPad];
	},
	
	reset: function() {
		this._aThings = Marker.create();
	},
	
	render: function(ctx) {
		ctx.strokeStyle = 'rgb(0, 0, 0)';
		ctx.fillStyle = 'rgb(128, 128, 128)';
		var wCell = this._wCell;
		var wThing = this._wThing;
		var aPos = this._aPositions;
		Marker.iterate(this._aThings, function(xi, yi, b) {
			var x = xi / 3 | 0;
			var y = yi / 3 | 0;
			var x3 = xi % 3;
			var y3 = yi % 3;
			ctx.fillRect(x * wCell + aPos[x3], y * wCell + aPos[y3], wThing, wThing);
			ctx.strokeRect(x * wCell + aPos[x3], y * wCell + aPos[y3], wThing, wThing);
		});
	},
	
	renderCell: function(ctx, x, y, wCell, hCell, sIdHL) {
		var wThing = this._wThing;
		var aPos = this._aPositions;
		var aThings = this._aThings;
		var xCell = x / wCell | 0;
		var yCell = y / hCell | 0;
		var xCell3 = xCell * 3;
		var yCell3 = yCell * 3;
		var xTh, yTh, v;
		for (yTh = 0; yTh < 3; ++yTh) {
			for (xTh = 0; xTh < 3; ++xTh) {
				v = Marker.getMarkXY(aThings, xCell3 + xTh, yCell3 + yTh);
				if (v) {
					if (v == sIdHL) {
						ctx.strokeStyle = 'rgb(0, 0, 140)';
						ctx.fillStyle = 'rgb(255, 255, 255)';
					} else {
						ctx.strokeStyle = 'rgb(0, 0, 0)';
						ctx.fillStyle = 'rgb(128, 128, 128)';
					}
					ctx.fillRect(
						x + aPos[xTh], 
						y + aPos[yTh], 
						wThing, wThing
					);
					ctx.strokeRect(
						x + aPos[xTh], 
						y + aPos[yTh], 
						wThing, wThing
					);
				}
			}
		}
	},

	
	addThing: function(x, y, b) {
		Marker.markXY(this._aThings, x, y, b);
	},
	
	removeThing: function(x, y) {
		Marker.clearXY(this._aThings, x, y);
	},
	
	removeAll: function(nId) {
		var t = this._aThings;
		Marker.iterate(t, function(x, y, v) {
			if (v == nId) {
				Marker.clearXY(t, x, y);
			}
		});
	},
	
	getThing: function(x, y) {
		return Marker.getMarkXY(this._aThings, x, y);
	},

	hasThing: function(x, y) {
		return !!this.getThing(x, y);
	},
	
	/**
	 * search all things of select id, from x, y location
	 */
	locateThings: function(idSearch) {
		var a = [];
		var aPos = this._aPositions;
		var w = this._wCell;
		Marker.iterate(this._aThings, function(x, y, id) {
			if (id === idSearch) {
				a.push({
					x: w * (x / 3 | 0) + aPos[x % 3], 
					y: w * (y / 3 | 0) + aPos[y % 3],
					id: id
				});
			}
		});
		return a;
	},
	
	/**
	 * Moves every thing 
	 */
	shiftThingPosition: function(sDir, n) {
		var aPos = {
			up: {x: 0, y: -1},
			down: {x: 0, y: 1},
			left: {x: -1, y: 0},
			right: {x: 1, y: 0}
		};
		var a = this.serialize();
		a.forEach(function (t) {
			t.x += aPos[sDir].x * n * 3;
			t.y += aPos[sDir].y * n * 3;
		});
		this.unserialize(a.filter(function(t) {
			return t.x >= 0 && t.y >= 0;
		}));
	},

	/**
	 * serialize aThings in a more compact format
	 */
	serialize: function() {
		return Marker.serialize(this._aThings);
	},
	
	unserialize: function(d) {
		this._aThings = Marker.unserialize(d);
	}
});
