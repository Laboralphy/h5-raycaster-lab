O2.extendClass('RCWE.BlockBrowser', RCWE.Window, {
	
	BLOCK_WIDTH: 96,
	BLOCK_HEIGHT: 96,

	_id: 'blockbrowser',
	_aBlockCache: null,
	
	_oStructure: null,
	_aSections: null,
	_oStructure: null,
	_oIdManager: null,

	
	build: function() {
		__inherited('Block browser');
		this.getContainer().addClass('BlockBrowser');
		this.addCommand('<span class="icon-plus" style="color: #00A"></span> New', 'Create a new block', this.cmd_newBlock.bind(this));
		this.addCommand('<span class="icon-pencil2"></span> Edit', 'Modify block properties', this.cmd_editBlock.bind(this));
		this.addCommand('<span class="icon-bin" style="color: #A00"></span> Delete', 'Remove the selected block', this.cmd_removeBlock.bind(this));
		this.addCommandSeparator();
		this.addCommand('<span class="icon-folder"></span> Template', 'Load a template of textures and blockset', this.cmd_loadTemplate.bind(this));
		var $structure = $('<div class="sections"><div>');
		this.getBody().append($structure);
		this._oStructure = $structure;
		this.buildSections();
		this.rearrangeTabs();
	},
	
	/**
	 * Build (and reset) the sections
	 * This function is used by the unserializer after a new file has been loaded
	 * This resets the id manager.
	 */
	buildSections: function() {
		this._oIdManager = new RCWE.IdManager();
		this._oIdManager.fill(1, 255);
		this._aBlockCache = [];
		var $structure = this._oStructure;
		var $section;
		var bt = RCWE.CONST.BLOCK_TYPE;
		this._aSections = [];
		$structure.empty();
		for (var s in bt) {
			$section = $('<div class="section ' + s.toLowerCase() + '"></div>');
			$section.append('<hr />');
			$section.append('<div class="title">' + s + '</div>');
			$section.append('<div class="blocks"></div>');
			$section.data('type', bt[s]);
			$structure.append($section);
			this._aSections[bt[s]] = $section;
		}
	},
	
	cmd_newBlock: function() {
		// create a new empty block
		// render it
		// select it
		// launche editor
		var $canvas = this.createBlockImage();
		this.selectBlockImage($canvas.get(0));
		this.doAction('newblock');
	},
	
	cmd_select: function(oEvent) {
		this.selectBlockImage(oEvent.target);
		this.doAction('selectblock');
	},
	
	/**
	 * Modify the selected block properties
	 */
	cmd_editBlock: function() {
		if (this.getSelectedBlockImage().length) {
			this.doAction('editblock');
		}
	},

	cmd_removeBlock: function() {
		var b = this.getSelectedBlockImage();
		if (b) {
			if (confirm('Remove the selected block ?')) {
				this.destroyBlockImage(b);
			}
		}
	},
	
	cmd_loadTemplate: function() {
		this.doAction('loadtemplate');
	},


	////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	
	/**
	 * Return the number of block using the tile with the specified id
	 * @param string sTile tile id
	 * @return int
	 */
	getTileUsage: function(sTile) {
		var n = 0;
		this._aBlockCache.forEach(function(b) {
			if (b) {
				if (b.getData('right') == sTile || 
					b.getData('left') == sTile || 
					b.getData('floor') == sTile || 
					b.getData('ceil') == sTile) {
					++n;
				}
			}
		});
		return n;
	},
	
	destroyBlockImage: function(b) {
		var oBlock = b.data('block');
		this.doAction('deleteblock', oBlock);
		var id = oBlock.getData('id');
		this._oIdManager.discard(id);
		this._aBlockCache[id] = null;
		b.remove();
		this.rearrangeTabs();
	},
	
	createBlockImage: function(b) {
		var id;
		if (b === undefined) {
			b = new RCWE.Block();
			id = this._oIdManager.pick();
			b.setData('id', id);
		} else {
			id = b.getData('id');
			this._oIdManager.remove(id);
		}
		this._aBlockCache[id] = b;
		var $canvas = $('<canvas class="block" title="id : #' + id + '"></canvas>');
		$canvas.attr({
			width: this.BLOCK_WIDTH,
			height: this.BLOCK_HEIGHT
		}).on('click', this.cmd_select.bind(this))
		.data('block', b);
		this._aSections[b.getData('type')].append($canvas);
		return $canvas;
	},
	
	/**
	 * Select a block, unselect any other block
	 */
	selectBlockImage: function(oBlock) {
		if (typeof oBlock === 'number') {
			oBlock = this.getBlockImage(oBlock);
		}
		$('canvas.block.selected', this._oStructure).removeClass('selected');
		$(oBlock).addClass('selected');
	},
	
	getSelectedBlockImage: function() {
		return $('canvas.block.selected', this._oStructure);
	},
	
	getSelectedBlock: function() {
		return this.getSelectedBlockImage().data('block');
	},
	
	getBlock: function(nCode) {
		return this._aBlockCache[nCode];
	},

	getBlockImage: function(id) {
		var oResult = null;
		$('canvas.block', this._oStructure).each(function() {
			$b = $(this);
			if ($b.data('block').getData('id') == id) {
				oResult = this;
				this.scrollIntoView();
				return false;
			}
		});
		return oResult;
	},
	
	getHighestBlockId: function() {
		var a = [];
		$('canvas.block', this._oStructure).each(function() {
			var oBlock = $(this).data('block');
			var id = oBlock.getData('id');
			a.push(id);
		});
		if (a.length == 0) {
			return 0;
		}
		return a.reduce(function(nPrevId, id) {
			return Math.max(nPrevId, id);
		}, a[0]);
	},
	
	/**
	 * Remove all references of a tile
	 */
	deleteTileRef: function(id) {
		$('canvas.block', this._oStructure).each(function() {
			var oCanvas = this;
			var $b = $(oCanvas);
			var oBlock = $b.data('block');
			var bModified = false;
			('right left right2 left2 ceil floor').split(' ').forEach(function(sData) {
				if (oBlock.getData(sData) == id) {
					oBlock.setData(sData, '');
					bModified = true;
				}
			});
			if (bModified) {
				oBlock.renderFlat(oCanvas);
			}
		});
	},
	
	/**
	 * Copy all the specified block properties onto the current selected block
	 * That means : The selected block will be updated with the given block
	 * @param oBlock Block
	 */
	importBlock: function(oBlock) {
		var $b = this.getSelectedBlockImage();
		$b.data('block', oBlock);
		oBlock.renderFlat($b.get(0));
		// correct block position among sections
		var nType = oBlock.getData('type');
		var $section = $b.parent();
		var nSectionType = $section.data('type');
		if (nType != nSectionType) {
			$b.detach();
			this._aSections[nType].append($b);
		}
		this.rearrangeTabs();
	},

	/**
	 * hide tabs with no blocks inside
	 * show tabs with blocks
	 */
	rearrangeTabs: function() {
		$('div.section', this._oStructure).each(function() {
			var $this = $(this);
			if ($('canvas.block', $this).length) {
				$this.show();
			} else {
				$this.hide();
			}
		});
	},

	serialize: function() {
		var aBlocks = [];
		$('canvas.block', this._oStructure).each(function() {
			var $b = $(this);
			aBlocks.push($b.data('block').serialize());
		});
		return aBlocks;
	},

	/**
	 * The unserializer calls the buildSections() function to clean the block browser
	 * before adding loaded blocks.
	 */
	unserialize: function(aBlocks, bPreserve) {
		if (!bPreserve) {
			this.buildSections();
		}
		aBlocks.forEach((function(b) {
			if (b) {
				var oBlock = new RCWE.Block();
				oBlock.unserialize(b);
				var $canvas = this.createBlockImage(oBlock);
				oBlock.renderFlat($canvas.get(0));
			}
		}).bind(this));
		this.rearrangeTabs();
	}
});
