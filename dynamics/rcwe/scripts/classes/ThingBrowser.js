O2.extendClass('RCWE.ThingBrowser', RCWE.Window, {
	
	_id: 'thingbrowser',
	_oStructure: null,
	_oIdManager: null,
	
	CANVAS_WIDTH: 48,
	CANVAS_HEIGHT: 48,
	
	build: function() {
		__inherited('Thing browser');
		this.getContainer().addClass('ThingBrowser');
		var $structure = $('<div class="things"></div>');
		this.getBody().append($structure);
		this.addCommand('<span style="color: #00A">✚</span> New', 'Create a new thing blueprint', this.cmd_newThing.bind(this));
		this.addCommand(' Edit', 'Modify blueprint properties', this.cmd_editThing.bind(this));
		this.addCommand('<span style="color: #A00">✖</span> Delete', 'Delete the selected thing blueprint', this.cmd_removeThing.bind(this));
		this.addCommandSeparator();
		this.addCommand(' Template', 'Load a template of blueprints', this.cmd_loadTemplate.bind(this));
		this._oStructure = $structure;		
		this.buildThingList();
	},
	
	show: function() {
		__inherited();
		if (this.getSelectedThingImage().length == 0) {
			var $canvas = $('canvas.thing', this._oStructure);
			if ($canvas.length) {
				this.selectThingImage($canvas.eq(0));
			}
		}
	},
	
	hide: function() {
		__inherited();
		this.doAction('hidehintbox');
	},
	
	/**
	 * This function build or empty the thing list and reset the idmanage
	 * It must be call after any unserialization
	 */
	buildThingList: function() {
		this._oIdManager = new RCWE.IdManager();
		this._oIdManager.fill(1, 255);
		this._oStructure.empty();
	},
	
	selectThingImage: function($canvas) {
		$('canvas.thing.selected', this._oStructure).removeClass('selected');
		$canvas.addClass('selected');
		this.doAction('selectthing');
	},
	
	unselectThingImage: function() {
		$('canvas.thing.selected', this._oStructure).removeClass('selected');
		this.doAction('selectthing');
	},
	
	getSelectedThingImage: function() {
		return $('canvas.thing.selected', this._oStructure);
	},
	
	getSelectedThing: function() {
		return this.getSelectedThingImage().data('thing');
	},
	
	getThing: function(id) {
		return $('#thing_' + id).data('thing');
	},
	
	createNewThing: function(id) {
		var nId;
		if (id === undefined) {
			nId = this._oIdManager.pick();
		} else {
			nId = id;
			this._oIdManager.remove(id);
		}
		var $canvas = $('<canvas id="thing_' + nId + '" class="thing"></canvas>');
		$canvas.attr('width', this.CANVAS_WIDTH);
		$canvas.attr('height', this.CANVAS_HEIGHT);
		var oThing = new RCWE.Thing();
		oThing.setData('id', nId);
		$canvas.on('click', (function(oEvent) {
			this.selectThingImage($(oEvent.target));
		}).bind(this));
		var oCanvas = $canvas.get(0);
		$canvas.data('thing', oThing);
		this._oStructure.append($canvas);
		return $canvas;
	},
	
	cmd_newThing: function() {
		var $canvas = this.createNewThing();
		this.selectThingImage($canvas);
		this.doAction('newthing');
	},
	
	cmd_removeThing: function() {
		var $canvas = this.getSelectedThingImage();
		if ($canvas) {
			if (confirm('Remove this blueprint ?')) {
				var oThing = $canvas.data('thing');
				var nId = oThing.getData('id');
				// remove all things with this id
				this.doAction('removething', nId);
				this._oIdManager.discard(nId);
				$canvas.remove();
			}
		}			
	},

	cmd_editThing: function() {
		if (this.getSelectedThingImage().length) {
			this.doAction('editthing');
		}
	},
	
	
	cmd_loadTemplate: function() {
		this.doAction('loadtemplate');
	},
	
		
	////// SERIALIZATION ///// SERIALIZATION ///// SERIALIZATION ///// SERIALIZATION /////
	////// SERIALIZATION ///// SERIALIZATION ///// SERIALIZATION ///// SERIALIZATION /////
	////// SERIALIZATION ///// SERIALIZATION ///// SERIALIZATION ///// SERIALIZATION /////

	/**
	 * The serialization, serializes image data to base64 encoded data
	 */
	serialize: function() {
		var aThings = [];
		$('canvas.thing', this._oStructure).each(function() {
			var oThing = $(this).data('thing');
			var oData = {};						// serialized object
			var oDataSrc = oThing.serialize();	// properties to be serialized
			for (var sData in oDataSrc) {
				if (sData != 'image') {			// each prop except 'image' can be copied
					oData[sData] = oDataSrc[sData];
				}
			}
			oData.image = oDataSrc.image.src; // image must be converted to base64 encoded data
			oData.width = oDataSrc.image.width;
			oData.height = oDataSrc.image.height;
			aThings.push(oData);
		});
		return aThings;
	},
	
	unserialize: function(d) {
		this.buildThingList();
		d.forEach(function(oThingData) {
			if (!oThingData.image) {
				return;
			}
			var $thingImage = this.createNewThing(oThingData.id);	// create thing, get thumbnail canvas
			var oThing = $thingImage.data('thing');		// get thing instance
			var oImage = new Image();					// create a new empty image
			$(oImage).one('load', function(oEvent) {	// load event for the image
				var $img = $(this.target);				// get image
				oThing.render($thingImage.get(0));		// render into thumbnail canvas
			});
			for (var sData in oThingData) {				// iterate thing data
				if (sData != 'image') {					// copy each prop but image
					oThing.setData(sData, oThingData[sData]);
				}
			}
			oThing.setData('image', oImage);			// set image prop
			oImage.src = oThingData.image;				// set image data (will trigger load event)
		}, this);
	}
});
