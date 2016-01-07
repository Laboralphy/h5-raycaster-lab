O2.extendClass('RCWE.ThingEditor', RCWE.Window, {

	_id: 'thingeditor',
	oImage: null, // image of the thing
	oInterval: null,
	oData: null,
	
	_oForm: null,
	
	_oAnimCanvas: null,
	_oAnimContext: null,
	_oAnimation: null,
	
	build: function() {
		__inherited('Thing editor');
		this.getContainer().addClass('ThingEditor');
		var $structure = $('<table>' +
			'<tbody>' +
				'<tr>' +
					'<td class="form"></td>' +
					'<td class="preview"><canvas width="64" height="96"></canvas></td>' +
				'</tr>' +
			'</tbody>' +
		'</table>');
		var $form = $('<form></form>');
		var $table = $('<table></table>');
		var $tbody = $('<tbody></tbody>');
		var $tr;
		
		// frames
		// delay
		// yoyo
		// transl
		// noshad
		// alpha50

		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('image :');
		$('td', $tr).imageLoader({ 
			loadHTML: '<button type="button" title="Load image">Load...</button>',
			load: this.cmd_loadImage.bind(this)
		});

		$tbody.append($tr);
		
		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('frames :');
		$('td', $tr).append('<input name="frames" type="number" min="1" max="256" step="1" value="1" />');
		$tbody.append($tr);
		
		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('delay :');
		$('td', $tr).append('<input name="delay" type="number" min="40" max="8800" step="40" value="80" />').append('ms');
		$tbody.append($tr);
		
		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('yoyo :');
		$('td', $tr).append('<input name="yoyo" type="checkbox"/>');
		$tbody.append($tr);

		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('translucent :');
		$('td', $tr).append('<input name="transl" type="checkbox"/>');
		$tbody.append($tr);

		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('no shading :');
		$('td', $tr).append('<input name="noshad" type="checkbox"/>');
		$tbody.append($tr);

		$tr = $('<tr><th></th><td></td></tr>');
		$('th', $tr).append('alpha 50% :');
		$('td', $tr).append('<input name="alpha50" type="checkbox"/>');
		$tbody.append($tr);

		$table.append($tbody);
		$form.append($table);
		$('td.form', $structure).append($form);

		this._oForm = $form;
		
		$('input', $form).on('change', (function(oEvent) {
			this.restartAnimation();	
		}).bind(this));

		this.getBody().append($structure);
		this.addCommand('<span style="color: #080">✔</span> Done', 'Save the thing properties modifications', this.cmd_done.bind(this));
		this.addCommand('<b>↵</b> Cancel', 'Cancel the thing properties modifications', this.cmd_cancel.bind(this));
	},
	
	show: function() {
		__inherited();
		this.stopAnimation();
		this.oInterval = window.setInterval(this._animationProc.bind(this), 40);
	},
	
	hide: function() {
		__inherited();
	},
	
	_getThingData: function(sData) {
		switch(sData) {
			case 'transl':
			case 'alpha50':
			case 'noshad':
			case 'yoyo':
				return $('[name="' + sData + '"]', this._oForm).prop('checked');
				
			case 'frames':
			case 'delay':
				return $('[name="' + sData + '"]', this._oForm).val() | 0;
		}			
	},
	
	_setThingData: function(sData, value) {
		switch(sData) {
			case 'transl':
			case 'alpha50':
			case 'noshad':
			case 'yoyo':
				$('[name="' + sData + '"]', this._oForm).prop('checked', !!value).trigger('change');
				break;
				
			case 'frames':
			case 'delay':
				$('[name="' + sData + '"]', this._oForm).val(value).trigger('change');
				break;
		}
	},
	
	startAnimation: function() {
		this._oAnimation = new O876_Raycaster.Animation();
		this._oAnimation.assign({
			nStart: 0,
			nCount: this._getThingData('frames'),
			nDuration: this._getThingData('delay'),
			nLoop: this._getThingData('yoyo') ? 2 : 1,
			nIndex: 0,
			nTime: 0
		});
		
		this._oAnimCanvas = $('td.preview canvas').get(0);
		this._oAnimContext = this._oAnimCanvas.getContext('2d');
		this.oInterval = window.setInterval(this._animationProc.bind(this), 40);
	},
	
	stopAnimation: function() {
		if (this.oInterval) {
			window.clearInterval(this.oInterval);
		}
		this.oInterval = null;
	},
	
	restartAnimation: function() {
		this.stopAnimation();
		this.startAnimation();
	},

	
	_animationProc: function() {
		var a = this._oAnimation;
		if (this.oImage && this.oImage.complete && a.nCount) {
			var wFrame = this.oImage.width / a.nCount | 0;
			var hFrame = this.oImage.height;
			if (wFrame != this._oAnimCanvas.width) {
				this._oAnimCanvas.width = wFrame;
			}
			if (hFrame != this._oAnimCanvas.height) {
				this._oAnimCanvas.height = hFrame;
			}
			var ctx = this._oAnimContext;
			var bAlpha50 = this._getThingData('alpha50');
			var bTransl = this._getThingData('transl');

			ctx.clearRect(0, 0, wFrame, hFrame);
			var fGlobalAlpha = ctx.globalAlpha;
			var sGCO = ctx.globalCompositeOperation;
			if (bAlpha50) {
				ctx.globalAlpha = 0.5;
			}
			if (bTransl) {
				ctx.globalCompositeOperation = 'lighter';
			}
			ctx.drawImage(this.oImage, wFrame * a.nIndex, 0, wFrame, hFrame, 0, 0, wFrame, hFrame);
			if (bTransl) {
				ctx.drawImage(this.oImage, wFrame * a.nIndex, 0, wFrame, hFrame, 0, 0, wFrame, hFrame);
			}
			ctx.globalCompositeOperation = sGCO;
			ctx.globalAlpha = fGlobalAlpha;
			a.animate(40);
		} else {
			this._oAnimContext.clearRect(0, 0, this._oAnimCanvas.width, this._oAnimCanvas.height);
		}
		if (!this.getContainer().is(':visible')) {
			this.stopAnimation();
		}
	},
	
	cmd_done: function() {
		this.doAction('done');
	},
	
	cmd_cancel: function() {
		this.doAction('cancel');
	},
	
	cmd_loadImage: function(sData64) {
		var oImage = $('<img/>');
		oImage.attr('src', sData64);
		this.oImage = oImage.get(0);
	},
	
	EXPORTABLE_PROPS: 'frames delay yoyo transl noshad alpha50',
	
	exportThing: function(oThing) {
		oThing.setData('image', this.oImage);
		this.EXPORTABLE_PROPS.split(' ').forEach((function(prop) {
			oThing.setData(prop, this._getThingData(prop));
		}).bind(this));
	},
	
	importThing: function(oThing) {
		this.oImage = oThing.getData('image');
		this.EXPORTABLE_PROPS.split(' ').forEach((function(prop) {
			this._setThingData(prop, oThing.getData(prop));
		}).bind(this));
	}

});
