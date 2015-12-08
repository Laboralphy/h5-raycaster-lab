O2.extendClass('MWE.Application', RCWE.Application, {
	
	nRscLoaded: 0,
	sPalette: 'p_castle',
	sObjects: 'objects',
	oPalette: null,
	oObjects: null,
	sWallImg: '',
	sFlatImg: '',
	sBGImg: '',
	
	aObjLoadingChain: null,
	
	build: function($oRoot, oOptions) {
		__inherited($oRoot);
		this.oBackup = new MWE.Backup();
		this.oBackup.setApplication(this);
		this.oWallTiles.onImageLoaded = this.wallLoaded.bind(this);
		this.oFlatTiles.onImageLoaded = this.flatLoaded.bind(this);
		this.loadWalls(oOptions.tsw || 'w00');
		this.loadFlats(oOptions.tsf || 'f00');
		this.oObjects = {};
		this.loadSky(oOptions.tss || 's00');
		$('form', this.oBlockBuilder.getContainer()).hide();
		$('.toolbar', this.oBlockBuilder.getContainer()).hide();
		
		this.oObjectBuilder.onImageEntryLoaded = (function() {
			if (this.aObjLoadingChain.length) {
				var a = this.aObjLoadingChain.shift();
				if (typeof a == 'string') {
					this.obAdd(a);
				} else {
					this.obAdd.apply(this, a);
				}
			} else {
				$('form', this.oObjectBuilder.getContainer()).hide();
				$('.toolbar', this.oObjectBuilder.getContainer()).hide();
			}
		}).bind(this);
		$.get('scripts/data/' + this.sObjects + '.json', (function(data) {
			this.aObjLoadingChain = data;
			this.oObjectBuilder.onImageEntryLoaded();
		}).bind(this)).fail((function(e, textStatus, error) {
			this.error('error while loading object data : ' + error);
		}).bind(this));
		
		var $btnImport = this.oWorldGrid.addCommand('✉', 'import laby from O876 generator', this.cmd_importLab.bind(this));
		var $btnSave = $('#wg_fwrite');
		$btnImport.detach();
		$btnSave.after($btnImport);
		$('#wg_fexport, #wg_vwsprite').hide();
	},
	
	obAdd: function(sEntry, nFrames, nDelay, nFlags) {
		nFrames = nFrames || 1;
		nDelay = nDelay || 100;
		var sDisp = sEntry.replace(/^d_/, '').replace(/_/, ' ');
		this.oObjects[sDisp] = sEntry;
		this.oObjectBuilder.addEntry(
			sDisp,
			'resources/objects/' + sEntry + '.png',
			nFrames, 
			nDelay, 
			(nFlags & 1) != 0, // yoyo
			(nFlags & 2) != 0, // transl
			(nFlags & 4) != 0, // noshad
			(nFlags & 8) != 0  // alpha50
		);
	},
	
	loadSky: function(s) {
		this.sBGImg = s;
		this.oSkyView.imageSourceSet('resources/skies/' + s + '.png');
	},
	
	loadWalls: function(s) {
		this.sWallImg = s;
		this.oWallTiles.getContainer().show();
		this.nRscLoaded &= 2;
		this.oWallTiles.imageSourceSet('resources/walls/' + s + '.png');
	},
	
	loadFlats: function(s) {
		this.sFlatImg = s;
		this.oFlatTiles.getContainer().show();
		this.nRscLoaded &= 1;
		this.oFlatTiles.imageSourceSet('resources/flats/' + s + '.png');
	},
	
	
	wallLoaded: function() {
		this.nRscLoaded |= 1;
		if (this.nRscLoaded == 3) {
			this.rebuildBlocks();
		}
	},
	
	flatLoaded: function() {
		this.nRscLoaded |= 2;
		if (this.nRscLoaded == 3) {
			this.rebuildBlocks();
		}
	},
	
	rebuildBlocks: function() {
		this.oWallTiles.getContainer().hide();
		this.oFlatTiles.getContainer().hide();
		var oThis = this;
		$.get('scripts/data/' + this.sPalette + '.json', function(data) {
			// reconstruction du data
			var d = [];
			var nId = 1;
			for (var i = 0; i < data.length; i += 3) {
				d.push(nId++);
				d.push(data[i + 1]);
				d.push(data[i + 2]);
				data[i + 2].code = data[i] | 0;
			}
			oThis.oPalette = d;
			oThis.oBlockBuilder.setData(d);
			oThis.oCellFactory.reset();
			oThis.redrawGrid();
		}).fail(function(e, s, error) {
			oThis.error('error while rebuilding blocks : ' + error);
		});
	},
	
	getExportBlockList: function() {
		var $options = $('select[size] option', W.oBlockBuilder.getContainer());
		var oResult = [];
		$options.each(function() {
			var $this = $(this);
			var nValue = $this.val() | 0;
			var sName = $this.html();
			oResult[nValue] = sName;
		});
	},
	
	save: function() {
		var sFile = prompt('Enter a file name', this.sWorldName);
		if (sFile) {
			this.sWorldName = sFile;
			this.oBackup.save(sFile, this.oWorldView.sScreenShot, true);
		}
	},
	
	/**
	 * Exporte une copie du niveau dans un projet
	 */
	exportGame: function(m) {
		var nLabScale = 64;
		var oThis = this;
		var aMap = m[2];
		var aObjects = m[3];
		var aSky = m[4];
		var oVisual = m[5];
		var aStartPoint = m[6];
		var aTags = m[7];
		
		// arranger les nulls de la map
		var aLowerMap = aMap.map(function(r) {
			return r.map(function(c) {
				if (c === null) {
					c = 0;
				}
				return c & 0xFF;
			});
		});
		var aUpperMap = aMap.map(function(r) {
			return r.map(function(c) {
				return c === null ? 0 : c >> 8;
			});
		});
		var bUpper = aMap.some(function(r) {
			return r.some(function(c) {
				return c > 255;
			});
		});
		
		// créer un registre de tag
		var aTagRegistry = [];
		aTags.forEach(function(r, x) {
			if (r) {
				r.forEach(function(c, y) {
					if (typeof c === 'string') {
						aTagRegistry.push({x: x, y: y, tag: c});
					}
				});
			}
		});
		
		// créer un registre des objets
		var aObjectRegistry = aObjects.map(function(o) {
			var x = 0, y = 0;
			var ns = o.size;
			
			var xLeft = o.x * nLabScale + ns;
			var xCenter = o.x * nLabScale + (nLabScale >> 1) - ns;
			var xRight = (o.x + 1) * nLabScale - 1 - ns;

			var yTop = o.y * nLabScale + ns;
			var yCenter = o.y * nLabScale + (nLabScale >> 1) - ns;
			var yBottom = (o.y + 1) * nLabScale - 1 - ns;
			
			switch (o.padindex) {
				case 1: 
					x = xLeft;
					y = yBottom;
				break;

				case 2: 
					x = xCenter;
					y = yBottom;
				break;

				case 3: 
					x = xRight;
					y = yBottom;
				break;

				case 4: 
					x = xLeft;
					y = yCenter;
				break;

				case 5: 
					x = xCenter;
					y = yCenter;
				break;

				case 6: 
					x = xRight;
					y = yCenter;
				break;

				case 7: 
					x = xLeft;
					y = yTop;
				break;

				case 8: 
					x = xCenter;
					y = yTop;
				break;

				case 9: 
					x = xRight;
					y = yTop;
				break;
			}
			return {
				x: x,
				y: y,
				angle: 0,
				blueprint: oThis.oObjects[o.blueprint]
			};
		});
		
		var oPalDef = {
			background: this.sBGImg,
			walls: this.sWallImg,
			flats: this.sFlatImg,
			blocks: {}
		};
		var px,		// oPalette oPal 
			acnt,	// nombre de frames
			adel, 	// delay inter frame
			right,
			left,
			floor,
			ceil,
			aWall, 	// construction data wall
			aFlat,
			iWallAnim, 
			iWallDelay;
			
		for (var iPal = 0; iPal < this.oPalette.length; iPal += 3) {
			px = this.oPalette[iPal + 2];
			acnt = px.acnt | 0;
			if (acnt) {
				adel = px.adel | 0;
			} else {
				adel = 0;
			}
			if (acnt == 0) {
				acnt = 1;
			}
			++adel;
			
			// concernant les murs
			right = px.right === '' ? -1 : px.right | 0;
			left = px.left === '' ? -1 : px.left | 0;
			if (right === -1 && left === -1) {
				aWall = null;
			} else {
				aWall = [];
				for (iWallAnim = 0; iWallAnim < acnt; ++iWallAnim) {
					for (iWallDelay = 0; iWallDelay < adel; ++iWallDelay) {
						aWall.push(left + iWallAnim);
						aWall.push(right + iWallAnim);
					}
				}
				for (iWallAnim = acnt - 2; iWallAnim >= 0; --iWallAnim) {
					for (iWallDelay = 0; iWallDelay < adel; ++iWallDelay) {
						aWall.push(left + iWallAnim);
						aWall.push(right + iWallAnim);
					}
				}
			}
			// concernant les flats
			floor = px.floor === '' ? -1 : px.floor | 0;
			ceil = px.ceil === '' ? -1 : px.ceil | 0;
			if (floor === -1 && ceil === -1) {
				aFlat = null;
			} else {
				aFlat = [floor, ceil];
			}
			
			oPalDef.blocks[px.code] = {
				w: aWall,
				f: aFlat,
				c: px.phys | 0,
				o: px.offs | 0
			};
		}
		
		
		var oResult = {
			palette: oPalDef,
			map: aLowerMap,
			visual: oVisual,
			tags: aTagRegistry,
			objects: aObjectRegistry,
			startpoint: {
				x: aStartPoint[0] * nLabScale + (nLabScale >> 1),
				y: aStartPoint[1] * nLabScale + (nLabScale >> 1),
				angle: aStartPoint[2]
			}
		};
		if (bUpper) {
			oResult.uppermap = aUpperMap;
		}
		return oResult;
	},
	
	
	getPaletteCodes: function() {
		var a = {};
		var b = {};
		var p = this.oPalette;
		for (var i = 0; i < p.length; i += 3) {
			a[p[i]] = p[i + 2].code;
			b[p[i + 2].code] = p[i]; 
		}
		return {
			'toHex': a,
			'fromHex': b
		};
	},

	cmd_importLab: function() {
		var nSeed = prompt('enter the laby generation key : <seed>');
		
		$.getJSON('http://127.0.0.1/ralphy/raycaster/dynamics/laby/laby.php?s=' + nSeed + '&h=0&g=magetower&o=-ls1-rs1-lc3',
		(function(data) {
			this.cmd_feedGrid(data),
			this.redrawGrid();
		}).bind(this))
		.fail(function(err, msg) {
			W.error(msg);
		});
	},

	cmd_feedGrid: function(data) {
		var pc = this.getPaletteCodes().fromHex;
		var oTags = Marker.create();
		this.oTagRegistry = oTags;
		this.oWorldGrid.setSize(data.length);
		var aMap = data.map(function(r, y) { // j'aime bien çà !
			return r.map(function(c, x) {
				var cLow = c & 0xFF;
				var cHi = c >> 8;
				var nLow = pc[cLow];
				var nHi = pc[cHi];
				switch (cLow) {
					case 0x15: // chest
						Marker.markXY(oTags, x, y, 'chest normal');
					break;
					case 0x8F: // secret door
						Marker.markXY(oTags, x, y, 'secretCheck');
					break;
				}
				switch (cHi) {
					case 1: // SPAWN P1
						Marker.markXY(oTags, x, y, 'spawn p1');
					break;
					case 2: // SECRET CHECK
						Marker.markXY(oTags, x, y, 'secretCheck');
					break;
				}
				return nLow;
			});
		});
		this.oWorldGrid.aGrid = aMap;
	},
	
	getBlueprintIndex: function(sBP) {
		var oOption = null;
		$('option', this.oObjectBuilder.getContainer()).each(function() {
			if ($(this).html() === sBP) {
				oOption = this;
			}
		});
		if (oOption) {
			return $(oOption).index();
		} else {
			return -1;
		}
	}
});
