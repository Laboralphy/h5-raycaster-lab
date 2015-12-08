O2.extendClass('RCWE.ObjectBuilder', RCWE.ListAndForm, {
	
	oCanvas: null,
	oContext: null,
	oImage: null,
	oInterval: null,

	// pour animation only !!
	iFrame: 0,
	nDir: 1,
	nFrames: 0,
	nDelay: 0,
	bYoyo: false,
	
	onImageEntryLoaded: null,
	
	
	build: function() {
		__inherited('Blueprints');
		var $oViewCell = $('<td></td>');
		var $oLastCell = $('td:last', this._oStruct);
		$oLastCell.after($oViewCell);
		var ySize = 256;
		var xSize = 128;
		this.oCanvas = $('<canvas></canvas>').attr({width: xSize, height: ySize});
		$oViewCell.append(this.oCanvas);
		$oViewCell.css({'text-align': 'center', 'vertical-align': 'middle'});
		this.oContext = this.oCanvas.get(0).getContext('2d');
		
		this.getToolBar().imageLoader({load: this.imageChanged.bind(this)});
		
		var $oForm = this.getForm();
		var $oImg = $('<img/>').hide();
		$oImg.bind('load', this.imageLoaded.bind(this));
		this.oImage = $oImg.get(0);
		
		////// FORM
		$oForm.append('<span class="label">object properties:</span><br />')
			.append('<span class="label">frames:</span><input name="frames" title="number of frames in the tileset (minimum value : 1)" type="text" size="4" maxlength="2" /><br />')
			.append('<span class="label">&nbsp;delay:</span><input name="delay" type="text" size="4" maxlength="4" title="Object animation delay (in milliseconds) 100 ms means 10 fps" /><br />')
			.append('<span class="label">&nbsp;&nbsp;yoyo:</span><input name="yoyo" type="checkbox" title="when checked, the object animation loops forth and back" /><br />')
			.append('<span class="label">transl:</span><input name="transl" type="checkbox" title="the object is visually translucent" /><br />')
			.append('<span class="label">noshad:</span><input name="noshad" type="checkbox" title="the object cannot be shaded and will appear as a light emitting entity (good for firecamps or lanterns)" /><br />')
			.append('<span class="label">alph50:</span><input name="alpha50" type="checkbox" title="the object gets a 50% alpha filter" /><br />')
			.append($oImg);
		this.onSelect = this.updateImage.bind(this);
		this.onSave = this._updateCanvas.bind(this);
		this.bindForm();
	},

	
	updateImage: function() {
		var s = this.getSelectedOption();
		if (s) {
			var sData = s.data('imgsrc');
			if (sData) {
				this.oImage.src = sData;
			}
		}
	},
	
	addEntry: function(sOption, sSrc, nFrames, nDelay, bYoyo, bTransl, bNoShad, bAlpha50) {
		this.cmd_add(sOption);
		var f = this._oForm;
		$('input[name="frames"]', f).val(nFrames);
		$('input[name="delay"]', f).val(nDelay);
		$('input[name="yoyo"]', f).prop('checked', bYoyo);
		$('input[name="transl"]', f).prop('checked', bTransl);
		$('input[name="noshad"]', f).prop('checked', bNoShad);
		$('input[name="alpha50"]', f).prop('checked', bAlpha50);
		this.imageChanged(sSrc);
	},
		
	imageChanged: function(sData) {
		var s = this.getSelectedOption();
		if (s) {
			s.data('imgsrc', sData);
			this.oImage.src = sData;
		}
	},
	
	imageLoaded: function(oEvent) {
		this._updateCanvas();
		this.cmd_save();
		if (this.onImageEntryLoaded) {
			this.onImageEntryLoaded();
		}		
	},
	
	startAnimation: function() {
		if (this.oInterval) {
			clearInterval(this.oInterval);
		}
		if (this.nDelay < 16) {
			this.nDelay = 16;
		} 
		if (this.nFrames <= 0) {
			this.nFrames = 1;
		}
		this.oInterval = setInterval(this.animate.bind(this), this.nDelay);
		this.iFrame = 0;
		this.nDir = 1;
	},
	
	animate: function() {
		this.iFrame += this.nDir;
		if (this.iFrame < 0) {
			this.iFrame = 0;
			this.nDir = 1;
		}
		if (this.iFrame >= this.nFrames) {
			if (this.bYoyo) {
				this.iFrame = Math.max(0, this.nFrames - 1);
				this.nDir = -this.nDir;
			} else {
				this.iFrame = this.iFrame % this.nFrames;
			}
		}
		this.oContext.clearRect(0, 0, this.oCanvas.width(), this.oCanvas.height());
		var oImg = this.oImage;
		var w = oImg.width / this.nFrames | 0;
		var h = oImg.height;
		var cw = this.oCanvas.width();
		var ch = this.oCanvas.height();
		this.oContext.clearRect(0, 0, this.oCanvas.width(), this.oCanvas.height());
		this.oContext.drawImage(oImg, w * this.iFrame, 0, w, h, (cw - w) >> 1, (ch - h) >> 1, w, h);
	},
	
	_updateCanvas: function() {
		$('input[type="file"]', this.getToolBar()).val('');
		var s = this.getSelectedOption();
		if (s) {
			var sSrc = s.data('imgsrc');
			if (sSrc) {
				var oImg = this.oImage;
				this.nFrames = s.data('frames') | 0;
				this.nDelay = s.data('delay') | 0;
				this.bYoyo = s.data('yoyo') || false;
				if (this.nFrames > 0) {
					s.data('wimg', oImg.width / this.nFrames | 0);
					s.data('himg', oImg.height);
					s.data('psize', (oImg.width / this.nFrames | 0) >> 1);
				} else {
					s.data('psize', 0);
				}
				this.startAnimation();
			}
		}
	},
	
	generateTiles: function() {
		var oDef = {}, nFrameCount, nLoop;
		
		$('option', this._oList).each(function() {
			var $this = $(this);
			var d = $this.data();
			nFrameCount = Math.max(1, d.frames | 0);
			nLoop = 0;
			if (nFrameCount > 1) {
				nLoop = 1;
				if (d.yoyo) {
					nLoop = 2;
				}
			}
			oDef[$this.html()] = {
				src: d.imgsrc,
				frames: nFrameCount, 
				width: d.wimg,
				height: d.himg,
				noshading: d.noshad,
				animations: [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], nFrameCount, d.delay | 0,  nLoop] ]
			};
		});
		return oDef;
	},
	
	generateBlueprints: function() {
		var oDef = {}, nFX;
		
		$('option', this._oList).each(function() {
			var $this = $(this);
			var d = $this.data();
			nFX = (d.transl ? RC.FX_LIGHT_ADD : 0) | (d.noshad ? RC.FX_LIGHT_SOURCE : 0) | (d.alpha50 ? RC.FX_ALPHA_50 : 0);
			oDef[$this.html()] = {
				type: RC.OBJECT_TYPE_PLACEABLE,
				name: $this.html(),
				tile: $this.html(),
				width: d.psize,
				height: d.himg,
				thinker: null,
				fx: nFX,
				data: {}
			};
		});
		return oDef;
	},
	
	serialize: function() {
		return this.getData();		
	},
	
	unserialize: function(a) {
		this.setData(a);		
	}
});
