O2.createClass('RCWE.Application', {
	
	oCells: null,
	oStruct: null,
	oBackup: null,
	
	oWallTiles: null,
	oFlatTiles: null,
	oBlockBuilder: null,
	oWorldGrid: null,
	oWorldView: null,
	oHelp: null,
	oPopup: null,
	oObjectBuilder: null,
	oObjectPlacer: null,
	oSkyView: null,
	oGradBuilder: null,
	oFileOpenDialog: null,
	oSpriteSheetEditor: null,
	
	xTimeoutResize: null,
	xIntervalLoad: null,
	nLockGrid: 0,
	oLockReg: null,
	
	oTagRegistry: null,
	
	oCellFactory: null,
	sWorldName: '',
	
	oObjectRegistry: null, // sauver les objet placé sur la grid pour pouvoir les selectionner
	
	bInsideInput: false,
	bRendering: false,
	
	VIEW_WALLSFLATS: 1,
	VIEW_OBJECTS: 2,
	VIEW_SKY: 3,
	VIEW_3D: 4,
	VIEW_SPRITES: 5,
	
	MAX_GRID_WIDTH: 1920 - 512 - 320 - 64,
	MIN_GRID_WIDTH: 15 * 32,
	
	nView: 1,
	nTabShown: 0,
	nShownCellsWidth: 0,
	
	nCellSize: 32,  // taille des cellules du laby
		// diminuer la taille permet d'afficher l'appli dans des resolutions
		// plus petites
	
	build: function($oRoot) {
		// BACKUP
		this.oBackup = new RCWE.Backup();
		this.oBackup.setApplication(this);
		this.oTagRegistry = Marker.create();
		this.oLockReg = {};
		
		// STRUCTURE
		var $oStruct = $('<table class="RCWE"><tr><td id="c00"></td><td id="c01"></td><td id="c02"></td></td><td id="c03"></td><td id="c04"></td><td id="c05"></td><td id="c06"></td></tr></table>');
		$oRoot.append($oStruct);
		$oCells = $('td', $oStruct);
		this.oCells = $oCells;
		this.oStruct = $oStruct;
		var $c0 = $oCells.eq(0);
		var $c1 = $oCells.eq(1);
		var $c2 = $oCells.eq(2);
		var $c3 = $oCells.eq(3);
		var $c4 = $oCells.eq(4);
		var $c5 = $oCells.eq(5);
		var $c6 = $oCells.eq(6);
		
		// COMPONENTS
		var oCellFactory = new RCWE.CellFactory();
		var oWorldView = new RCWE.WorldViewer();
		var oWallTiles = new RCWE.TileBrowser();
		var oFlatTiles = new RCWE.TileBrowser();
		var oBlockBuilder = new RCWE.BlockBuilder();
		var oWorldGrid = new RCWE.LabyGrid();
		var oObjectBuilder = new RCWE.ObjectBuilder();
		var oObjectPlacer = new RCWE.ObjectPlacer();
		var oHelp = new RCWE.Document();
		var oSkyView = new RCWE.SkyViewer();
		var oGradBuilder = new RCWE.GradBuilder();
		var oFileOpenDialog = new RCWE.FileOpenDialog();
		var oSpriteSheetEditor = new RCWE.SpriteSheet();
		
		oCellFactory.nCellSize = oWorldGrid.wCell = this.nCellSize;
		
		this.oPopup = new RCWE.Popup();
		
		// WALL TILES
		oWallTiles.build('Wall tiles');
		oWallTiles.onSelect = this.wallSelected.bind(this);
		oWallTiles.nAllowedWidth = 64;
		oWallTiles.nAllowedHeight = 96;
		oWallTiles.onError = (function(sError) {
			this.error(sError);
		}).bind(this);
		this.oWallTiles = oWallTiles;

		// FLAT TILES
		oFlatTiles.build('Flat tiles', {markers: ['F', 'C']});
		oFlatTiles.onSelect = this.flatSelected.bind(this);
		oFlatTiles.nAllowedWidth = 64;
		oFlatTiles.nAllowedHeight = 64;
		oFlatTiles.onError = (function(sError) {
			this.error(sError);
		}).bind(this);
		this.oFlatTiles = oFlatTiles;

		// BLOCK BUILDER
		oBlockBuilder.build();
		oBlockBuilder.onSelect = this.blockSelected.bind(this);
		/*oBlockBuilder.onSave = (function(oSender) {
			this.unlockGrid('blockSelect');
		}).bind(this);*/
		this.oBlockBuilder = oBlockBuilder;

		// WORLD GRID
		oWorldGrid.build();
		oWorldGrid.onDraw = this.worldGridDrawCell.bind(this);
		oWorldGrid.onDrawOver = this.worldGridDrawed.bind(this);
		oWorldGrid.onClick = this.worldGridClick.bind(this);
		oWorldGrid.setSize(32);
		// ajout de boutons customisés
		oWorldGrid.addCommand('↥', 'move everything up', this.cmd_moveUp.bind(this), 'wg_meup');
		oWorldGrid.addCommand('↦', 'move everything right', this.cmd_moveRight.bind(this), 'wg_meright');
		oWorldGrid.addCommand('↧', 'move everything down', this.cmd_moveDown.bind(this), 'wg_medown');
		oWorldGrid.addCommand('↤', 'move everything left', this.cmd_moveLeft.bind(this), 'wg_meleft');
		oWorldGrid.getToolBar().append(' - ');
		oWorldGrid.addCommand('■▾', 'fill the first floor of selected region with the selected block', this.drawcmdBox1.bind(this), 'wg_fill1');
		oWorldGrid.addCommand('■▴', 'fill the second floor of selected region with the selected block', this.drawcmdBox2.bind(this), 'wg_fill2');
		oWorldGrid.addCommand('□', 'clear both floors of the selected region', oWorldGrid.clearFullBox.bind(oWorldGrid), 'wg_clear');
		oWorldGrid.getToolBar().append(' - ');
		oWorldGrid.addCommand('', 'load a previously saved world', this.fodOpen.bind(this), 'wg_fopen');
		oWorldGrid.addCommand('', 'save this world', this.save.bind(this), 'wg_fwrite');
		oWorldGrid.addCommand('✉', 'export the world', (function () {
			var sProject = prompt('what is the project name ?');
			var sLevel = '';
			if (sProject) {
				sLevel = prompt('and the level name ?');
			}
			if (sLevel) {
				this.exportGame(sProject, sLevel);
			}
		}).bind(this), 'wg_fexport');
	
		oWorldGrid.getToolBar().append(' - ');
		oWorldGrid.addCommand('◧', 'go to walls & flats textures management view', this.viewWF.bind(this), 'wg_vwwalls');
		oWorldGrid.addCommand('♜', 'go to object management view', this.viewObj.bind(this), 'wg_vwobj');
		oWorldGrid.addCommand('☁', 'go to sky management view', this.viewSky.bind(this), 'wg_vwsky');
		oWorldGrid.addCommand('⚑', 'tag the selected region', this.setRegionTag.bind(this), 'wg_tag');
		oWorldGrid.addCommand('😃', 'go to sprite view', this.viewSprites.bind(this), 'wg_vwsprite');
		oWorldGrid.addCommand('⚙', 'go to world rendering view', this.viewRend.bind(this), 'wg_vw3d');
		oWorldGrid.addCommand('✜', 'set starting point', this.cmd_setStartPoint.bind(this), 'wg_start');
		oWorldGrid.getToolBar().append(' - ');
		oWorldGrid.addCommand('?', 'Help and tutorials', this.cmd_help.bind(this), 'wg_help');
		this.oWorldGrid = oWorldGrid;
		this.redrawGrid();

		// WORLD VIEW
		oWorldView.onExit = this.exitRender.bind(this);
		oWorldView.build();
		this.oWorldView = oWorldView;

		// CELL FACTORY
		oCellFactory.setWallTextures(oWallTiles.oImage.get(0), 64);
		oCellFactory.setFlatTextures(oFlatTiles.oImage.get(0), 64);
		this.oCellFactory = oCellFactory;

		// HELP
		oHelp.build();
		oHelp.load('documents/keys_grid.html');
		this.oHelp = oHelp;

		// OBJECT BUILDER
		oObjectBuilder.build();
		this.oObjectBuilder = oObjectBuilder;

		// OBJECT PLACER
		oObjectPlacer.build();
		oObjectPlacer.onNewObject = this.objectAdded.bind(this);
		oObjectPlacer.onSelectObject = this.objectSelected.bind(this);
		oObjectPlacer.onDeleteObject = this.objectDeleted.bind(this);
		oObjectPlacer.onCommand = this.cmd_manip.bind(this);
		this.oObjectPlacer = oObjectPlacer;
		
		
		
		// SKY VIEWER
		oSkyView.build();
		this.oSkyView = oSkyView;
		
		// GRAD BUILDER
		oGradBuilder.build();
		this.oGradBuilder = oGradBuilder;
		
		// FILEOPEN DIALOG
		oFileOpenDialog.build();
		oFileOpenDialog.addCommand('load', 'Load the selected file', this.load.bind(this));
		oFileOpenDialog.addCommand('cancel', 'Return to the previous screen', this.fodCancel.bind(this));
		oFileOpenDialog.addCommand('delete', 'Delete the selected file (if saved localy)', this.deleteLocalSaveFile.bind(this));
		this.oFileOpenDialog = oFileOpenDialog;
		
		// SPRITE SHEET EDITOR
		oSpriteSheetEditor.build();
		oSpriteSheetEditor.addCommand('Export', 'build a blueprint and export it to the object blueprint manager', this.exportSprite.bind(this));
		oSpriteSheetEditor.addCommand('Close', 'close the spritesheet editor and return to the grid view', this.viewObj.bind(this));
		this.oSpriteSheetEditor = oSpriteSheetEditor;

		
		// LINKING TO DOM
		$c0.append(oWorldGrid.getContainer())
			.append(oFileOpenDialog.getContainer());
			
			
		$c1.append(oWallTiles.getContainer())
			.append(oFlatTiles.getContainer())
			.append(oBlockBuilder.getContainer())
			.css({'width': '512px', 'max-width': '512px'});

		$c2.append(oWorldView.getContainer());
		
		$c3.append(oObjectBuilder.getContainer())
			.append(oObjectPlacer.getContainer())
			.css({'width': '512px', 'max-width': '512px'}).hide();
		
		$c4.append(oSkyView.getContainer())
			.append(oGradBuilder.getContainer())
			.css({'width': '512px', 'max-width': '512px'}).hide();

		
		$c5.append(oHelp.getContainer());

		$c6.append(oSpriteSheetEditor.getContainer())
			.css({'width': '512px', 'max-width': '512px'}).hide();
		
		this.showTab(1);

		// additionnal events
		$(document).bind('keydown', this.keydown.bind(this));
		$('input[type="text"]').bind('focus', (function() { this.bInsideInput = true; }).bind(this));
		$('input[type="text"]').bind('blur', (function() { this.bInsideInput = false; }).bind(this));
	},
	
	redrawGrid: function() {
		try {
			if (Object.keys(this.oLockReg).length) {
				return;
			}
			this.oWorldGrid.redraw();
		} catch (e) {
			// The resources have not been loaded yet.
		}
	},
	
	/** 
	 * Affiche l'ongle spécifé uniquement s'il ne dépasse pas la largeur de l'écran
	 * @param n onglet concerné
	 * @return bool true: onglets activé
	 */
	pleaseShowTab: function(n) {
		var c = this.oCells;
		var s = this.oStruct;
		var w = innerWidth;
		var cn = c.eq(n);
		if ((s.width() + cn.width()) < w) {
			cn.show();
			return true;
		} else {
			cn.hide();
			return false;
		}
	},
	
	/**
	 * Verifie la largeur finale de la structure
	 * en cas de dépassement de la largeur de l'écran
	 * on réduit la taille des case ou de la largeur de c0
	 */
	checkAndResizeGridWidth: function() {
		var sz = this.oWorldGrid.oScrollZone;
		var s = this.oStruct;
		var wSZ = sz.width();
		var w = innerWidth;
		var h = innerHeight;
		var nNewSZWidth = Math.max(this.MIN_GRID_WIDTH, Math.min(this.MAX_GRID_WIDTH, wSZ - s.width() + w));
		var nNewSZHeight = h - sz.position().top - 32;
		if (sz.width() != nNewSZWidth || sz.height() != nNewSZHeight) {
			sz.width(nNewSZWidth);
			sz.height(nNewSZHeight);
			if (nNewSZWidth < (18 * 32)) {
				this.changeGridSize(24);
			} else {
				this.changeGridSize(32);
			}
			this.redrawGrid();
		}
		this.xTimeoutResize = null;
	},
	
	changeGridSize: function(w) {
		if (w !== this.oCellFactory.nCellSize) {
			this.oCellFactory.reset();
			this.oCellFactory.nCellSize = w;
			this.oWorldGrid.setCellSize(w);
		}
	},
	
	/**
	 * Tag la région sélectionnée
	 */
	setRegionTag: function() {
		var sTag = prompt('enter new region tag');
		var s = this.oWorldGrid.oSelect;
		var t = this.oTagRegistry;
		if (sTag) {
			Marker.markBlock(t, s.x1, s.y1, s.x2, s.y2, sTag);
		} else {
			Marker.clearBlock(t, s.x1, s.y1, s.x2, s.y2);
		}
		this.redrawGrid();
	},

	/** 
	 * Active les onglets spécifiés
	 * Désactive les autres
	 * @param aMandatory liste des onglet necessaire
	 * @param aOptional liste de s onglets facultatif
	 * qui ne s'afficheront que si il y a de la place
	 */
	activateTabs: function(aMandatory, aOptional) {
		var c = this.oCells;
		c.hide();
		var w = 0;
		var ST = function(nItem, iIndex, aArray) {
			var oCell = c.eq(nItem);
			oCell.show();
			w += oCell.width();
		};
		var ST2 = (function(nItem, iIndex, aArray) {
			if (this.pleaseShowTab(nItem)) {
				var oCell = c.eq(nItem);
				w += oCell.width();
			}
		}).bind(this);
		aMandatory.forEach(ST);
		aOptional.forEach(ST2);
		this.nShownCellsWidth = w;
		if (this.xTimeoutResize) {
			clearTimeout(this.xTimeoutResize);
		}
		this.xTimeoutResize = setTimeout(this.checkAndResizeGridWidth.bind(this), 500);
	},
	
	/**
	 * Affiche l'onglet 1: (tiles) 2: (3d) ou 3:(objects) 4:(sky)
	 */
	showTab: function(n) {
		this.nTabShown = n;
		switch (n) {
			case 1: 
				// main tabs 0 1
				this.activateTabs([0, 1], [5]);
				break;
				
			case 2:
				// main tab 2
				this.activateTabs([2], [0]);
				break;
				
			case 3:
				// main tab 0 3
				this.activateTabs([0, 3], [5]);
				break;
				
			case 4:
				this.activateTabs([0, 4], [5]);
				break;
				
			case 6:
				this.activateTabs([6], []);
				break;
		}
	},
	
	resize: function() {
		this.showTab(this.nTabShown);
	},
	
	wallSelected: function(oSender, nMarker, nIndex, oCanvas) {
		switch (nMarker) {
			case 0:
				this.oBlockBuilder.drawWallLeft(oCanvas);
				$('input[name="left"]', this.oBlockBuilder.getForm()).val(nIndex);
				this.oBlockBuilder.cmd_save();
				break;
				
			case 1:
				this.oBlockBuilder.drawWallRight(oCanvas);
				$('input[name="right"]', this.oBlockBuilder.getForm()).val(nIndex);
				this.oBlockBuilder.cmd_save();
				break;
		}
		this.redrawGrid();
	},
	
	flatSelected: function(oSender, nMarker, nIndex, oCanvas) {
		switch (nMarker) {
			case 0:
				this.oBlockBuilder.drawFloor(oCanvas);
				$('input[name="floor"]', this.oBlockBuilder.getForm()).val(nIndex);
				this.oBlockBuilder.cmd_save();
				break;
				
			case 1:
				this.oBlockBuilder.drawCeil(oCanvas);
				$('input[name="ceil"]', this.oBlockBuilder.getForm()).val(nIndex);
				this.oBlockBuilder.cmd_save();
				break;
		}
		this.redrawGrid();
	},
	
	/**
	 * Entrée sélectionnée dans le block builder
	 */
	blockSelected: function(oSender) {
		this.oBlockBuilder.clear();
		var f = this.oBlockBuilder.getForm();
		var nLeft = $('input[name="left"]', f).val() || null;
		var nRight = $('input[name="right"]', f).val() || null;
		var nFloor = $('input[name="floor"]', f).val() || null;
		var nCeil = $('input[name="ceil"]', f).val() || null;
		this.lockGrid('blockSelect');
		this.oWallTiles.setMarker(0, nLeft);
		this.oWallTiles.setMarker(1, nRight);
		this.oFlatTiles.setMarker(0, nFloor);
		this.oFlatTiles.setMarker(1, nCeil);
		this.unlockGrid('blockSelect');
	},
	
	worldGridDrawCell: function(nCell, oContext, x , y, w, h) {
		var d = this.oBlockBuilder.getCode(nCell & 0xFF);
		var ud = this.oBlockBuilder.getCode((nCell & 0xFF00) >> 8);
		
		var c;
		var nMask = !!d ? 1 : 0;
		nMask |= !!ud ? 2 : 0;
		
		oContext.clearRect(x, y, w, h);
		switch (nMask) {
			case 0:
				// no code !!!
				// nothing to draw
				var wCell = this.oWorldGrid.wCell;
				oContext.fillStyle = 'rgb(220, 220, 220)';
				oContext.fillRect(x, y, wCell, wCell);
				oContext.strokeStyle = 'rgb(96, 96, 96)';
				oContext.strokeRect(x, y, wCell, wCell);
				break;
			
			case 1:
				// only lower level
				c = this.oCellFactory.getCellCanvas(d.left, d.right, d.floor, d.ceil, d.phys);
				oContext.drawImage(c, x, y);
				break;
				
			case 2:
				// only upper level
				c = this.oCellFactory.getCellCanvas(d.left, d.right, d.floor, d.ceil, d.phys);
				oContext.drawImage(c, 0, 0, c.width, c.height, x, y, w, h >> 1);
				break;

			case 3:
				// both level
				c = this.oCellFactory.getCellCanvas(d.left, d.right, d.floor, d.ceil, d.phys);
				oContext.drawImage(c, 0, 0, c.width, c.height, x, y + (h >> 1), w, h >> 1);
				c = this.oCellFactory.getCellCanvas(ud.left, ud.right, ud.floor, ud.ceil, ud.phys);
				oContext.drawImage(c, 0, 0, c.width, c.height, x, y, w, h >> 1);
				break;
		}
	},
	
	worldGridDrawed: function(oContext) {
		this.drawObjectsOnGrid();
		this.drawTagsOnGrid();
	},
	
	/**
	 * Rechercher l'objet correspondant à X Y
	 */
	worldGridClick: function(x, y) {
		var w = this.oWorldGrid.wCell;
		var x9 = Math.min(2, Math.floor((x % w) / (w / 3 | 0)));
		var y9 = 2 - Math.min(2, Math.floor((y % w) / (w / 3 | 0)));
		var p = y9 * 3 + x9 + 1;
		var r = this.oObjectRegistry;
		x = x / w | 0;
		y = y / w | 0;
		var o = null;
		if (r && y in r && x in r[y] && p in r[y][x]) {
			o = r[y][x][p];
			if (o) {
				this.oObjectPlacer.oList.val(o.val());
				this.oObjectPlacer.cmd_select();
			}
		}
	},

	////// DRAWING COMMANDS //////
	////// DRAWING COMMANDS //////
	////// DRAWING COMMANDS //////
	////// DRAWING COMMANDS //////
	////// DRAWING COMMANDS //////
	////// DRAWING COMMANDS //////

	/**
	 * Commande de remplissage de la zone selectionnée (premier étage)
	 */
	drawcmdBox1: function() {
		var sCode = this.oBlockBuilder.getSelectedOption().val();
		this.oWorldGrid.drawFullBox(sCode);
	},
	
	/**
	 * Commande de remplissage de la zone selectionnée (second étage)
	 */
	drawcmdBox2: function() {
		var sCode = this.oBlockBuilder.getSelectedOption().val();
		this.oWorldGrid.drawUpperFullBox(sCode);
	},
	
	
	
	keydown: function(oEvent) {
		if (this.bInsideInput) {
			return;
		}
		var nKey = oEvent.keyCode;
		switch (nKey) {
			////// MISC COMMANDS ////// MISC COMMANDS ////// MISC COMMANDS //////
			////// MISC COMMANDS ////// MISC COMMANDS ////// MISC COMMANDS //////
			////// MISC COMMANDS ////// MISC COMMANDS ////// MISC COMMANDS //////
			////// MISC COMMANDS ////// MISC COMMANDS ////// MISC COMMANDS //////
			////// MISC COMMANDS ////// MISC COMMANDS ////// MISC COMMANDS //////
			////// MISC COMMANDS ////// MISC COMMANDS ////// MISC COMMANDS //////
			case KEYS.ALPHANUM.I:
				this.oPopup.toggle('documents/about.html', 640, 480, false);
				break;
		
			////// DRAWING COMMANDS ////// DRAWING COMMANDS ////// DRAWING COMMANDS //////
			////// DRAWING COMMANDS ////// DRAWING COMMANDS ////// DRAWING COMMANDS //////
			////// DRAWING COMMANDS ////// DRAWING COMMANDS ////// DRAWING COMMANDS //////
			////// DRAWING COMMANDS ////// DRAWING COMMANDS ////// DRAWING COMMANDS //////
			////// DRAWING COMMANDS ////// DRAWING COMMANDS ////// DRAWING COMMANDS //////
			////// DRAWING COMMANDS ////// DRAWING COMMANDS ////// DRAWING COMMANDS //////
			// draw full box
			case KEYS.ALPHANUM.B:
				this.drawcmdBox1();
				break;

			// draw full upper box
			case KEYS.ALPHANUM.U:
				this.drawcmdBox2();
				break;
				
			////// EDIT COMMANDS ////// EDIT COMMANDS ////// EDIT COMMANDS //////
			////// EDIT COMMANDS ////// EDIT COMMANDS ////// EDIT COMMANDS //////
			////// EDIT COMMANDS ////// EDIT COMMANDS ////// EDIT COMMANDS //////
			////// EDIT COMMANDS ////// EDIT COMMANDS ////// EDIT COMMANDS //////
			////// EDIT COMMANDS ////// EDIT COMMANDS ////// EDIT COMMANDS //////
			////// EDIT COMMANDS ////// EDIT COMMANDS ////// EDIT COMMANDS //////
			
			// copy
			case KEYS.ALPHANUM.C:
				if (oEvent.ctrlKey) {
					this.oWorldGrid.cmd_copy();
				}
				break;

			// paste
			case KEYS.ALPHANUM.V:
				if (oEvent.ctrlKey) {
					this.oWorldGrid.cmd_paste();
				}
				break;
			
			// undo
			case KEYS.ALPHANUM.Z:
				if (oEvent.ctrlKey) {
					this.oWorldGrid.undoPop();
				}
				break;
				
			// clear area
			case KEYS.DELETE:
				this.oWorldGrid.clearFullBox();
				break;
				
			////// WORLD COMMAND ////// WORLD COMMAND ////// WORLD COMMAND //////
			////// WORLD COMMAND ////// WORLD COMMAND ////// WORLD COMMAND //////
			////// WORLD COMMAND ////// WORLD COMMAND ////// WORLD COMMAND //////
			////// WORLD COMMAND ////// WORLD COMMAND ////// WORLD COMMAND //////
			////// WORLD COMMAND ////// WORLD COMMAND ////// WORLD COMMAND //////
			////// WORLD COMMAND ////// WORLD COMMAND ////// WORLD COMMAND //////
			
			case KEYS.ALPHANUM.R:
				if (this.bRendering) {
					// stop rendering
					this.stopRender();
				} else {
					// start rendering
					this.startRender();
				}
				break;
				
		}
	},
	
	/**
	 * Démarrage du rendu 3D
	 */
	startRender: function() {
		try {
			this.bRendering = true;
			this.showTab(2);
			this.oHelp.getContainer().hide(); //load('documents/keys_3d.html');
			
			// config du game engine et du raycaster
			window.CONFIG = {
			  game: {
				interval: 40,         /* timer interval (ms)                */
				doomloop: 'interval', /* doomloop type "raf" or "interval"  */
				cpumonitor: false,     /* use CPU Monitor system            */
				fullscreen: false
			  },
			  raycaster: {
				canvas: 'screen',
				ghostVision: 0,
				drawMap: false,
				smoothTextures: false,
				zoom: 1,
				shades: 15
			  }
			};
			
			var oData = this.buildWorldDefinition();
			var oWorld = this.oWorldView;
			oWorld.oScript.html(JSON.stringify(oData, null, '  '));
			window.G = new RCWE.Game(oData);
		} catch (e) {
			this.error('An error occured while building world : <br />' + e.toString());
			this.exitRender();
		}
	},
	
	/** 
	 * Arret du rendu 3D
	 */
	stopRender: function() {
		this.oWorldView.cmd_stop();
	},

	/**
	 * Ce qu'il se passe lorsque le rendu se termine
	 */
	exitRender: function(o) {
		this.oHelp.getContainer().show(); //.load('documents/keys_grid.html');
		this.bRendering = false;
		this.review();
	},
		
	/**
	 * Créé une structure permettant la génération d'un world definition
	 * return object (walls, flats, metacodes)
	 */
	buildWorldDefinition: function() {
		var aBlockData = this.oBlockBuilder.getData();
		var i;
		var mc = {};
		for (i = 0; i < aBlockData.length; i += 3) {
			mc[aBlockData[i]] = aBlockData[i + 2];
		}
			
		var nCode, oCode, a, iAnim, iDelay, nCount, nDelay, nLeft, nRight, nFloor, nCeil;
		var aWalls = [], aFlats = [], oMetaCodes = {}, nMetaCode;
		for (var sCode in mc) {
			nCode = sCode | 0;
			oCode = mc[sCode];

			a = [];
			nCount = oCode.acnt | 0;
			nDelay = (oCode.adel | 0) + 1;
			nRight = oCode.right === '' ? null : oCode.right | 0;
			nLeft = oCode.left === '' ? null : oCode.left | 0;
			nFloor = oCode.floor === '' ? null : oCode.floor | 0;
			nCeil = oCode.ceil === '' ? null : oCode.ceil | 0;
			if (nCount == 0) {
				a.push(nLeft === null ? -1 : nLeft);
				a.push(nRight === null ? -1 : nRight);
			}
			for (iAnim = 0; iAnim < nCount; ++iAnim) {
				for (iDelay = 0; iDelay < nDelay; ++iDelay) {
					a.push(nLeft === null ? -1 : nLeft + iAnim);
					a.push(nRight === null ? -1 : nRight + iAnim);
				}
			}
			if (oCode.yoyo) {
				for (iAnim = nCount - 2; iAnim >= 0; --iAnim) {
					for (iDelay = 0; iDelay < nDelay; ++iDelay) {
						a.push(nLeft === null ? -1 : nLeft + iAnim);
						a.push(nRight === null ? -1 : nRight + iAnim);
					}
				}
			}
			aWalls[nCode] = a;

			a = [];
			a[0] = nFloor === null ? -1 : nFloor;
			a[1] = nCeil === null ? -1 : nCeil;
			aFlats[nCode] = a;

			nMetaCode = ((oCode.offs | 0) << 16) | ((oCode.phys | 0) << 8) | (nCode); 
			oMetaCodes[sCode] = nMetaCode;
		}
		var i;
		for (i = 0; i < aWalls.length; ++i) {
			if (aWalls[i] === undefined) {
				aWalls[i] = null;
			}
		}
		for (i = 0; i < aFlats.length; ++i) {
			if (aFlats[i] === undefined) {
				aFlats[i] = null;
			}
		}
		
		// world definition par defaut
		var wv = this.oWorldView;
		var D = {
			walls: {
				codes: aWalls,
				src: this.oWallTiles.oImage.attr('src')
			},
			map: this.oWorldGrid.getMap(oMetaCodes),
			tiles: {},
			blueprints: {},
			objects: [],
			visual: this.oGradBuilder.getVisual(),
			startpoint: { x: wv.xStart * 64 + 32, y: wv.yStart * 64 + 32, angle: wv.aStart }

		};
		if (this.oWorldGrid.hasUpperFloor()) {
			D.uppermap = this.oWorldGrid.getMap(oMetaCodes, true);
		}
		if (this.oFlatTiles.oImage.attr('src')) {
			D.flats = {
				codes: aFlats,
				src: this.oFlatTiles.oImage.attr('src')
			};
		}
		// ajout du ciel facultatif
		if (this.oSkyView.getSource()) {
			D.background = this.oSkyView.getSource();
		}
		
		// tiles
		D.tiles = this.oObjectBuilder.generateTiles();
		// blueprints
		D.blueprints = this.oObjectBuilder.generateBlueprints();
		// objects
		D.objects = this.oObjectPlacer.generateObjects(D.map);
		// tags
		D.tags = this.generateTagsData();
		D.decals = this.oObjectPlacer.generateDecals(D.map);

		
		// erreur ?
		if (!D.walls.src) {
			throw new Error('no texture defined for walls');
		}
		if ('flats' in D && (!D.flats.src)) {
			throw new Error('no texture defined for flats');
		}
		return D;
	},
	
	// Affiche la boite de dialogue "ouverture de ficheir"
	fodOpen: function() {
		this.oFileOpenDialog.open();
		this.oWorldGrid.getContainer().hide();
	},
	
	fodCancel: function() {
		this.oFileOpenDialog.close();
		this.oWorldGrid.getContainer().show();
	},
	
	deleteLocalSaveFile: function() {
		var sFile = this.oFileOpenDialog.getSelected();
		if (sFile) {
			if (localStorage.getItem('rcwe_file_' + sFile)) {
				if (confirm('Please confirm operation : Delete this file "' + sFile + '" ?')) {
					this.fodCancel();
					localStorage.removeItem('rcwe_file_' + sFile);
					localStorage.removeItem('rcwe_mfiletime_' + sFile);
					localStorage.removeItem('rcwe_thumbnail_' + sFile);
					this.fodOpen();
				}
			} else {
				this.error('You can\'t delete "' + sFile + '", this file is not stored on your computer.');
			}
		}
	},
	
	
	lockGrid: function(sName) {
		if (sName in this.oLockReg) {
			++this.oLockReg[sName];
		} else {
			this.oLockReg[sName] = 1;
		}
	},
	
	unlockGrid: function(sName) {
		if (sName in this.oLockReg) {
			--this.oLockReg[sName];
			if (this.oLockReg[sName] == 0) {
				delete this.oLockReg[sName];
			}
		}
		this.redrawGrid();
	},
	
	/**
	 * Verifie que les ressources sont bien chargées
	 */
	loadMonitor: function() {
		if (this.oWallTiles.bComplete && this.oFlatTiles.bComplete) {
			clearInterval(this.xIntervalLoad);
			this.xIntervalLoad = null;
			this.oCellFactory.reset();
			this.unlockGrid('loadMonitor');
		}
	},
	
	load: function() {
		// composer la fenètre de sélection
		var sFile = this.oFileOpenDialog.getSelected();
		this.fodCancel();
		if (sFile) {
			if (this.xIntervalLoad) {
				clearInterval(this.xIntervalLoad);
			}
			this.lockGrid('loadMonitor');
			this.xIntervalLoad = setInterval(this.loadMonitor.bind(this), 100);
			this.sWorldName = sFile;
			this.oBackup.load(sFile);
		}
	},
	
	save: function() {
		var sFile = prompt('Enter a file name', this.sWorldName);
		if (sFile) {
			this.sWorldName = sFile;
			this.oBackup.save(sFile, this.oWorldView.sScreenShot);
		}
	},
	
	/**
	 * Exporte une copie du niveau dans un projet
	 */
	exportGame: function(sProject, sLevel) {
		var oApp = this;
		$.post(
			'wp.php?p=' + sProject + '&l=' + sLevel, 
			JSON.stringify(this.buildWorldDefinition())
		).fail(function() {
			oApp.error('Could not export the project ' + sProject + '/' + sFile + ' on the server.');
		});
	},

	error: function(s) {
		this.oPopup.setClass('error');
		this.oPopup.display('Error', '<p>' + s + '</p>', 320, 240);
	},
	
	/**
	 * Dessine les tag sur la grille
	 */
	drawTagsOnGrid: function() {
		var x, y, sTag, aTag;
		var c = this.oWorldGrid.oContext;
		var wc = this.oWorldGrid.wCell;
		var nSize = this.oWorldGrid.aGrid.length;
		var t = this.oTagRegistry;
		c.fillStyle = 'rgb(255, 255, 0)';
		c.strokeStyle = 'rgb(0, 0, 0)';
		c.font = 'monospace 8px';
		c.textBaseline = 'top';
		for (y = 0; y < nSize; ++y) {
			for (x = 0; x < nSize; ++x) {
				sTag = Marker.getMarkXY(t, x, y);
				if (sTag) {
					c.save();
					c.beginPath();
					c.rect(x * wc, y * wc, wc, wc);
					c.clip();
					aTag = sTag.split(' ');
					c.strokeText(aTag[0], x * wc, y * wc);
					c.fillText(aTag[0], x * wc, y * wc);
					c.strokeText(aTag[1], x * wc, y * wc + 10);
					c.fillText(aTag[1], x * wc, y * wc + 10);
					c.restore();
				}
			}
		}
	},
	
	/**
	 * Génération de l'objet de Donnée des tags pour une exportation vers le raycaster
	 */
	generateTagsData: function() {
		var a = [], x, y, sTag;
		var t = this.oTagRegistry;
		var nSize = this.oWorldGrid.aGrid.length;
		for (y = 0; y < nSize; ++y) {
			for (x = 0; x < nSize; ++x) {
				sTag = Marker.getMarkXY(t, x, y);
				if (sTag) {
					a.push({x: x, y: y, tag: sTag});
				}
			}
		}
		return a;
	},
	
	drawObjectsOnGrid: function() {
		// dessiner les sprites
		var wgc = this.oWorldGrid.oContext;
		var wCell = this.oWorldGrid.wCell;
		var oRegistry = {};
		var aPosIndex = [[0, 0],
		                 [-1, 1],
		                 [0, 1],
		                 [1, 1],
		                 [-1, 0],
		                 [0, 0],
		                 [1, 0],
		                 [-1, -1],
		                 [0, -1],
		                 [1, -1]
		];
		$('option', this.oObjectPlacer.oList).each(function() {
			var $option = $(this);
			var x = $option.data('x');
			var y = $option.data('y');
			var nPadIndex = $option.data('padindex');
			if (!(y in oRegistry)) {
				oRegistry[y] = {};
			}
			if (!(x in oRegistry[y])) {
				oRegistry[y][x] = {};
			}
			oRegistry[y][x][nPadIndex] = $option;
			x = (x * wCell + (wCell >> 1)) + aPosIndex[nPadIndex][0] * ((wCell >> 1) - 4);
			y = (y * wCell + (wCell >> 1)) + aPosIndex[nPadIndex][1] * ((wCell >> 1) - 4);
			wgc.fillStyle = $option.is(':selected') ? 'rgb(255, 255, 255)' : 'rgb(0, 222, 255)';
			wgc.fillRect(x-2, y-2, 4, 4);
		});
		this.oObjectRegistry = oRegistry;
	},

	viewObj: function(oEvent) {
		if (this.bRendering) {
			this.stopRender();
		}
		this.nView = this.VIEW_OBJECTS;
		this.showTab(3);
		this.drawObjectsOnGrid();
	},
	
	viewWF: function(oEvent) {
		if (this.bRendering) {
			this.stopRender();
		}
		this.nView = this.VIEW_WALLSFLATS;
		this.showTab(1);
	},
	
	viewSky: function(oEvent) {
		if (this.bRendering) {
			this.stopRender();
		}
		this.nView = this.VIEW_SKY;
		this.showTab(4);
	},
	
	viewRend: function(oEvent) {
		if (!this.bRendering) {
			this.startRender();
		}
	},
	
	viewSprites: function(oEvent) {
		if (this.bRendering) {
			this.stopRender();
		}
		this.nView = this.VIEW_SPRITES;
		this.showTab(6);
	},

	review: function() {
		switch (this.nView) {
			case this.VIEW_OBJECTS:
				this.viewObj();
				break;
				
			case this.VIEW_WALLSFLATS:
				this.viewWF();
				break;

			case this.VIEW_SKY:
				this.viewSky();
				break;				
		}
	},
	
	objectAdded: function($option) {
		var $blueprint = this.oObjectBuilder.getSelectedOption();
		var x = this.oWorldGrid.oSelect.x1;
		var y = this.oWorldGrid.oSelect.y1;
		if ($blueprint && x !== null && y != null && !isNaN(x) && !isNaN(y)) {
			var nWidth = this.oObjectBuilder.oImage.width;
			var nFrames = this.oObjectBuilder.nFrames;
			var nSize;
			var nNow = Date.now() % 60000;
			var sId = nNow.toString(36);
			if (nFrames > 0) {
				nSize = nWidth / nFrames | 0;
			} else {
				nSize = 0;
			}
			$option.data({x: x, y: y, size: nSize >> 1, blueprint: $blueprint.html(), index: $blueprint.val()});
			$option.html($blueprint.html() + ' [' + x + ':' + y + '] ' + sId);
			return true;
		} else {
			this.error('Could not place the new object. Did you select a blueprint in the object builder and a valid location on the World grid ?');
			return false;
		}
	},
	
	objectSelected: function($option) {
		var s = this.oWorldGrid.oSelect;
		s.x1 = s.x2 = $option.data('x') | 0;
		s.y1 = s.y2 = $option.data('y') | 0;
		this.oObjectBuilder.setSelectedOption($option.data('index'));
		this.oObjectBuilder._updateCanvas();
		this.redrawGrid();
	},
	
	objectDeleted: function($option) {
		this.redrawGrid();
	},
	
	/**
	 * Lorsqu'on clique sur export du générateur de sprite
	 */ 
	exportSprite: function(oEvent) {
		try {
			this.oSpriteSheetEditor.exportBlueprint((function(d) {
				this.viewObj();
				var $option = this.oObjectBuilder.cmd_add('export_' + (Math.random() * 36 * 36 * 36 | 0).toString(36));
				$option.data('imgsrc', d.canvas.toDataURL())
					.data('frames', d.frames.length)
					.data('delay', 100);
				this.oObjectBuilder._oList.trigger('change');
			}).bind(this));
		} catch (e) {
			this.error(e);
		}
	},
	
	
	cmd_moveOneObject: function(o, dx, dy) {
		var nSize = this.oWorldGrid.getSize();
		var $option = $(o);
		var x = $option.data('x');
		var y = $option.data('y');
		var sBlueprint = $option.data('blueprint');
		x += dx;
		y += dy;
		if (x >= 0 && y >= 0 && x < nSize && y < nSize) {
			$option.data('x', x);
			$option.data('y', y);
			var sId = $option.html().split(' ').pop();
			$option.html(sBlueprint + ' [' + x + ':' + y + '] ' + sId);
		} else {
			$option.remove();
		}
	},
	
	cmd_moveObjects: function(dx, dy) {
		var nSize = this.oWorldGrid.getSize();
		$('option', this.oObjectPlacer.oList).each((function() {
			this.cmd_moveOneObject(this, dx, dy);
		}).bind(this));
		// bouger les tags
		var a = Marker.create();
		Marker.iterate(this.oTagRegistry, function(x, y, v) {
			if ((x + dx) >= 0 && (x + dx) < nSize && (y + dy) >= 0 && (y + dy) < nSize) {
				Marker.markXY(a, x + dx, y + dy, v);
			}
		});
		this.oTagRegistry = a;
		// déplacer le point de départ
		this.oWorldView.xStart += dx;
		this.oWorldView.yStart += dy;
		this.redrawGrid();
	},
	
	
	cmd_moveUp: function() {
		if (this.bRendering) {
			return;
		}
		var w = this.oWorldGrid;
		var aNew = [];
		for (var x = 0; x < w.getSize(); ++x) {
			aNew.push(0);
		}
		w.aGrid.push(aNew);
		w.aGrid.shift();
		this.cmd_moveObjects(0, -1);
		this.redrawGrid();
	},

	cmd_moveRight: function() {
		if (this.bRendering) {
			return;
		}
		var w = this.oWorldGrid;
		w.aGrid.forEach(function(r) {
			r.pop();
			r.unshift(0);
		});
		this.cmd_moveObjects(1, 0);
		this.redrawGrid();
	},

	cmd_moveDown: function() {
		if (this.bRendering) {
			return;
		}
		var w = this.oWorldGrid;
		var aNew = [];
		for (var x = 0; x < w.getSize(); ++x) {
			aNew.push(0);
		}
		w.aGrid.unshift(aNew);
		w.aGrid.pop();
		this.cmd_moveObjects(0, 1);
		this.redrawGrid();
	},

	cmd_moveLeft: function() {
		if (this.bRendering) {
			return;
		}
		var w = this.oWorldGrid;
		w.aGrid.forEach(function(r) {
			r.push(0);
			r.shift();
		});
		this.cmd_moveObjects(-1, 0);
		this.redrawGrid();
	},
	
	cmd_setStartPoint: function() {
		this.oWorldView.xStart = this.oWorldGrid.oSelect.x1;
		this.oWorldView.yStart = this.oWorldGrid.oSelect.y1;
	},
	
	// Manipulation d'objets
	cmd_manip: function(sCommand) {
		var x1 = this.oWorldGrid.oSelect.x1;
		var x2 = this.oWorldGrid.oSelect.x2;
		var y1 = this.oWorldGrid.oSelect.y1;
		var y2 = this.oWorldGrid.oSelect.y2;
		
		var mvobj = (function(o, dx, dy) {
			if (o) {
				this.cmd_moveOneObject(o, dx, dy);
				this.oWorldGrid.setSelect(x1 + dx, y1 + dy, x2 + dx, y2 + dy);
			}
		}).bind(this);
		
		var a = this.oObjectPlacer.getObjects(x1, y1, x2, y2);
		
		var oSelected = $('option:selected', this.oObjectPlacer.oList);
		if (oSelected.length) {
			oSelected = oSelected.get(0);
		} else {
			oSelected = null;
		}
		
		switch (sCommand) {
			case 'clear':
				if (confirm('delete ' + a.length + ' objects ?')) {
					$(a).remove();
				}
				break;
				
			case 'movedown': 
				a.forEach(function(o) {
					mvobj(o, 0, 1);
				});
				break;

			case 'moveup': 
				a.forEach(function(o) {
					mvobj(o, 0, -1);
				});
				break;

			case 'moveright': 
				a.forEach(function(o) {
					mvobj(o, 1, 0);
				});
				break;

			case 'moveleft': 
				a.forEach(function(o) {
					mvobj(o, -1, 0);
				});
				break;

			case 'move1down':
				mvobj(oSelected, 0, 1);
				break;

			case 'move1up': 
				mvobj(oSelected, 0, -1);
				break;

			case 'move1right': 
				mvobj(oSelected, 1, 0);
				break;

			case 'move1left': 
				mvobj(oSelected, -1, 0);
				break;
				
		}
		this.redrawGrid();
	},
	
	cmd_help: function() {
		this.oPopup.toggle('documents/about.html', 640, 480, false);
	}
});
