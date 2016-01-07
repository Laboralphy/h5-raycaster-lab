O2.extendClass('RCWE.BlockEditor', RCWE.Window, {
	
	TILE_HEIGHT_WALL: 96,
	TILE_HEIGHT_FLAT: 64,
	TILE_WIDTH: 64,

	_id: 'blockeditor',

	_oStructure: null,
	_oDragDrop: null,
	_oForm: null,
	_oInfo: null,
	_oAnimationData: null,
	
	_aDescriptions: {
		0: 'A walkable block with only ceil and floor texture.',
		1: 'A solid wall with opaque textures. One cannot see through this type of block',
		2: 'A wall which can be seen through (like a window or a half collapsed wall)',
		3: 'A door which can be open in different ways',
		4: 'A secret wall ; can be pushed to reveal secret passage',
		5: 'A solid wall with opaque textures, with the shape of an alcove. The offset parameter defines the alcove depth',
		6: 'An invisible wall, one can see throught it but none shall walk over this type of block'
	},
	
	build: function() {
		__inherited('Block editor');
		this._oDragDrop = new O876.DragDrop();
		this.getContainer().addClass('BlockEditor');
		var wCanvas = this.TILE_WIDTH << 1;
		var hCanvas = this.TILE_HEIGHT_WALL + (this.TILE_HEIGHT_FLAT << 1);
		var $structure = $(
			'<table class="o876structure">' + 
				'<tbody>' + 
					'<tr class="builder"><td><div class="hint">Select the type of the new block.</div></td></tr>' + 
					'<tr class="editor"><td class="editor"></td></tr>' + 
					'<tr class="tiles"><td class="tilesSection"><h1>Wall tiles</h1></td></tr>' + 
					'<tr class="tiles"><td class="toolbar tilesToolbar"></td></tr>' + 
					'<tr class="tiles floatingHeight floatingWidth">' + 
						'<td><div>' +
							'<div data-tileheight="' + this.TILE_HEIGHT_WALL + '" class="tilesContainer wall">' +
							'</div>' +
							'<div data-tileheight="' + this.TILE_HEIGHT_FLAT + '" class="tilesContainer flat">' +
							'</div>' +
						'</div></td>' +
					'</tr>' + 
				'</tbody>' +
			'</table>'
		);
		
		var $buildPad = $('tr.builder > td', $structure);
		


		// builder commands
		this.addCommand('Cancel', 'Cancel the block creation', this.cmd_cancel.bind(this)).addClass('builder');

		// editor commands
		this.addCommand('<span style="color: #080">✔</span> Done', 'Save changes and close this window', this.cmd_done.bind(this)).addClass('editor');
		this.addCommand('<b>↵</b> Cancel', 'Close this window without changing anything', this.cmd_cancel.bind(this)).addClass('editor');
		
		this.getBody().append($structure);
		this._oStructure = $structure;
		this._addTilesCommand('◧', 'View wall tiles', this.cmd_wallTilesClick.bind(this)).addClass('command wall');
		this._addTilesCommand('⬒', 'View flat tiles', this.cmd_flatTilesClick.bind(this)).addClass('command flat');
		
		this._getTilesToolbar().imageLoader({
			load: this.cmd_load.bind(this),
			loadHTML: '<button type="button" title="Load image"><span style="color: #00A">✚</span> Add</button>'
		});
		this._addTilesCommand('<span style="color: #A00">✖</span> Del.', 'Delete the selected tile', this.cmd_deleteTile.bind(this));
		this._showTilesContainer('wall');
		
		var oTileDropZone = $('<table class="tiledropzones">' + 
			'<tbody>' + 
				'<tr>' + 
					'<td class="dropzone wall left"><div>X wall<button class="clearTile">✖</button></div><canvas width="' + this.TILE_WIDTH + '" height="' + this.TILE_HEIGHT_WALL + '"></canvas></td>' + 
					'<td class="dropzone flat ceil"><div>ceil<button type="button" class="clearTile">✖</button></div><canvas width="' + this.TILE_WIDTH + '" height="' + this.TILE_HEIGHT_FLAT + '"></canvas></td>' + 
					'<td class="dropzone wall right"><div>Y wall<button type="button" class="clearTile">✖</button></div><canvas width="' + this.TILE_WIDTH + '" height="' + this.TILE_HEIGHT_WALL + '"></canvas></td>' + 
				'</tr>' +
				'<tr>' + 
					'<td class="dropzone wall left2"><div>X wall<button class="clearTile">✖</button></div><canvas width="' + this.TILE_WIDTH + '" height="' + this.TILE_HEIGHT_WALL + '"></canvas></td>' + 
					'<td class="dropzone flat floor"><div>floor<button type="button" class="clearTile">✖</button></div><canvas width="' + this.TILE_WIDTH + '" height="' + this.TILE_HEIGHT_FLAT + '"></canvas></td>' +
					'<td class="dropzone wall right2"><div>Y wall<button type="button" class="clearTile">✖</button></div><canvas width="' + this.TILE_WIDTH + '" height="' + this.TILE_HEIGHT_WALL + '"></canvas></td>' + 
				'</tr>' + 
			'</tbody>' + 
		'</table>');
		
		$('button.clearTile', oTileDropZone).attr('title', 'Clear this tile').on('click', this.cmd_clearTile.bind(this));
		
		$('td.editor', this._oStructure).append(oTileDropZone);
		this._oDragDrop.setDroppableEntities($('.dropzone', this._oStructure));
		this._oDragDrop.onDrop = this.cmd_dd_drop.bind(this);
		this._oDragDrop.onReleaseItem = this.cmd_dd_cancel.bind(this);
		this._oDragDrop.onDragItem = this.cmd_dd_start.bind(this);
		
		var $form = $('<form></form>');
		
		var aTypes = ['walkable', 'solid', 'transparent', 'door', 'secret', 'alcove', 'blocking'];
		var $types = $('<select name="blocktype"></select>');
		aTypes.forEach(function(sOption, i) { 
			var $button = $('<button data-blocktype="' + i + '" type="button" title="' + this._aDescriptions[i] +'"><img/><div>' + sOption + '<div></button>');
			$('img', $button).attr('src', 'images/b_' + sOption + '.png');
			$buildPad.append($button);
			$types.append('<option value="' + i + '">' + sOption + '</option>'); 
		}, this);
		$buildPad.on('click', this.cmd_buildType.bind(this));
		
		var $table = $('<table></table>');
		var $tbody = $('<tbody></tbody>');
		var $tr;

		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('type :');
		$('td', $tr).append($types);
		$tbody.append($tr);
		
		aTypes = ['slide up', 'slide down', 'slide left', 'slide right', 'slide double', 'curtain'];
		$types = $('<select name="doortype"></select>');
		aTypes.forEach(function(sOption, i) { $types.append('<option value="' + i + '">' + sOption + '</option>'); });
		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('door :');
		$('td', $tr).append($types);
		$tbody.append($tr);

		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('offset :');
		$('td', $tr).append('<input name="offset" type="number" min="0" max="64" step="4" value="0"/>');
		$tbody.append($tr);
		
		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('frames :');
		$('td', $tr).append('<input name="frames" type="number" min="1" max="99" step="1" value="1"/>');
		$tbody.append($tr);
		
		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('delay :');
		$('td', $tr).append('<input name="delay" type="number" min="40" max="8800" step="40" value="160"/>');
		$('td', $tr).append('ms');
		$tbody.append($tr);

		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('yoyo :');
		$('td', $tr).append('<input name="yoyo" type="checkbox"/>');
		$tbody.append($tr);

		$table.append($tbody);
		$form.append($table);
		
		this._oForm = $form;
		
		
		$('table.tiledropzones', this._oStructure).after($form);
		var oInfo = $('<div></div>');
		$form.after(oInfo);
		this._oInfo = oInfo;


		$('select[name="blocktype"]', $form).change(this.cmd_blockTypeChange.bind(this)).trigger('change');
		$('input[name="frames"], input[name="delay"], input[name="yoyo"]', $form).change(this.cmd_startAnimation.bind(this));
		
		this.getToolBar().append('<span id="block_id"></span>');
	},
	
	show: function() {
		__inherited();
		this.cmd_startAnimation();
	},
	
	hide: function() {
		__inherited();
		this.cmd_stopAnimation();
		this._oAnimationData = null;
	},
	
	/**
	 * Display the window : New block mode
	 */ 
	showNew: function() {
		// hide editor
		$('tr.editor, button.editor', this.oStructure).hide();
		// hide tiles
		$('tr.tiles', this.oStructure).hide();
		// show builder
		$('tr.builder, button.builder', this.oStructure).show();
		this.show();
	},

	/**
	 * Display the window : Block edit mode
	 */ 
	showEdit: function() {
		// hide builder
		$('tr.builder, button.builder', this.oStructure).hide();
		// show editor and tiles
		$('tr.editor, button.editor', this.oStructure).show();
		$('tr.tiles', this.oStructure).show();
		this.show();
	},

	_getRenderCanvas: function() {
		return $('canvas.render', this._oStructure);
	},

	_getRenderContext: function() {
		return this._getRenderCanvas().get(0).getContext('2d');
	},

	_getTilesToolbar: function() {
		return $('.tilesToolbar', this._oStructure);
	},
	
	_getTileById: function(sId) {
		if (!!sId) {
			var $tile = $('#' + sId);
			if ($tile.length) {
				return $tile;
			}
		}
		return null;
	},

	/**
	 * Erase wall and flat data from block
	 */
	resetBlock: function(oBlock) {
		this._serializeKeys.forEach((function(k) {
			this._setBlockData(k, '');
		}).bind(this));
	},
	

	_getBlockData: function(sData) {
		switch(sData) {
			case 'walls':
				return this._exportWallTiles();
				
			case 'flats':
				return this._exportFlatTiles();

			case 'ceil':
			case 'floor':
			case 'left':
			case 'right':
			case 'left2':
			case 'right2':
				return $('td.dropzone.' + sData, this._oStructure).data('tile');
				
			case 'type':
				return $('[name="blocktype"]', this._oForm).val() | 0;
				
			case 'yoyo':
				return $('[name="yoyo"]', this._oForm).prop('checked');
				
			case 'doortype':
			case 'offset':
			case 'frames':
			case 'delay':
				return $('[name="' + sData + '"]', this._oForm).val() | 0;
		}			
	},
	
	_setBlockData: function(sData, value) {
		switch(sData) {
			case 'walls':
				this._importWallTiles(value);
				break;
				
			case 'flats':
				this._importFlatTiles(value);
				break;

			case 'ceil':
			case 'floor':
			case 'left':
			case 'right':
			case 'left2':
			case 'right2':
				if (value) {
					var $tile = this._getTileById(value);
					if ($tile.length) {
						this.cmd_dd_drop($('td.dropzone.' + sData, this._oStructure).get(0), $tile.get(0));
					}
				} else {
					var $canvas = $('td.dropzone.' + sData + ' canvas', this._oStructure);
					$canvas.get(0).getContext('2d').clearRect(0, 0, $canvas.prop('width'), $canvas.prop('height')); 
				}
				break;
				
			case 'yoyo':
				$('[name="yoyo"]', this._oForm).prop('checked', !!value).trigger('change');
				break;
				
			case 'type':
				$('[name="blocktype"]', this._oForm).val(value.toString()).trigger('change');
				break;
				
			case 'doortype':
			case 'offset':
			case 'frames':
			case 'delay':
				$('[name="' + sData + '"]', this._oForm).val(value.toString()).trigger('change');
				break;
		}			
	},



	_getWallTile: function(n) {
		return $('canvas.tile.wall', this._oStructure).get(n);
	},

	_getFlatTile: function(n) {
		return $('canvas.tile.flat', this._oStructure).get(n);
	},

	/**
	 * Show tiles of a given type, either "wall" or "flat"
	 * @param string sType type of tile
	 */
	_showTilesContainer: function(sType) {
		$('.tilesSection > h1', this._oStructure).html(sType + ' tiles');
		$('.tilesContainer', this._oStructure).hide();
		$('.tilesContainer.' + sType, this._oStructure).show();
		$('button.command.selected', this._oStructure).removeClass('selected');
		$('button.command.' + sType, this._oStructure).addClass('selected');
	},
	
	/**
	 * Returns the tiles container currently displayed
	 */
	_getCurrentTilesContainer: function() {
		return $('.tilesContainer:visible', this._oStructure);
	},
	
	/**
	 * Append a command button in the tile toolbar
	 * @param sCaption string displayed caption in the button
	 * @param sHint text of hint
	 * @param pOnClick callback function triggered when clicked
	 * @return created object
	 */
	_addTilesCommand: function(sCaption, sHint, pOnClick, sId) {
		var b = $('<button type="button"></button>');
		b.html(sCaption);
		b.attr('title', sHint);
		b.bind('click', pOnClick);
		if (sId) {
			b.attr('id', sId);
		}
		this._getTilesToolbar().append(b);
		return b;
	},	
	
	_animationProc: function() {
		var a = this._oAnimationData;
		var nFrames = a.frames;
		var nStartLeft = a.left;
		var nStartRight = a.right;
		var nStartLeft2 = a.left2;
		var nStartRight2 = a.right2;
		var iAnimation = a.i;
		var iDir = a.iDir;
		var bYoyo = a.yoyo;
		if (a.left !== null) {
			a.ctx_left.drawImage(this._getWallTile(nStartLeft + iAnimation), 0, 0);
		}
		if (a.right !== null) {
			a.ctx_right.drawImage(this._getWallTile(nStartRight + iAnimation), 0, 0);
		}
		if (a.left2 !== null) {
			a.ctx_left2.drawImage(this._getWallTile(nStartLeft2 + iAnimation), 0, 0);
		}
		if (a.right2 !== null) {
			a.ctx_right2.drawImage(this._getWallTile(nStartRight2 + iAnimation), 0, 0);
		}
		if (bYoyo) {
			if (iDir > 0 && iAnimation + iDir >= nFrames) {
				iDir = -1;
				a.iDir = iDir;
			} else if (iDir < 0 && iAnimation + iDir < 0) {
				iDir = 1;
				a.iDir = iDir;
			}
			a.i = iAnimation + iDir;
		} else {
			a.i = (iAnimation + 1) % nFrames;
		}
		if (!this.getContainer().is(':visible')) {
			this.cmd_stopAnimation();
		}
	},
	
	/**
	 * Append specified textures into one image
	 */
	_exportTiles: function($tiles) {
		if ($tiles.length === 0) {
			return null;
		}
		var $canvas = $('<canvas></canvas>');
		var nWidth = this.TILE_WIDTH * $tiles.length;
		var oCanvas = $canvas.get(0);
		oCanvas.width = nWidth;
		oCanvas.height = $tiles[0].height;
		var oContext = oCanvas.getContext('2d');
		var x = 0;
		var aIds = [];
		$tiles.each(function() {
			oContext.drawImage(this, x, 0);
			x += this.width;
			aIds.push($(this).attr('id'));
		});
		return {
			ids: aIds,
			tiles: oCanvas.toDataURL()
		};
	},

	/**
	 * Append all wall textures into one image
	 */
	_exportWallTiles: function() {
		return this._exportTiles($('.tilesContainer.wall canvas.tile', this._oStructure));
	},

	/**
	 * Append all flat textures into one image
	 */
	_exportFlatTiles: function() {
		return this._exportTiles($('.tilesContainer.flat canvas.tile', this._oStructure));
	},
	
	
	/**
	 * Triggered when "done" button is clicked
	 * close the editor, committing the changes made
	 */
	cmd_done: function() {
		this.doAction('done');
	},

	/**
	 * Triggered when "cancel" button is clicked
	 * close the editor discarding the changes made
	 */
	cmd_cancel: function() {
		this.doAction('cancel');
	},
	
	

	cmd_startAnimation: function() {
		this.cmd_stopAnimation(); // stop previous animation
		if (this._getBlockData('frames') > 1) {
			var nLeft = this._getBlockData('left');
			var nRight = this._getBlockData('right');
			var nLeft2 = this._getBlockData('left2');
			var nRight2 = this._getBlockData('right2');
			if (!!nLeft) {
				nLeft = this._getTileById(nLeft).index();
			}
			if (!!nRight) {
				nRight = this._getTileById(nRight).index();
			}
			if (!!nLeft2) {
				nLeft2 = this._getTileById(nLeft2).index();
			}
			if (!!nRight2) {
				nRight2 = this._getTileById(nRight2).index();
			}
			this._oAnimationData = {
				frames: this._getBlockData('frames'),
				left: nLeft,
				right: nRight,
				left2: nLeft2,
				right2: nRight2,
				delay: this._getBlockData('delay'),
				yoyo: this._getBlockData('yoyo'),
				i: 0,
				iDir: 1,
				timer: null,
				ctx_right: $('td.dropzone.right canvas', this._oStructure).get(0).getContext('2d'),
				ctx_left: $('td.dropzone.left canvas', this._oStructure).get(0).getContext('2d'),
				ctx_right2: $('td.dropzone.right2 canvas', this._oStructure).get(0).getContext('2d'),
				ctx_left2: $('td.dropzone.left2 canvas', this._oStructure).get(0).getContext('2d')
			};
			this._oAnimationData.timer = window.setInterval(this._animationProc.bind(this), this._oAnimationData.delay);
		}
	},
	
	/**
	 * Stop wall animation
	 * and reset left and right tile to original state
	 */
	cmd_stopAnimation: function() {
		var a = this._oAnimationData;
		if (a && a.timer) {
			window.clearInterval(a.timer);
			a.timer = null;
			var oLeft = null, oRight = null, oLeft2 = null, oRight2 = null;
			if (a.left !== null) {
				oLeft = this._getWallTile(a.left);
				a.ctx_left.drawImage(oLeft, 0, 0);
			}
			if (a.right !== null) {
				oRight = this._getWallTile(a.right);
				a.ctx_right.drawImage(oRight, 0, 0);
			}
			if (a.left2 !== null) {
				oLeft2 = this._getWallTile(a.left2);
				a.ctx_left2.drawImage(oLeft2, 0, 0);
			}
			if (a.right2 !== null) {
				oRight2 = this._getWallTile(a.right2);
				a.ctx_right2.drawImage(oRight2, 0, 0);
			}
			a.i = 0;
		}
	},

	cmd_blockTypeChange: function(oEvent) {
		var $tr = $('tr', this._oForm);
		var $tiles = $('td.dropzone', this._oStructure).removeClass('disabled');
		$tr.hide();
		$tr.eq(0).show();
		switch (oEvent.target.value | 0) {
			case 0: // walkable
				$('td.dropzone.left, td.dropzone.right, td.dropzone.left2, td.dropzone.right2', this._oStructure).addClass('disabled');
				break;

			case 3: // door
				$tr.eq(1).show();
				$tr.eq(3).show();
				$tr.eq(4).show();
				$tr.eq(5).show();
				break;
			
			case 1: // solid
				$('td.dropzone.ceil, td.dropzone.floor', this._oStructure).addClass('disabled');
				// fallthrough
			
			case 4: // secret
				$tr.eq(3).show();
				$tr.eq(4).show();
				$tr.eq(5).show();
				break;

			case 2: // transparent
			case 5: // offsetted
				$tr.eq(2).show();
				$tr.eq(3).show();
				$tr.eq(4).show();
				$tr.eq(5).show();
				break;

			case 6:
				$('td.dropzone.left, td.dropzone.right, td.dropzone.left2, td.dropzone.right2', this._oStructure).addClass('disabled');
				break;
		}
		this._oInfo.html(this._aDescriptions[oEvent.target.value]);
		this.cmd_startAnimation();
	},


	cmd_clearTile: function(oEvent) {
		var $target = $(oEvent.target);
		var $td = $target.parent().parent();
		var oCanvas = $target.parent().next().get(0);
		var oContext = oCanvas.getContext('2d');
		$td.data('tile', null);
		this.cmd_startAnimation();
		oContext.clearRect(0, 0, oCanvas.width, oCanvas.height);
	},
	
	/**
	 * Tile is starting to be dragged
	 */
	cmd_dd_start: function(oItem) {
		var $item = $(oItem);
		var bITWall = $item.hasClass('wall');
		var bITFlat = $item.hasClass('flat');
		if (bITWall) {
			$('td.dropzone.wall', this._oStructure).addClass('active');
			$('td.dropzone.flat', this._oStructure).addClass('denied');
		}
		if (bITFlat) {
			$('td.dropzone.flat', this._oStructure).addClass('active');
			$('td.dropzone.wall', this._oStructure).addClass('denied');
		}
	},
	
	cmd_dd_cancel: function() {
		$('td.dropzone', this._oStructure).removeClass('active').removeClass('denied');
	},
	

	cmd_dd_drop: function(oDropZone, oItem) {
		var $dz = $(oDropZone);
		if ($dz.hasClass('dropzone') && ($dz.hasClass('wall') || $dz.hasClass('flat'))) {
			this.cmd_dd_drop_tile(oDropZone, oItem);
		} else if ($dz.hasClass('tile')) {
			// detach the item and move it before the dropzone
			var $item = $(oItem);
			if (oDropZone != oItem) {
				$item.detach();
				$dz.before($item);
			}
		}
	},

	/**
	 * Tile has been dropped on a tile drop zone
	 */
	cmd_dd_drop_tile: function(oDropZone, oItem) {
		var $dz = $(oDropZone);
		var $item = $(oItem);
		var bDZWall = $dz.hasClass('wall');
		var bDZFlat = $dz.hasClass('flat');
		var bITWall = $item.hasClass('wall');
		var bITFlat = $item.hasClass('flat');
		var nMask = bDZWall ? 8 : 0;
		nMask |= bDZFlat ? 4 : 0;
		nMask |= bITWall ? 2 : 0;
		nMask |= bITFlat ? 1 : 0;
		switch (nMask) {
			// wall item over wall dz
			case 8 + 2:
			
			// flat item over flat dz
			case 4 + 1:
				var oCanvas = $('canvas', oDropZone).get(0);
				var oContext = oCanvas.getContext('2d');
				oContext.clearRect(0, 0, oCanvas.width, oCanvas.height);
				oContext.drawImage(oItem, 0, 0);
				$dz.data('tile', $item.attr('id'));				
				this.cmd_startAnimation();
				break;
			
			// invalid cases
			default:	
				break;
		}
	},
	
	
	cmd_deleteTile: function() {
		var $selected = $('canvas.tile.selected', this._oStructure);
		if ($selected.length) {
			this.doAction('deletetile', $selected.attr('id'));
		}
	},
		
	/**
	 * Loading a texture
	 * - call file open dialog
	 * - for each files ...
	 * - check height
	 * - if height is 96 -> ok
	 */
	cmd_load: function(sResult) {
		var oImage = new Image();
		oImage.addEventListener('load', this.cmd_loaded.bind(this));
		oImage.src = sResult;
	},

	cmd_loaded: function(oEvent) {
		// create tiles
		var oImage = oEvent.target;
		var oContainer = this._getCurrentTilesContainer();
		this.cmd_addImage(oImage, oContainer);
	},
	
	/**
	 * Returns true if the image (represented by its data64) has
	 * already been loaded
	 * this avoids having two same images
	 */
	_isTileAlreadyPresent: function(sMD5, $container) {
		var b = false;
		$('canvas.tile', $container).each(function() {
			var $this = $(this);
			if ($this.data('md5src') === sMD5) {
				b = true;
				return false;
			}
		});
		return b;
	},

	cmd_addImage: function(oImage, oContainer, aIds) {
		// create tiles
		var i = 0;
		var $canvas, oCanvas, oContext;
		var nTileWidth = this.TILE_WIDTH;
		var nTileHeight = oContainer.data('tileheight'); 
		var sType = '';
		if (oContainer.hasClass('wall')) {
			sType = 'wall';
		} else if (oContainer.hasClass('flat')) {
			sType = 'flat';
		} else {
			throw new Error('unable to determine current tile type');
		}
		var nId = 0, sId;
		while ((i + nTileWidth) <= oImage.width) {
			$canvas = $('<canvas></canvas>');
			if (aIds !== undefined && aIds.length > 0) {
				sId = aIds.shift();
			} else {
				while(this._getTileById(sType + '_' + nId)) {
					++nId;
				}
				sId = sType + '_' + nId;
			}
			$canvas.attr('id', sId);
			$canvas.addClass('tile');
			if (sType) {
				$canvas.addClass(sType);
			}
			oCanvas = $canvas.get(0);
			oCanvas.width = nTileWidth;
			oCanvas.height = nTileHeight;
			oContext = oCanvas.getContext('2d');
			oContext.drawImage(oImage, i, 0, nTileWidth, nTileHeight, 0, 0, nTileWidth, nTileHeight);
			i += nTileWidth;
			++nId;
			// if the new canvas has an exact replica... discard it
			// else append it to its container
			var sMD5 = MD5(oCanvas.toDataURL());
			if (!this._isTileAlreadyPresent(sMD5, oContainer)) {
				$canvas.data('md5src', sMD5);
				oContainer.append(oCanvas);
				$canvas.on('click', (function(oEvent) {
					$('canvas.tile.selected', this._oStructure).removeClass('selected');
					var $this = $(oEvent.target);
					$this.addClass('selected');
				}).bind(this));
			}
		}
		this._oDragDrop.setDraggableEntities($('canvas.tile', this._oStructure));
		this._oDragDrop.setDroppableEntities($('canvas.tile', this._oStructure));
		return sId;
	},

	cmd_wallTilesClick: function(oEvent) {
		this._showTilesContainer('wall');
	},

	cmd_flatTilesClick: function(oEvent) {
		this._showTilesContainer('flat');
	},

	cmd_buildType: function(oEvent) {
		var bt = RCWE.CONST.BLOCK_TYPE;
		var $button = $(oEvent.target);
		while ($button.length && $button.attr('type') != 'button') {
			$button = $button.parent();
		}
		if ($button.length) {
			var nBuildType = $button.data('blocktype');
			this.showEdit();
			$('select[name="blocktype"]', this._oForm).val(nBuildType).trigger('change');
		}
	},


	_importTiles: function(oContainer, sData64, aIds) {
		var oSelf = this;
		var oDefer = $.Deferred(function() {
			if (sData64) {
				var $image = $('<img/>');
				$image.on('load', (function(oEvent) {
					var oImg = oEvent.target;
					oSelf.cmd_addImage(oImg, oContainer, aIds);
					this.resolve();
				}).bind(this));
				$image.attr('src', sData64);
			} else {
				// no data : work is done, immediatly resolve the deferred object
				this.resolve();
			}
		});
		return oDefer;
	},
	
	_importWallTiles: function(oData) {
		if (!oData) {
			// this will return an "emtpty" deferred object (will do nothing)
			return this._importTiles();
		}
		var sData64, aIds;
		sData64 = oData.tiles;
		aIds = oData.ids.slice(0);
		return this._importTiles($('div.tilesContainer.wall', this._oStructure), sData64, aIds);
	},

	_importFlatTiles: function(oData) {
		if (!oData) {
			// this will return an "emtpty" deferred object (will do nothing)
			return this._importTiles();
		}
		var sData64, aIds;
		sData64 = oData.tiles;
		aIds = oData.ids.slice(0);
		return this._importTiles($('div.tilesContainer.flat', this._oStructure), sData64, aIds);
	},

	_serializeKeys: [
		'type',
		'left',
		'right',
		'left2',
		'right2',
		'floor',
		'ceil',
		'doortype',
		'offset',
		'frames',
		'delay',
		'yoyo'
	],
	
	
	
	////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	
	
	getHighestTileId: function(sType) {
		var a = [];
		$('canvas.tile.' + sType, this._oStructure).each(function() {
			var nId = $(this).attr('id').split('_')[1] | 0;
			a.push(nId);
		});
		if (a.length) {
			return a.reduce(function(nId, nPrevId) {
				return Math.max(nPrevId, nId);
			}, a[0]);
		} else {
			return -1;
		}
	},
	
	
	/**
	 * These function is usefull when importing new blocks without
	 * conflicting already loaded blocks.
	 * the given parameter is an array of ids
	 * the function will return an associated array with new ids to use
	 */
	submitNewIds: function(aIds) {
		if (aIds.length == 0) {
			throw new Error('no id submitted');
		}
		var sType = aIds[0].split('_')[0];
		var nMaxId = this.getHighestTileId(sType);
		var oMatch = {};
		aIds.forEach(function(id) {
			++nMaxId;
			oMatch[id] = sType + '_' + nMaxId;
		});
		return oMatch;
	},
	
	
	deleteTile: function(id) {
		var $item = this._getTileById(id);
		$item.remove();
		('right left right2 left2 floor ceil').split(' ').forEach(function(sData) {
			if (this._getBlockData(sData) == id) {
				this._setBlockData(sData, '');
			}
		}, this);
	},

	/**
	 * Write all properties into a specified block
	 */
	exportBlock: function(oBlock) {
		this._serializeKeys.forEach(function(sKey) {
			oBlock.setData(sKey, this._getBlockData(sKey));
		}, this);
	},
	
	/**
	 * Copy block properties into form fields
	 */
	importBlock: function(oBlock) {
		$('#block_id').html('id #' + oBlock.getData('id'));
		// clear the canvases
		var $canvas = $('td.dropzone canvas', this._oStructure);
		$canvas.each(function() {
			this.getContext('2d').clearRect(0, 0, this.width, this.height);
		});		
		this._oAnimationData = null;
		this._serializeKeys.forEach(function(sKey) {
			this._setBlockData(sKey, oBlock.getData(sKey));
		}, this);
	},

	/**
	 * Serialize tile images
	 */
	serialize: function() {
		return {
			walls: this._getBlockData('walls'),
			flats: this._getBlockData('flats')
		};
	},

	/**
	 * Unserialize tile images
	 * Because Image can take time to load, a callback parameter is provide
	 * the function pEnd will be called back after wall and flat image have been loaded.
	 */
	unserialize: function(oData, pEnd, bPreserve) {
		if (!bPreserve) {
			$('canvas.tile', this._oStructure).remove();
		}
		var pNext = (function() {
			this._importFlatTiles(oData['flats']).done(pEnd);
		}).bind(this);
		this._importWallTiles(oData['walls']).done(pNext);
	},
});
