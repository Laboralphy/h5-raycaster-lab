/**
 * this class is specialized into converting data 
 * from the editor to the raycaster.
 */
O2.createClass('RCWE.RCDataBuilder', {
	
	nPlaneSpacing: 64,
	sTileRoot: 'tile_',
	sThingRoot: 'thing_',
	
	TYPE_CORR: null,
		
	__construct: function() {
		this.TYPE_CORR = [0, 1, 10, [2, 4, 6, 7, 8, 3], 9, 12, 11];
	},
	
	buildLevelData: function(oData) {
		return {
			map: this.buildMap(oData),
			uppermap: this.buildUpperMap(oData),
			visual: this.buildVisuals(oData),
			walls: this.buildWalls(oData),
			flats: this.buildFlats(oData),
			startpoint: this.buildStartPoint(oData),
			tiles: this.buildTiles(oData),
			blueprints: this.buildBlueprints(oData),
			objects: this.buildObjects(oData),
			tags: this.buildTags(oData),
			background: this.buildBackground(oData),
			decals: this.buildDecals(oData)
		};
	},
	
	buildVisuals: function(oData) {
		var d = oData.visuals;
		var oRes = {};
		oRes.ceilColor = GfxTools.buildStructure(d.ceil);
		oRes.fogColor = GfxTools.buildStructure(d.fog);
		oRes.floorColor = GfxTools.buildStructure(d.floor);
		oRes.fogDistance = d.visib / 10;
		oRes.light = d.visib * 10;
		oRes.diffuse = d.diffu / 10;
		var f;
		try {
			f = GfxTools.buildStructure(d.filtr);
		} catch (e) {
		}
		oRes.filter = d.filtr == '#888888' ? false : {
			r: f.r / 0x88,
			g: f.g / 0x88,
			b: f.b / 0x88
		};
		return oRes;
	},
	
	buildWalls: function(oData) {
		if (!oData.tiles.walls) {
			return null;
		}
		var b = oData.blocks;
		var w = oData.tiles.walls;
		var oRes = {};
		oRes.src = w.tiles;
		oRes.codes = [null];
		var BT = RCWE.CONST.BLOCK_TYPE;
		b.forEach(function(oBlock) {
			var nType = oBlock.type;
			var id = oBlock.id;
			if (nType == BT.SOLID || nType == BT.TRANSPARENT || nType == BT.DOOR || nType == BT.SECRET || nType == BT.ALCOVE) {
				oRes.codes[id] = this.buildAnimatedWall(oBlock.frames, [
					w.ids.indexOf(oBlock.left), 
					w.ids.indexOf(oBlock.right), 
					w.ids.indexOf(oBlock.left2), 
					w.ids.indexOf(oBlock.right2)
				], oBlock.delay, oBlock.yoyo);
			} else {
				oRes.codes[id] = null;
			}
		}, this);
		return oRes;
	},
	
	buildAnimatedWall: function(nFrames, aWallIds, nDelay, bYoyo) {
		var TIME_INTERVAL = 40;
		if (aWallIds[2] == -1 && aWallIds[3] == -1) {
			aWallIds.pop();
			aWallIds.pop();
		}
		if (nFrames <= 1) {
			return aWallIds;
		} else {
			return [aWallIds, nFrames, nDelay, bYoyo ? 2 : 1];
		}
	},
	
	buildFlats: function(oData) {
		if (!oData.tiles.flats) {
			return null;
		}
		var b = oData.blocks;
		var w = oData.tiles.flats;
		var oRes = {};
		oRes.src = w.tiles;
		oRes.codes = [null];
		var BT = RCWE.CONST.BLOCK_TYPE;
		b.forEach(function(oBlock) {
			var nType = oBlock.type;
			var id = oBlock.id;
			if (nType == BT.WALKABLE || nType == BT.TRANSPARENT || nType == BT.DOOR || nType == BT.SECRET || nType == BT.ALCOVE || nType == BT.BLOCKING) {
				oRes.codes[id] = [w.ids.indexOf(oBlock.floor), w.ids.indexOf(oBlock.ceil)];
			} else {
				oRes.codes[id] = null;
			}
		});
		return oRes;
	},
	
	/**
	 * Converts a block into a physical code understandable by the raycaster engine
	 * @param oBlock a block
	 * @return int
	 */
	getBlockPhysicalCode: function(oBlock) {
		var aCorr = this.TYPE_CORR;
		var nType = oBlock.type;
		var id = oBlock.id;
		var nOffset = oBlock.offset;
		var nPhys;
		if (nType == RCWE.CONST.BLOCK_TYPE.DOOR) {
			nPhys = aCorr[nType][oBlock.doortype];
		} else {
			nPhys = aCorr[nType];
		}
		return (nOffset << 16) | (nPhys << 8) | id; // code12: (nPhys << 12)
	},

	buildMap: function(oData, bUpper) {
		bUpper = !!bUpper;
		var aCodes = [0];
		var b = oData.blocks;
		// correspondances between editor codes and raycaster codes
		b.forEach(function(oBlock) {
			aCodes[oBlock.id] = this.getBlockPhysicalCode(oBlock);
		}, this);
		return oData.grid.map.map(function(row, y) {
			return row.map(function(cell, x) {
				var n = bUpper ? (cell & 0xFF00) >> 8 : cell & 0xFF; // code12: (cell & 0xFFF00) >> 12 : cell & 0xFFF
				if (aCodes[n] === undefined) {
					throw new Error('undefined cell code : ' + n + ' at x:' + x + ' y:' + y);
				}
				return aCodes[n];
			});
		});
	},

	buildUpperMap: function(oData) {
		var bUpper = oData.grid.map.some(function(row, y) {
			return row.some(function(cell, x) {
				return cell & 0xFF00 != 0;
			});
		});
		if (bUpper) {
			return this.buildMap(oData, true);
		} else {
			return false;
		}
	},
	
	buildStartPoint: function(oData) {
		if (!oData.grid.start) {
			throw new Error('no startpoint defined');
		}
		return {
			x: (oData.grid.start.x << 6) + 32,
			y: (oData.grid.start.y << 6) + 32,
			angle: oData.grid.start.angle
		};
	},
	
	buildBackground: function(oData) {
		return oData.visuals.sky;
	},

	buildTags: function(oData) {
		return oData.grid.tags.map(function(t) {
			return {x: t.x, y: t.y, tag: t.v};
		});
	},
	
	buildTiles: function(oData) {
		var oTiles = {};
		oData.blueprints.forEach(function(bp) {
			var oTile = {
				src: bp.image,
				width: bp.width / bp.frames | 0,
				height: bp.height | 0,
				frames: bp.frames,
				noshading: bp.noshad,
				animations: [
					[ // first and only animation
						[0, 0, 0, 0, 0, 0, 0, 0],
						bp.frames, bp.delay, bp.yoyo ? 2 : bp.frames > 1 ? 1 : 0
					]
				]
			};
			oTiles[this.sTileRoot + bp.id] = oTile;
		}, this);
		return oTiles;
	},
	
	buildBlueprints: function(oData) {
		var oBlueprints = {};
		oData.blueprints.forEach(function(bp) {
			var oBlueprint = {
				type: 3, // always placeable
				tile: this.sTileRoot + bp.id,
				width: bp.width / bp.frames | 0,
				height: bp.height,
				thinker: null,
				data: null
			};
			var fx = 0;
			if (bp.transl) {
				fx |= RC.FX_LIGHT_ADD;
			}
			if (bp.alpha50) {
				fx |= RC.FX_ALPHA_50;
			}
			if (bp.noshad) {
				fx |= RC.FX_LIGHT_SOURCE;
			}
			oBlueprint.fx = fx;
			oBlueprints[this.sThingRoot + bp.id] = oBlueprint;
		}, this);
		return oBlueprints;
	},
	
	buildObjects: function(oData) {
		var aObjects = [];
		var ps = this.nPlaneSpacing;
		var oWH = {};
		oData.blueprints.forEach(function(bp) {
			oWH[this.sThingRoot + bp.id] = {
				width: bp.width / bp.frames | 0,
				height: bp.height
			};
		}, this);
		var aBlockData = [];
		oData.blocks.forEach(function(b) {
			aBlockData[b.id] = b;
		});
		oData.things.forEach(function(t) {
			var xCell = t.x / 3 | 0;
			var yCell = t.y / 3 | 0;
			var x3 = t.x % 3;
			var y3 = t.y % 3;
			// checking if the object is on a visible cell or inside a solid wall
			var nCode = oData.grid.map[yCell][xCell] & 0xFF;
			var oBlock = aBlockData[nCode];

			var BT = RCWE.CONST.BLOCK_TYPE;
			switch (oBlock.type) {
				case BT.SOLID:
				case BT.TRANSPARENT:
				case BT.DOOR:
				case BT.SECRET:
				case BT.ALCOVE:
				break;
				
				default:
					var sBlueprint = this.sThingRoot + t.v;
					var oBlueprint = oWH[sBlueprint];
					var nWidth = oBlueprint.width;
					var nHeight = oBlueprint.height;
					var xi, yi;
					switch (x3) {
						case 0:
							xi = nWidth >> 1;
							break;
							
						case 1:
							xi = ps >> 1;
							break;

						case 2:
							xi = ps - (nWidth >> 1);
							break;
					}
					switch (y3) {
						case 0:
							yi = nWidth >> 1;
							break;
							
						case 1:
							yi = ps >> 1;
							break;

						case 2:
							yi = ps - (nWidth >> 1);
							break;
					}
					var oObject = {
						x: xCell * ps + xi,
						y: yCell * ps + yi,
						blueprint: this.sThingRoot + t.v,
						angle: 0
					};
					aObjects.push(oObject);
				break;
			}
		}, this);
		return aObjects;
	},
	
	buildDecals: function(oData) {
		var aDecals = [];
		var ps = this.nPlaneSpacing;
		var oWH = {};
		var oBlueprints = this.buildBlueprints(oData);
		oData.blueprints.forEach(function(bp) {
			oWH[bp.id] = oBlueprints[this.sThingRoot + bp.id];
		}, this);
		var SIDES = [
			[-1,  3, -1],
			[ 0, -1,  2],
			[-1,  1, -1],
		];
		var aBlockData = [];
		oData.blocks.forEach(function(b) {
			aBlockData[b.id] = b;
		});
		oData.things.forEach(function(t) {
			var xCell = t.x / 3 | 0;
			var yCell = t.y / 3 | 0;
			var x3 = t.x % 3;
			var y3 = t.y % 3;
			// checking if the object is on a visible cell or inside a solid wall
			var nCode = oData.grid.map[yCell][xCell] & 0xFF;
			var oBlock = aBlockData[nCode];
			var BT = RCWE.CONST.BLOCK_TYPE;
			switch (oBlock.type) {
				case BT.SOLID:
				case BT.TRANSPARENT:
				case BT.DOOR:
				case BT.SECRET:
				case BT.ALCOVE:
					var oDecal = {
						x: xCell,
						y: yCell,
						side: SIDES[y3][x3],
						tile: oWH[t.v].tile
					};
					aDecals.push(oDecal);
				break;
				
				default:
				break;
			}
		}, this);
		return aDecals;
	}
});
