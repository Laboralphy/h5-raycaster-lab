/* globals RCWE */

O2.createClass('RCWE.Application', {

	oStructure: null,
	oCellFactory: null,
	oMapGrid: null,
	oBlockEditor: null,
	oBlockBrowser: null,
	oSkyEditor: null,
	oGame: null,
	oWorldViewer: null,
	oThingBrowser: null,
	oThingEditor: null,
	oPopupWindow: null,
	oFileOpenDialog: null,
	oThingGrid: null,
	oHintBox: null,
	oAdvancedPad: null,
	oTemplateLoader: null,
	oStartPointLocator: null,
	oFileImportDialog: null,
	
	oMediator: null,
	
	sMode: null, // last opened tab
	oCurrentWindow: null,
	
	bRendering: false,
	
	__construct: function() {
		this.oMediator = new O876.Mediator.Mediator();
		this.oMediator.setApplication(this);
		this.oCellFactory = new RCWE.CellFactory();
		this.buildStructure($('body').get(0));
		$(document).bind('keydown', this.cmd_keydown.bind(this));
	},


	buildStructure: function(oRoot) {
		var $structure = $(
		'<table class="o876structure window main">' +
		'	<tbody>' +
		'		<tr class="floatingHeight">' +
		'			<td class="c10">' +
		'				<div>' +
		'				</div>' +
		'			</td>' +
		'			<td class="c11">' +
		'				<div>' +
		'				</div>' +
		'			</td>' +
		'		</tr>' +
		'	</tbody>' +
		'</table>');
		$(oRoot).append($structure);
		this.oStructure = {
			d00: $('td.c00 > div', $structure),
			d10: $('td.c10 > div', $structure),
			d11: $('td.c11 > div', $structure),
			d20: $('td.c20 > div', $structure)
		};
		
		var pAction = this.cmd_action.bind(this);
		
		
		var oMapGrid = new RCWE.LabyGrid();
		oMapGrid.build();
		oMapGrid.setSize('100%', '100%');
		oMapGrid.setGridSize(32);
		oMapGrid.onAction = pAction;
		oMapGrid.onClick = this.cmd_labygrid_click.bind(this);
		this.linkWidget('d10', oMapGrid);		
		
		var nD11Width = 480;
		
		var oBlockEditor = new RCWE.BlockEditor();
		oBlockEditor.build();
		oBlockEditor.setSize(nD11Width, '100%');
		oBlockEditor.onAction = pAction;
		this.linkWidget('d11', oBlockEditor);

		var oBlockBrowser = new RCWE.BlockBrowser();
		oBlockBrowser.build();
		oBlockBrowser.setSize(nD11Width, '100%');
		oBlockBrowser.onAction = pAction;
		this.linkWidget('d11', oBlockBrowser);
		
		var oSkyEditor = new RCWE.SkyEditor();
		oSkyEditor.build();
		oSkyEditor.setSize(nD11Width, '100%');
		oSkyEditor.onAction = pAction;
		this.linkWidget('d11', oSkyEditor);
		
		var oWorldViewer = new RCWE.WorldViewer();
		oWorldViewer.build();
		oWorldViewer.setSize('100%', '100%');
		oWorldViewer.onAction = pAction;
		oWorldViewer.getContainer().hide();
		this.linkWidget('d10', oWorldViewer);
		
		var oThingBrowser = new RCWE.ThingBrowser();
		oThingBrowser.build();
		oThingBrowser.setSize(nD11Width, '100%');
		oThingBrowser.onAction = pAction;
		this.linkWidget('d11', oThingBrowser);
		
		var oThingEditor = new RCWE.ThingEditor();
		oThingEditor.build();
		oThingEditor.setSize(nD11Width, '100%');
		oThingEditor.onAction = pAction;
		this.linkWidget('d11', oThingEditor);
		
		var oFileOpenDialog = new RCWE.FileOpenDialog();
		oFileOpenDialog.build();
		oFileOpenDialog.setSize('100%', '100%');
		oFileOpenDialog.onAction = pAction;
		oFileOpenDialog.hide();
		this.linkWidget('d10', oFileOpenDialog);
		
		var oFileImportDialog = new RCWE.FileImportDialog();
		oFileImportDialog.build();
		oFileImportDialog.setSize('100%', '100%');
		oFileImportDialog.onAction = pAction;
		oFileImportDialog.hide();
		this.linkWidget('d10', oFileImportDialog);

		var oTemplateLoader = new RCWE.TemplateLoader();
		oTemplateLoader.build();
		oTemplateLoader.setSize(nD11Width, '100%');
		oTemplateLoader.onAction = pAction;
		oTemplateLoader.hide();
		this.linkWidget('d11', oTemplateLoader);

		var oStartPointLocator = new RCWE.StartPointLocator();
		oStartPointLocator.build();
		oStartPointLocator.setSize(nD11Width, '100%');
		oStartPointLocator.onAction = pAction;
		oStartPointLocator.hide();
		this.linkWidget('d11', oStartPointLocator);
		
		var oHintBox = new RCWE.HintBox();
		oHintBox.onAction = pAction;
		oHintBox.build();
		$('body').append(oHintBox.getContainer());
		
		var oAdvancedPad = new RCWE.AdvancedPad();
		oAdvancedPad.build();
		oAdvancedPad.setSize(nD11Width, '100%');
		oAdvancedPad.onAction = pAction;
		this.linkWidget('d11', oAdvancedPad);
				
		var oThingGrid = new RCWE.ThingGrid();
		this.oThingGrid = oThingGrid;
		
		this.oHintBox = oHintBox;
		this.oMapGrid = oMapGrid;
		this.oBlockEditor = oBlockEditor;
		this.oBlockBrowser = oBlockBrowser;
		this.oSkyEditor = oSkyEditor;
		this.oWorldViewer = oWorldViewer;
		this.oThingBrowser = oThingBrowser;
		this.oThingEditor = oThingEditor;
		this.oFileOpenDialog = oFileOpenDialog;
		this.oFileImportDialog = oFileImportDialog;
		this.oAdvancedPad = oAdvancedPad;
		this.oTemplateLoader = oTemplateLoader;
		this.oStartPointLocator = oStartPointLocator;
		
		// set the level display grid size
		this.setLabyGridSize(32);
		
		$('.o876window', this.oStructure.d11).hide();
		this.showPanel('blockbrowser');
		oMapGrid.onDraw = this.labyGridDrawCell.bind(this);
		oMapGrid.onDrawOver = this.labyGridDrawOver.bind(this);
		this.redrawMap();
		this.resizeWindow();
		
		var oHintBox = new RCWE.HintBox();
		$('body').append(oHintBox.getContainer());
		
		var $popup = $('<div class="popup"></div>');
		$('body').append($popup);
		var oPopup = new RCWE.Window();
		oPopup.build('Popup');
		$popup.append(oPopup.getContainer());
		oPopup.getBody().append('<div class="message"></div>');
		$popup.data('popup', oPopup);
		this.oPopupWindow = $popup;
		this.oPopupWindow.hide();
		$(document).on('mousedown', (function(oEvent) {
			if (this.oPopupWindow.is(':visible') && !this.oPopupWindow.hasClass('noclose')) {
				this.hidePopup();
				oEvent.stopPropagation();
				oEvent.preventDefault();
				return false;
			}
		}).bind(this));
		this.loadPlugins();
	},
	
	loadPlugins: function() {
		var oParams = O876.ParamGetter.parse();
		if (!('plugins' in oParams)) {
			return;
		}
		var sPlugins = oParams.plugins;
		var aPlugins = sPlugins.split(' ');
		aPlugins.forEach(function(s) {
			if (s in RCWE.Plugin) {
				this.oMediator.addPlugin(new RCWE.Plugin[s]());
			}
		}, this);
	},
	
	sendPluginSignal: function() {
		this.oMediator.sendPluginSignal.apply(this.oMediator, Array.prototype.slice.call(arguments, 0));
	},

	popup: function(sTitle, sMessage, sClass, pAfter) {
		// strip all class but popup
		var p = this.oPopupWindow;
		p.attr('class').split(' ').forEach(function(s) {
			if (s != 'popup') {
				p.removeClass(s);
			}
		});
		// add class
		p.addClass(sClass);
		$('h1', p).html(sTitle);
		var oPopup = p.data('popup');
		var $div = $('div.message', oPopup.getBody());
		$div.html(sMessage);
		p.fadeIn('fast', pAfter);
	},

	hidePopup: function() {
		this.oPopupWindow.fadeOut('fast');
	},

	error: function(sError) {
		this.popup('Error', sError, 'error');
	},

	/**
	 * Set the current visible panel name
	 * Application behaviour may change slightly according to this value
	 * @param string s panel name
	 */
	setVisiblePanel: function(s) {
		this.sMode = s.toLowerCase();
	},
	
	/**
	 * Get the current visible panel name
	 * Application behaviour may change slightly according to this value
	 * return string, panel name
	 */
	getVisiblePanel: function() {
		return this.sMode;
	},
	
	/**
	 * Check if the current visible panel name is equal to the specified value
	 * Application behaviour may change slightly according to this value
	 * return bool
	 */
	isVisiblePanel: function(s) {
		return this.getVisiblePanel() == s;
	},
	
	
	/**
	 * Change the left-panel displayed widget
	 */
	showPanel: function(sPanel) {
		if (this.oCurrentWindow && ('hide' in this.oCurrentWindow)) {
			this.oCurrentWindow.hide();
		}
		this.setVisiblePanel(sPanel);
		switch (this.getVisiblePanel()) {
			case 'blockbrowser':
				this.oMapGrid.setSelectFlag(true);
				this.oBlockBrowser.show();
				this.oCurrentWindow = this.oBlockBrowser;
			break;

			case 'blockeditor':
				this.oMapGrid.setSelectFlag(false);
				this.oBlockEditor.showEdit();
				this.oCurrentWindow = this.oBlockEditor;
			break;

			case 'blockbuilder':
				this.oMapGrid.setSelectFlag(false);
				this.oBlockEditor.showNew();
				this.oCurrentWindow = this.oBlockEditor;
			break;

			case 'skyeditor':
				this.oMapGrid.setSelectFlag(false);
				this.oSkyEditor.show();
				this.oCurrentWindow = this.oSkyEditor;
			break;

			case 'thingbrowser':
				this.oMapGrid.setSelectFlag(false);
				this.oThingBrowser.show();
				this.oCurrentWindow = this.oThingBrowser;
			break;

			case 'thingeditor':
				this.oMapGrid.setSelectFlag(false);
				this.oThingEditor.show();
				this.oCurrentWindow = this.oThingEditor;
			break;
			
			case 'advancedpad':
				this.oMapGrid.setSelectFlag(false);
				this.oAdvancedPad.show();
				this.oCurrentWindow = this.oAdvancedPad;
			break;
			
			case 'blocktemplateloader':
				this.oMapGrid.setSelectFlag(false);
				this.oTemplateLoader.show('block');
				this.oCurrentWindow = this.oTemplateLoader;
			break;
			
			case 'thingtemplateloader':
				this.oMapGrid.setSelectFlag(false);
				this.oTemplateLoader.show('thing');
				this.oCurrentWindow = this.oTemplateLoader;
			break;
			
			case 'startpointlocator': 
				this.oMapGrid.setSelectFlag(false);
				this.oStartPointLocator.show();
				this.oCurrentWindow = this.oStartPointLocator;
			break;
		}
	},
	
	showMainScreen: function(s) {
		switch (s) {
			case 'map':
				this.oFileImportDialog.hide();
				this.oFileOpenDialog.hide();
				//---
				this.oMapGrid.show();
			break;

			case 'fileopen':
				this.oMapGrid.hide();
				this.oFileImportDialog.hide();
				//---
				this.oFileOpenDialog.show();
			break;
				
			case 'fileimport':
				this.oMapGrid.hide();
				this.oFileOpenDialog.hide();
				//---
				this.oFileImportDialog.show();
			break;
		}
	},
	
	/**
	 * Set the laby grid size in pixel
	 */
	setLabyGridSize: function(w) {
		this.oThingGrid.setProportions(w);
		
		var cf = this.oCellFactory;
		cf.setItemSize(w, w);
		
		var tg = this.oThingGrid;
		tg._wCell = w;
		
		var mg = this.oMapGrid;
		mg.setCellSize(w);
		this.redrawMap();
	},
	
	/**
	 * Called by the map grid
	 * This function must draw the content of a cell on the specified
	 * 2d-context.
	 * @param int nCode cell code (must be interpreted)
	 * @param Context2D oContext canvas context to be used
	 * @param int x position X of the top-left corner of the region to be drawed (in pixels)
	 * @param int y position Y of the top-left corner of the region to be drawed (in pixels)
	 * @param int wCell width of the cell (in pixels)
	 * @param int hCell height of the cell (in pixels)
	 */
	labyGridDrawCell: function(nCode, oContext, x, y, wCell, hCell) {
		var fAlphaFloor = 0.5;
		var nLowerCode = nCode & 0xFF;
		var nUpperCode = (nCode >> 8) & 0xFF;
		var oBlock, oCanvas;
		var nFloor = this.oMapGrid.getSelectedFloor();
		oContext.clearRect(x, y, wCell, hCell);
		if (nUpperCode) {
			oBlock = this.oBlockBrowser.getBlock(nLowerCode);
			oCanvas = this.oCellFactory.getFactorizedItem(oBlock);
			oContext.globalAlpha = nLowerCode > 0 && nFloor == 2 ? fAlphaFloor : 1;
			oContext.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, x, y + (hCell >> 1), wCell, hCell >> 1);
			oBlock = this.oBlockBrowser.getBlock(nUpperCode);
			oCanvas = this.oCellFactory.getFactorizedItem(oBlock);
			oContext.globalAlpha = nFloor == 1 ? fAlphaFloor : 1;
			oContext.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, x, y, wCell, hCell >> 1);
		} else {
			oBlock = this.oBlockBrowser.getBlock(nLowerCode);
			oCanvas = this.oCellFactory.getFactorizedItem(oBlock);
			oContext.globalAlpha = nLowerCode > 0 && nFloor == 2 ? fAlphaFloor : 1;
			oContext.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, x, y, wCell, hCell);
		}
		oContext.globalAlpha = 1;
		var oThing = this.oThingBrowser.getSelectedThing();
		var sThingId = oThing ? oThing.getData('id') : '';
		this.oThingGrid.renderCell(oContext, x, y, wCell, hCell, sThingId);
	},
	
	labyGridDrawOver: function(oContext) {
	},
	
	redrawThings: function() {
		this.oThingGrid.render(this.oMapGrid.oContext);
	},
	
	redrawMap: function(x1, y1, x2, y2) {
		this.oMapGrid.redraw(x1, y1, x2, y2);
	},
	
	/**
	 * Links the specified widget in the application DOM structure
	 * @param sSection section of the application DOM structure
	 * @param w instance of widget
	 */
	linkWidget: function(sSection, w) {
		this.oStructure[sSection].append(w.getContainer());
	},

	/**
	 * This function is called when the window is resized by user's action
	 */
	resizeWindow: function() {
		if (this.oMapGrid) {
			var $canvas = $(this.oMapGrid.oCanvas);
			var $scrollzone = this.oMapGrid.oScrollZone;
			$canvas.hide();
			$scrollzone.width('');
			var w = $canvas.parent().width();
			$canvas.show();
			$scrollzone.width(w);
		}
	},

	cmd_action: function() {
		var aArgs = Array.prototype.slice.call(arguments, 0);
		var sAction = aArgs.shift();
		var sController = 'cmd_' + sAction.replace(/\./g, '_');
		if (sController in this) {
			this[sController].apply(this, aArgs);
		} else {
			throw new Error('invalid controller : ' + sController);
		}
	},

	////// CONTROLLERS SECTION ////// CONTROLLERS SECTION ////// CONTROLLERS SECTION //////
	////// CONTROLLERS SECTION ////// CONTROLLERS SECTION ////// CONTROLLERS SECTION //////
	////// CONTROLLERS SECTION ////// CONTROLLERS SECTION ////// CONTROLLERS SECTION //////

	// BLOCK EDITOR
	cmd_blockeditor_done: function() {
		var be = this.oBlockEditor;
		var bb = this.oBlockBrowser;
		var oBlock = bb.getSelectedBlock();
		if (oBlock) {
			be.exportBlock(oBlock);
			bb.importBlock(oBlock);
		}
		this.redrawMap();
		this.showPanel('blockBrowser');
	},

	cmd_blockeditor_cancel: function() {
		var bb = this.oBlockBrowser;
		var oBlock = bb.getSelectedBlock();
		if (oBlock && oBlock.isEmpty()) {
			this.oBlockBrowser.destroyBlockImage(bb.getSelectedBlockImage());
		}
		this.showPanel('blockBrowser');
	},
	
	cmd_blockeditor_deletetile: function(id) {
		var n = this.oBlockBrowser.getTileUsage(id);
		var sInfo = '';
		if (n) {
			sInfo = 'This tile is used by ' + n + ' block' + (n > 1 ? 's' : '') + '. ';
		} else {
			sInfo = 'This tile is not used by any block. ';
		}
		if (confirm(sInfo + 'Delete this tile ?')) {
			this.oBlockBrowser.deleteTileRef(id);
			this.oBlockEditor.deleteTile(id);
			this.oCellFactory.reset();
			this.redrawMap();
		}
	},


	// ADVANCED PAD
	// ADVANCED PAD
	// ADVANCED PAD
	

	
	// BLOCK BROWSER
	// BLOCK BROWSER
	// BLOCK BROWSER
	cmd_blockbrowser_editblock: function() {
		var be = this.oBlockEditor;
		var bb = this.oBlockBrowser;
		var oBlock = bb.getSelectedBlock();
		be.importBlock(oBlock);
		this.showPanel('blockEditor');
	},
	
	cmd_blockbrowser_newblock: function() {
		var be = this.oBlockEditor;
		var bb = this.oBlockBrowser;
		var oBlock = bb.getSelectedBlock();
		be.importBlock(oBlock);
		this.showPanel('blockBuilder');
	},
	
	cmd_blockbrowser_selectblock: function() {
		$('#mapgrid_cmd_draw').trigger('click');
		this.oMapGrid.unselect();
	},
	
	cmd_blockbrowser_deleteblock: function(oBlock) {
		var nBlockCode = oBlock.getData('id') | 0;
		this.oMapGrid.iterateGrid(function(x, y, nCode) {
			var nLower = nCode & 0xFF;
			var nUpper = (nCode & 0xFF00) >> 8;
			if (nLower == nBlockCode) {
				nCode = nCode & 0xFF00;
			}
			if (nUpper == nBlockCode) {
				nCode = nCode & 0xFF;
			}
			return nCode;
		});
	},
	
	cmd_blockbrowser_loadtemplate: function() {
		this.showPanel('blocktemplateloader');
	},


	// HINT BOX
	// HINT BOX
	// HINT BOX
	cmd_hintbox_remove: function(x, y) {
		this.oThingGrid.removeThing(x, y);
		if (this.oHintBox.isFixed()) {
			this.oHintBox.unfix();
		}
		this.redrawMap(x / 3 | 0, y / 3 | 0, x / 3 | 0, y / 3 | 0);
	},
	
	cmd_hintbox_select: function(x, y) {
		if (this.oHintBox.isFixed()) {
			this.oHintBox.unfix();
		}
		var sThing = this.oThingGrid.getThing(x, y);
		if (sThing) {
			this.oThingBrowser.selectThingImage($('#thing_' + sThing));
		}
	},
	
	

	// LABY GRID
	// LABY GRID
	// LABY GRID
	cmd_labygrid_cellsize: function(w) {
		if (w < 16) {
			W.error('The grid cells have reached their minimum size. Could not shrink the cells anymore.');
		} else if (w > 32) {
			W.error('The grid cells have reached their maximum size. Could not enlarge the cells anymore.');
		} else {
			this.setLabyGridSize(w);
		}
	},

	cmd_labygrid_setstart: function(x, y, angle) {
		this.oWorldViewer.xStart = null;
		this.oWorldViewer.yStart = null;
		this.oWorldViewer.aStart = null;
	},
	
	cmd_labygrid_mouserest: function(x, y) {
		if (this.isVisiblePanel('thingbrowser')) {
			this.cmd_thingbrowser_hintbox();
		}
	},

	cmd_labygrid_mouseunrest: function(x, y) {
		this.oHintBox.hide();
	},
	
	cmd_labygrid_click: function(x, y) {
		if (this.isVisiblePanel('thingbrowser')) {
			this.cmd_thingbrowser_gridclick(x, y);
		} else if (this.isVisiblePanel('startpointlocator')) {
			this.cmd_startpointlocator_gridclick(x, y);
		}
	},
	
	cmd_labygrid_paint1: function() {
		var oBlock = this.oBlockBrowser.getSelectedBlock();
		if (oBlock) {
			var id = oBlock.getData('id');
			this.oMapGrid.drawFullBox(id);
		} else {
			this.oMapGrid.unselect();
			this.redrawMap();
		}
	},
	
	cmd_labygrid_paint2: function() {
		var oBlock = this.oBlockBrowser.getSelectedBlock();
		if (oBlock) {
			var id = oBlock.getData('id');
			this.oMapGrid.drawUpperFullBox(id);
		} else {
			this.oMapGrid.unselect();
			this.redrawMap();
		}
	},
	
	cmd_labygrid_select: function() {
	},
	
	cmd_labygrid_draw: function() {
		var nFloor = this.oMapGrid.getSelectedFloor();
		switch (nFloor) {
			case 1:
				this.cmd_labygrid_paint1(); 
				break;
				
			case 2:
				this.cmd_labygrid_paint2(); 
				break;
				
			case 3: 
				this.cmd_labygrid_paint1(); 
				this.cmd_labygrid_paint2(); 
				break;
		}
		this.oMapGrid.unselect();
	},
	
	cmd_labygrid_clear: function() {
		var nFloor = this.oMapGrid.getSelectedFloor();
		switch (nFloor) {
			case 1:
				this.oMapGrid.clearFullBox();
				break;
				
			case 2:
				this.oMapGrid.clearUpperFullBox();
				break;
				
			case 3: 
				this.oMapGrid.clearFullBox();
				this.oMapGrid.clearUpperFullBox();
				break;
		}
		this.oMapGrid.unselect();
	},
	
	cmd_labygrid_load: function() {
		this.showMainScreen('fileopen');
	},
	
	cmd_labygrid_save: function() {
		var sFile;
		if (this.oFileOpenDialog.sLastOpened != '') {
			sFile = this.oFileOpenDialog.sLastOpened
			if (confirm('Save file "' + sFile + '" ?')) {
				this.saveLevelFile(sFile);
				return;
			}
		} 
		sFile = window.prompt('Enter file name.');
		if (sFile !== undefined && sFile !== null && sFile !== '' ) {
			this.oFileOpenDialog.sLastOpened = sFile;
			this.saveLevelFile(sFile);
			return;
		}
	},
	
	cmd_labygrid_viewblock: function() {
		this.showPanel('blockbrowser');
	},
	
	cmd_labygrid_viewsky: function() {
		this.showPanel('skyeditor');
	},
	
	cmd_labygrid_viewthing: function() {
		this.showPanel('thingbrowser');
	},
	
	cmd_labygrid_viewstartpoint: function() {
		this.showPanel('startpointlocator');
	},
	
	cmd_labygrid_view3d: function() {
		this.oHintBox.unfix();
		try {
			console.group('view3d');
			console.time('serialize');
			var oData = this.serialize();
			console.timeEnd('serialize');
			console.time('build level data');
			var oAdapter = new RCWE.RCDataBuilder();
			var oLevelData = oAdapter.buildLevelData(oData);
			console.timeEnd('build level data');
			console.time('showing game screen');
			this.oMapGrid.getContainer().hide();
			this.oWorldViewer.getContainer().show();

			this.bRendering = true;
			
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
			
			var oWorld = this.oWorldViewer;
			console.timeEnd('showing game screen');
			console.time('printing script');
			//oWorld.oScript.html(JSON.stringify(oLevelData, null, '  '));
			console.timeEnd('printing script');
			console.time('starting game');
			oWorld.startGame(oLevelData);
			console.timeEnd('starting game');
			console.groupEnd('view3d');
		} catch (e) {
			console.log(e.stack);
			this.error('<b>Raycaster Engine Error :</b> ' + e.message);
		}
	},
	
	cmd_labygrid_viewadvanced: function() {
		this.showPanel('advancedpad');
	},
	


	// WORLD VIEWER
	// WORLD VIEWER
	// WORLD VIEWER
	cmd_worldviewer_stop: function() {
		this.bRendering = false;
		this.oWorldViewer.hide();
		this.oMapGrid.show();
		$(window).trigger('resize');
	},
	
	cmd_worldviewer_error: function(sError) {
		this.cmd_worldviewer_stop();
		this.error('<b>Raycaster Engine Error :</b> ' + sError);
	},
	


	// FILE OPEN DIALOG
	// FILE OPEN DIALOG
	// FILE OPEN DIALOG
	cmd_fileopendialog_close: function() {
		this.showMainScreen('map');
	},

	cmd_fileopendialog_load: function(sFile) {
		this.showMainScreen('map');
		this.loadLevelFile(sFile);
	},
	
	cmd_fileopendialog_loadremote: function(sFile) {
		this.showMainScreen('map');
		this.loadLevelFile(sFile, true);
	},
	
	cmd_fileopendialog_cantdelete: function() {
		this.error('You can\'t delete this file : it\'s a public file hosted on the server. It is not stored on your browser local storage.');
	},
	
	
	// FILE IMPORT DIALOG
	// FILE IMPORT DIALOG
	// FILE IMPORT DIALOG
	cmd_fileimportdialog_load: function(sFile) {
		this.showMainScreen('map');
		this.showPanel('blockbrowser');		
		this.importLevel(sFile);
	},

	cmd_fileimportdialog_close: function() {
		this.showMainScreen('map');
		this.showPanel('blockbrowser');		
	},
	
	
	// THING BROWSER
	// THING BROWSER
	// THING BROWSER
	cmd_thingbrowser_newthing: function() {
		var tb = this.oThingBrowser;
		var te = this.oThingEditor;
		var oThing = tb.getSelectedThing();
		te.importThing(oThing);
		this.showPanel('thingEditor');
	},
	
	cmd_thingbrowser_editthing: function() {
		var tb = this.oThingBrowser;
		var te = this.oThingEditor;
		var oThing = tb.getSelectedThing();
		te.importThing(oThing);
		this.showPanel('thingEditor');
	},
	
	cmd_thingbrowser_removething: function(nId) {
		this.oThingGrid.removeAll(nId);
		this.redrawMap();
		this.redrawThings();
	},
	
	cmd_thingbrowser_selectthing: function() {
		if (this.oThingBrowser.getSelectedThing()) {
			this.redrawMap();
		} else {
			this.redrawThings();
		}
	},
	
	cmd_thingbrowser_gridclick: function(x, y) {
		if (this.oHintBox.isFixed()) {
			this.oHintBox.unfix();
			return;
		}
		var oThing = this.oThingBrowser.getSelectedThing();
		if (oThing) {
			var wCell = this.oMapGrid.wCell;
			var xTh = x * 3 / wCell | 0;
			var yTh = y * 3 / wCell | 0;
			if (this.oThingGrid.hasThing(xTh, yTh)) {
				this.cmd_thingbrowser_hintbox(true);
			} else {
				this.oThingGrid.addThing(xTh, yTh, oThing.getData('id'));
				this.redrawMap(x / wCell | 0, y / wCell | 0, x / wCell | 0, y / wCell | 0);
			}
		}
	},
	
	cmd_thingbrowser_hidehintbox: function() {
		if (this.oHintBox.isFixed()) {
			this.oHintBox.unfix();
		} else {
			this.oHintBox.hide();
		}
	},

	cmd_thingbrowser_loadtemplate: function() {
		this.showPanel('thingtemplateloader');
	},
	/**
	 * Will display a hint box show what Thing is currently pointed by the mouse cursor
	 * Will no nothing if nothing is pointed
	 */
	cmd_thingbrowser_hintbox: function(bFix) {
		if (this.oHintBox.isFixed()) {
			return;
		}
		var mg = this.oMapGrid;
		var xm = mg.xMouse;
		var ym = mg.yMouse;
		var x3 = xm * 3 / mg.wCell | 0;
		var y3 = ym * 3 / mg.wCell | 0;
		
		var sThing = this.oThingGrid.getThing(x3, y3);
		if (!sThing) {
			return;
		}
		
		var oThing = this.oThingBrowser.getThing(sThing);
		if (!oThing) {
			throw new Error('there is no such thing : #thing_' + sThing);
		}
		
		var xp = mg.xPage;
		var yp = mg.yPage;
		var wScreen = innerWidth;
		var hScreen = innerHeight;
		var bX = xp > (wScreen >> 1);
		var bY = yp > (hScreen >> 1);
		var h = this.oHintBox;
		var nPad = 16;
		
		var sMeth = !!bFix ? 'fix' : 'show';
		
		switch ((bY ? 2 : 0) | (bX ? 1 : 0)) {
			case 0: // top left
				h[sMeth](xp + nPad, yp + nPad);
				break;
				
			case 1: // top right
				h[sMeth](xp - h.getWidth() - nPad, yp + nPad);
				break;
				
			case 2: // bottom left
				h[sMeth](xp + nPad, yp - h.getHeight() - nPad);
				break;
				
			case 3: // bottom right
				h[sMeth](xp - h.getWidth() - nPad, yp - h.getHeight() - nPad);
				break;
		}

		oThing.render(h.getCanvas());
		h.setThingXY(x3, y3);
	},
	
	// THING EDITOR
	// THING EDITOR
	// THING EDITOR
	cmd_thingeditor_cancel: function() {
		var tb = this.oThingBrowser;
		var oThing = tb.getSelectedThing();
		if (oThing && oThing.isEmpty()) {
			tb.cmd_removeThing();
		}
		this.showPanel('thingBrowser');
	},

	cmd_thingeditor_done: function() {
		var te = this.oThingEditor;
		var tb = this.oThingBrowser;
		var oThing = tb.getSelectedThing();
		var oCanvas = tb.getSelectedThingImage().get(0);
		te.exportThing(oThing);
		oThing.render(oCanvas);
		this.showPanel('thingBrowser');
	},
	
	// TEMPLATE LOADER
	cmd_templateloader_close: function() {
		switch (this.sMode) {
			case 'blocktemplateloader':
				this.showPanel('blockbrowser');
			break;
			
			case 'thingtemplateloader':
				this.showPanel('thingbrowser');
			break;
			
			default:
				throw new Error('invalide mode');
		}
	},
	
	cmd_templateloader_loadtemplate: function(sTemp, sType) {
		this.importTemplate(sTemp, sType);
		switch (sType) {
			case 'block':
				this.showPanel('blockbrowser');
			break;
			
			case 'thing':
				this.showPanel('thingbrowser');
			break;
		}
	},
	
	
	
	// ADVANCED PAD
	// ADVANCED PAD
	// ADVANCED PAD
	
	cmd_advancedpad_shiftmap: function(sDir, n) {
		try {
			for (var i = 0; i < n; ++i) {
				this.oMapGrid.shiftGrid(sDir, 1);
				this.oThingGrid.shiftThingPosition(sDir, 1);
			}
		} catch (e) {
			this.error('could not shift ' + sDir + ' the level : ' + e.message);
		}
		this.redrawMap();
	},
	
	cmd_advancedpad_blockreplace: function(nFrom, aTo) {
		this.oMapGrid.iterateGrid(function(x, y, nCode) {
			var nLower = nCode & 0xFF;
			var nUpper = (nCode >> 8) & 0xFF;
			
			if (nLower == nFrom) {
				nLower = MathTools.rndChoose(aTo);
			}
			if (nUpper == nFrom) {
				nUpper = MathTools.rndChoose(aTo);
			}
			return (nUpper << 8) | nLower;
		});
	},

	/**
	 * The advanced pad : build game, is now displayed
	 * feeding the form with the game name
	 */
	cmd_advancedpad_requestname: function() {
		$('#adv_gname').val(this.oFileOpenDialog.sLastOpened);
	},
	
	cmd_advancedpad_buildgame: function() {
		this.popup('Message', '<p>Please wait while the game is being built...</p>', 'noclose');
		// génération du script raycaster
		var oData = this.serialize();
		var oAdapter = new RCWE.RCDataBuilder();
		var oLevelData = oAdapter.buildLevelData(oData);
		// options
		var oOptions = {
			gn: $('#adv_gname').val(),
			fs: $('#adv_gofull').prop('checked') ? 1 : 0,
			fc: $('#adv_gofps').prop('checked') ? 1 : 0,
			st: $('#adv_gosmooth').prop('checked') ? 1 : 0
		};
		// make param string
		var aOptions = [];
		for (var iOpt in oOptions) {
			aOptions.push(iOpt + '=' + oOptions[iOpt]);
		}
		var sOptions = '&' + aOptions.join('&');
		// envoi du script
		$.post('services/?action=adv.game' + sOptions, JSON.stringify(oLevelData), (function(data) {
			if (data.substr(0, 5) === 'error') {
				this.error(data);
			} else {
				this.popup('Message', data, 'noclose');
			}
		}).bind(this));
	},
	
	cmd_advancedpad_importlevel: function() {
		//window.prompt('filename');
		this.showMainScreen('fileimport');
	},
	
	// startingpointlocator
	
	cmd_startpointlocator_gridclick: function(x, y) {
		this.oMapGrid.cmd_setStartPoint(x / this.oMapGrid.wCell | 0, y / this.oMapGrid.wCell | 0);
	},
	
	cmd_startpointlocator_turnccw: function() {
		this.oMapGrid.cmd_setStartPointAngle(-Math.PI / 8);
	},
	
	cmd_startpointlocator_turncw: function() {
		this.oMapGrid.cmd_setStartPointAngle(Math.PI / 8);
	},
	
	////// END OF CONTROLLERS SECTION ////// END OF CONTROLLERS SECTION //////
	////// END OF CONTROLLERS SECTION ////// END OF CONTROLLERS SECTION //////
	////// END OF CONTROLLERS SECTION ////// END OF CONTROLLERS SECTION //////
	
	cmd_keydown: function(oEvent) {
		if (this.bInsideInput) {
			return;
		}
		var nKey = oEvent.keyCode;
		var bCtrl = oEvent.ctrlKey;
		switch (nKey) {
			////// EDIT COMMANDS ////// EDIT COMMANDS ////// EDIT COMMANDS //////
			////// EDIT COMMANDS ////// EDIT COMMANDS ////// EDIT COMMANDS //////
			////// EDIT COMMANDS ////// EDIT COMMANDS ////// EDIT COMMANDS //////
			
			// copy
			case KEYS.ALPHANUM.C:
				if (bCtrl) {
					this.oMapGrid.cmd_copy();
				}
				break;

			// paste
			case KEYS.ALPHANUM.V:
				if (bCtrl) {
					this.oMapGrid.cmd_paste();
				}
				break;
			
			// undo
			case KEYS.ALPHANUM.Z:
				if (bCtrl) {
					this.oMapGrid.undoPop();
				}
				break;
				
			// clear area
			case KEYS.DELETE:
				this.cmd_labygrid_clear();
				break;
		}
	},

	saveLevelFile: function(sName) {
		try {
			this.exportLevelTemplate(sName);
		} catch (e) {
			this.error('could not write file "' + sName + '" : ' + e.message);
		}
	},
	
	loadLevelFile: function(sName, bRemote) {
		var pDataReceived = (function(data) {
			this.unserialize(data.level);
			this.oWorldViewer.sScreenShot = RCWE.CONST.PATH_TEMPLATES + '/levels/' + sName + '/thumbnail.png';
			this.showPanel('blockBrowser');
			this.hidePopup();
		}).bind(this);
			
		var pLoad = function() {
			$.getJSON(RCWE.CONST.PATH_TEMPLATES + '/levels/' + sName + '/template.json', pDataReceived);
		};
		
		this.popup('Message', 'Loading online level, please wait...', '', pLoad);
	},
	
	serialize: function() {
		return {
			tiles: this.oBlockEditor.serialize(),
			blocks: this.oBlockBrowser.serialize(),
			grid: this.oMapGrid.serialize(),
			visuals: this.oSkyEditor.serialize(),
			blueprints: this.oThingBrowser.serialize(),
			things: this.oThingGrid.serialize()
		};
	},

	unserialize: function(oData) {
		this.oBlockEditor.unserialize(oData.tiles, (function() {
			this.oBlockBrowser.unserialize(oData.blocks);
			this.oMapGrid.unserialize(oData.grid);
			this.oCellFactory.reset();
			this.oSkyEditor.unserialize(oData.visuals);
			this.oThingBrowser.unserialize(oData.blueprints);
			this.oThingGrid.unserialize(oData.things);
			this.redrawMap();
		}).bind(this));
	},
	
	exportBlockTemplate: function() {
		var PNGSIGN = 'data:image/png;base64,';
		var sName = window.prompt('enter template name');
		var oExport = {
			name: sName,
			tiles: this.oBlockEditor.serialize(),
			blocks: this.oBlockBrowser.serialize(),
			thumbnail: this.oWorldViewer.sScreenShot.substr(PNGSIGN.length)
		};
		var sData = JSON.stringify(oExport);
		$.post('services/?action=block.post', sData, (function(data) {
		}).bind(this)).fail((function(data) {
			this.error(data.responseText);
		}).bind(this));
	},
	
	exportThingTemplate: function() {
		var PNGSIGN = 'data:image/png;base64,';
		var sName = window.prompt('enter template name');
		var oExport = {
			name: sName,
			things: this.oThingBrowser.serialize(),
			thumbnail: this.oWorldViewer.sScreenShot.substr(PNGSIGN.length)
		};
		var sData = JSON.stringify(oExport);
		$.post('services/?action=thing.post', sData, (function(data) {
			this.popup('Message', 'Export "' + sName + '" complete.');
		}).bind(this)).fail((function(data) {
			this.error(data.responseText);
		}).bind(this));
	},
	
	exportLevelTemplate: function(sName) {
		var PNGSIGN = 'data:image/png;base64,';
		if (!sName) {
			sName = window.prompt('enter template name');
		}
		var oExport = {
			name: sName,
			level: this.serialize(),
			thumbnail: this.oWorldViewer.sScreenShot.substr(PNGSIGN.length)
		};
		var sData = JSON.stringify(oExport);
		$.post('services/?action=level.post', sData, (function(data) {
			this.popup('Message', 'Export "' + sName + '" complete.');
		}).bind(this))
		.fail((function(data) {
			this.error(data.responseText);
		}).bind(this));
	},
	
	importTemplateData: function(data, pEnd) {
		if ('tiles' in data) {
			this.oMapGrid.resetGridContent();
			// modify ids
			// get new ids
			var oNewWallIds = this.oBlockEditor.submitNewIds(data.tiles.walls.ids);
			var oNewFlatIds = this.oBlockEditor.submitNewIds(data.tiles.flats.ids);
			// change ids for walls and flats
			data.tiles.walls.ids = data.tiles.walls.ids.map(function(id) { return oNewWallIds[id]; });
			data.tiles.flats.ids = data.tiles.flats.ids.map(function(id) { return oNewFlatIds[id]; });
			// get the highest block id
			var nBlockId = this.oBlockBrowser.getHighestBlockId();
			// change tile ids inside blocks
			data.blocks.forEach(function(b) {
				b.id = ++nBlockId;
				if (b.floor in oNewFlatIds) {
					b.floor = oNewFlatIds[b.floor];
				}
				if (b.ceil in oNewFlatIds) {
					b.ceil = oNewFlatIds[b.ceil];
				}
				if (b.right in oNewWallIds) {
					b.right = oNewWallIds[b.right];
				}
				if (b.left in oNewWallIds) {
					b.left = oNewWallIds[b.left];
				}
			});
			this.oBlockEditor.unserialize(data.tiles, (function() {
				this.oBlockBrowser.unserialize(data.blocks, true);
				if (pEnd) {
					pEnd();
				}
			}).bind(this), true);
		}
		if ('things' in data) {
			this.oThingGrid.reset();
			this.oThingBrowser.unserialize(data.things);
			this.redrawMap();
		}
	},
	
	importTemplate: function(sName, sType) {
		this.popup('Message', 'Loading ' + sType + ' template : "' + sName + '".<br/>Please wait...', 'noclose');
		$.ajax({
			dataType: 'json',
			url: RCWE.CONST.PATH_TEMPLATES + '/' + sType + 's/' + sName + '/template.json',
			success: (function(data) {
				this.importTemplateData(data, this.hidePopup.bind(this));
				this.hidePopup();
			}).bind(this)
		}).fail((function() {
			this.error('Could not load ' + sType + ' template : "' + sName + '"');
		}).bind(this));
	},
	
	importLevel: function(sMap) {
		var pDataReceived = (function(data) {
			this.unserialize(data);
			//this.oWorldViewer.sScreenShot = RCWE.CONST.PATH_TEMPLATES + '/levels/' + sName + '/thumbnail.png';
			this.showPanel('blockBrowser');
			this.hidePopup();
		}).bind(this);
			
		var pLoad = function() {
			$.getJSON('services/?action=import.import&l=' + sMap, pDataReceived);
		};
		
		this.popup('Message', 'Importing level, please wait...', '', pLoad);
	},
});
