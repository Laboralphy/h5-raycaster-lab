O2.extendClass('RCWE.SpriteSheet', RCWE.ListAndForm, {

	oCanvas: null,
	oContext: null,
	oImage: null,
	oInterval: null,
	oGlobal: null,
	
	iImage: 0,
	
	XSIZE: 256,
	YSIZE: 256,
	
	XLINE: 128,
	YLINE: 192,
	
	build: function() {
		__inherited('Sprite Sheet');
		var $oLastCell = $('td:last', this._oStruct);
		var $oViewCell = $oLastCell;
		$oLastCell.after($oViewCell);
		var ySize = this.XSIZE;
		var xSize = this.YSIZE;
		this.oCanvas = $('<canvas></canvas>').attr({width: xSize, height: ySize});
		$oViewCell.prepend(this.oCanvas);
		$oViewCell.css({'text-align': 'left', 'vertical-align': 'top'});
		this.oContext = this.oCanvas.get(0).getContext('2d');
		
		this.getToolBar().imageLoader({load: this.imageChanged.bind(this), multiple: true});
		
		var $oForm = this.getForm();
		var $oImg = $('<img/>').hide();
		$oImg.bind('load', this.imageLoaded.bind(this));
		this.oImage = $oImg.get(0);
		
		////// FORM
		var $bxofsdec = $('<button type="button">▶</button>');
		var $bxofsinc = $('<button type="button">◀</button>');
		var $byofsinc = $('<button type="button">▲</button>');
		var $byofsdec = $('<button type="button">▼</button>');
		$bxofsdec.data('xofs', -1).on('click', this.btnOffsetClick.bind(this));
		$bxofsinc.data('xofs', 1).on('click', this.btnOffsetClick.bind(this));
		$byofsinc.data('yofs', 1).on('click', this.btnOffsetClick.bind(this));
		$byofsdec.data('yofs', -1).on('click', this.btnOffsetClick.bind(this));
		$oForm
			.append('<span class="label">xofs:</span><input name="xofs" title="x offset" type="text" size="4" maxlength="4" />')
			.append($bxofsinc).append($bxofsdec).append('<br/>')
			.append('<span class="label">yofs:</span><input name="yofs" title="x offset" type="text" size="4" maxlength="4" />')
			.append($byofsinc).append($byofsdec).append('<br/>')
			.append($oImg);
			
		this.oGlobal = $('<form></form>');
		var g = this.oGlobal;
		$oForm.after(g);
		$oForm.after('<hr/>');
		g.append('<span class="label">size:</span>');
		g.append('<input name="xsize" type="text" size="2" maxlength="4" value="64" /><button class="metric sub" type="button">◀</button><button class="metric add" type="button">▶</button>');
		g.append('<input name="ysize" type="text" size="2" maxlength="4" value="96" /><button class="metric sub" type="button">▲</button><button class="metric add" type="button">▼</button>');
		g.append('<br /><span class="label">orig:</span>');
		g.append('<input name="xorig" type="text" size="2" maxlength="4" value="-32" /><button class="metric sub" type="button">◀</button><button class="metric add" type="button">▶</button>');
		g.append('<input name="yorig" type="text" size="2" maxlength="4" value="-96" /><button class="metric sub" type="button">▲</button><button class="metric add" type="button">▼</button>');
		
		$('button.metric', g).on('click', this.btnMetricClick.bind(this));
		
		$('input', g).on('change', this.redraw.bind(this));
		
		this._oList.css('height', '480px');
		
		
		this.onSelect = this.updateImage.bind(this);
		this.onSave = this._updateCanvas.bind(this);
		this.bindForm();
	},
	
	btnMetricClick: function(oEvent) {
		var $button = $(oEvent.target);
		var sSign = $button.html();
		var $input = $button.prev();
		if ($button.hasClass('add')) {
			$input = $input.prev();
			$input.val(($input.val() | 0) + 1);
		} else {
			$input.val(($input.val() | 0) - 1);
		}
		this.redraw();
	},
	
	btnOffsetClick: function(oEvent) {
		var $b = $(oEvent.target);
		var d = $b.data();
		var s = this.getSelectedOption();
		var n;
		for (var id in d) {
			n = (s.data(id) | 0) + d[id];
			s.data(id, n);
			this.redraw();
			$('input[name="' + id + '"]', this.getForm()).val(n);
			this.imageLoaded();
		}
	},
	
	resetAll: function() {
		this.clear();
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
	
	redraw: function() {
		var s = this.getSelectedOption();
		if (s) {
			var d = s.data();
			this.oContext.clearRect(0, 0, this.XSIZE, this.YSIZE);
			this.oContext.drawImage(this.oImage, this.XLINE - d.xofs, this.YLINE - d.yofs);
			this.oContext.strokeStyle = 'red';
			this.oContext.beginPath();
			this.oContext.moveTo(this.XLINE, 0);
			this.oContext.lineTo(this.XLINE, this.YSIZE - 1);
			this.oContext.stroke();
			this.oContext.beginPath();
			this.oContext.moveTo(0, this.YLINE);
			this.oContext.lineTo(this.XSIZE - 1, this.YLINE);
			this.oContext.stroke();
			var xSize = $('input[name="xsize"]', this.oGlobal).val() | 0;
			var ySize = $('input[name="ysize"]', this.oGlobal).val() | 0;
			var xOrig = $('input[name="xorig"]', this.oGlobal).val() | 0;
			var yOrig = $('input[name="yorig"]', this.oGlobal).val() | 0;
			this.oContext.strokeStyle = 'blue';
			this.oContext.strokeRect(this.XLINE + xOrig, this.YLINE + yOrig, xSize, ySize);
		}
	},
	
	generateSpriteSheet: function() {
		var oSS = this;
		$('option', this._oList).each(function() {
			var $option = $(this);
			
		});
	},
	
	imageLoaded: function(oEvent) {
		var s = this.getSelectedOption();
		if (s) {
			var d = s.data();
			if (!('xofs' in d)) {
				s.data('xofs', this.oImage.width >> 1);
				s.data('yofs', this.oImage.height - 1);
				s.data('wimg', this.oImage.width);
				s.data('himg', this.oImage.height);
				this.cmd_load();
			}
			this.redraw();
		}
	},
	
	imageChanged: function(sData) {
		var $option = this.cmd_add('image_' + (this.iImage++).toString());
		$option.data({
			imgsrc: sData
		});
		this._oList.trigger('change');
	},
	
	_updateCanvas: function() {
		$('input[type="file"]', this.getToolBar()).val('');
		var s = this.getSelectedOption();
		if (s) {
			var sSrc = s.data('imgsrc');
			if (sSrc) {
				var oImg = this.oImage;
			}
		}
	},
	
	
	exportBlueprint: function(pCallBack) {
		// build list
		var xSize = $('input[name="xsize"]', this.oGlobal).val() | 0;
		var ySize = $('input[name="ysize"]', this.oGlobal).val() | 0;
		var xOrig = $('input[name="xorig"]', this.oGlobal).val() | 0;
		var yOrig = $('input[name="yorig"]', this.oGlobal).val() | 0;
		var d = {
			frames: [],
			width: xSize,
			height: ySize,
			x: xOrig,
			y: yOrig
		};
		$('option', this._oList).each(function() {
			var $option = $(this);
			if ($option.data('xofs') === undefined || $option.data('yofs') === undefined) {
				throw new Error('check all the frames before exporting (click on each frame you have just loaded)');
			}
			d.frames.push({
				src: $option.data('imgsrc'),
				xofs: $option.data('xofs'),
				yofs: $option.data('yofs')
			});
		});
		if (!d.frames.length) {
			throw new Error('nothing to export');
		}
		var $canvas = $('<canvas></canvas>');
		$canvas.prop('width', d.width * d.frames.length);
		$canvas.prop('height', d.height);
		d.canvas = $canvas.get(0);
		d.context = d.canvas.getContext('2d');
		d.iframe = 0;
		$image = $('<img />');
		d.image = $image.get(0);
		var process = function() {
			var f = d.frames[d.iframe];
			var xs = d.x + f.xofs;
			var ys = d.y + f.yofs;
			var xd = d.iframe * d.width;
			var yd = 0;
			d.context.drawImage(d.image, xs, ys, d.width, d.height, xd, yd, d.width, d.height);
			console.log(xs, ys, xd, yd);
			++d.iframe;
			if (d.iframe < d.frames.length) {
				d.image.src = d.frames[d.iframe].src;
			} else if (pCallBack) {
				pCallBack(d);
			}
		};
		var loadImage = function() {
			d.image.src = d.frames[d.iframe].src;
			if (d.image.complete) {
				process();
			} else {
				$image.on('load', process);
			}
		};
		
		$image.on('load', loadImage);
		loadImage();
	}
	

});
