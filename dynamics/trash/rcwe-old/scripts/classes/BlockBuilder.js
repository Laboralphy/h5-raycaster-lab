O2.extendClass('RCWE.BlockBuilder', RCWE.ListAndForm, {
	
	oCanvas: null,
	oContext: null,
	
	build: function() {
		__inherited('Block builder');
		var $oViewCell = $('<td></td>');
		var $oLastCell = $('td:last', this._oStruct);
		$oLastCell.after($oViewCell);
		var ySize = 96 + 16 + 16 + 96;
		var xSize = 128;
		this.oCanvas = $('<canvas width/>').attr({width: xSize, height: ySize});
		$oViewCell.append(this.oCanvas);
		this.oContext = this.oCanvas.get(0).getContext('2d');
		
		var $oForm = this.getForm();
		
		var aCodes = [
			'Void',
			'Solid wall',
			'Door up',
			'Curtain up',
			'Door down',
			'Curtain down',
			'Door left',
			'Door right',
			'Door double',
			'Secret block',
			'Transparent block',
			'Invisible block',
			'Offset block'
		];
		var $oPhysCodes = $('<select name="phys" style="width: 128px"></select>').attr('title', 'the physical property of the block	');;
		aCodes.forEach(function(i, n, a) {	$oPhysCodes.append('<option value="' + n + '">' + i + '</option>');	});
		
		$oForm.append('<span class="label">physic code:</span>').append($oPhysCodes).append('<br/>').append(
			'<span class="label">offs:</span><input name="offs" title="offset of the wall (0-64). used for offseted and transparent type physic" type="text" size="4" maxlength="4" /><br />' +
			'<span class="label">acnt:</span><input name="acnt" title="number of texture animation frames (0 or 1 means : no animation for this texture)" type="text" size="1" maxlength="2" /><br />' +
			'<span class="label">adel:</span><input name="adel" title="delay between each animation frame (0 means very fast, 4 is rather slow)" type="text" size="1" maxlength="1" /><br />' +
			'<span class="label">yoyo:</span><input name="yoyo" title="if checked, that means the animation loop type is forth-and-back" type="checkbox" />' +
			'<input name="left" type="hidden" />' +
			'<input name="right" type="hidden" />' +
			'<input name="ceil" type="hidden" />' +
			'<input name="floor" type="hidden" />'
		);
		this.bindForm();
	},
	
	getCode: function(n) {
		var $option = $('option[value="' + n + '"]', this._oList);
		var oData = $option.data();
		return oData; 
	},
	
	////// DRAW FUNCTIONS ////// DRAW FUNCTIONS ////// DRAW FUNCTIONS //////
	////// DRAW FUNCTIONS ////// DRAW FUNCTIONS ////// DRAW FUNCTIONS //////
	////// DRAW FUNCTIONS ////// DRAW FUNCTIONS ////// DRAW FUNCTIONS //////
	////// DRAW FUNCTIONS ////// DRAW FUNCTIONS ////// DRAW FUNCTIONS //////
	////// DRAW FUNCTIONS ////// DRAW FUNCTIONS ////// DRAW FUNCTIONS //////
	////// DRAW FUNCTIONS ////// DRAW FUNCTIONS ////// DRAW FUNCTIONS //////
	/**
	 * Efface le canvas
	 */
	clear: function() {
		var c = this.oContext;
		c.setTransform(1, 0, 0, 1, 0, 0);
		c.clearRect(0, 0, this.oCanvas.width(), this.oCanvas.height());
	},
	
	/**
	 * Affiche le mur gauche
	 * @param oCanvas canvas source
	 */
	drawWallLeft: function(oCanvas) {
		var c = this.oContext;
		var w = 64;
		var h = 96;
		c.setTransform(1, 0.5, 0, 1, 0, 0);
		if (oCanvas) {
			c.drawImage(oCanvas, 0, 0, w, h, 0, 32, w, h);
		} else {
			c.clearRect(0, 32, w, h);
		}
	},
	
	/**
	 * Affiche le mur droit
	 * @param oCanvas canvas source
	 */
	drawWallRight: function(oCanvas) {
		var c = this.oContext;
		var w = 64;
		var h = 96;
		c.setTransform(1, -0.5, 0, 1, 64, 32);
		if (oCanvas) {
			c.drawImage(oCanvas, 0, 0, w, h, 0, 32, w, h);
		} else {
			c.clearRect(0, 32, w, h);
		}
		c.fillStyle = 'rgba(0, 0, 0, 0.333)';
		c.fillRect(0, 32, w, h);
	},
	
	/**
	 * Affiche le sol
	 * @param oCanvas canvas source
	 */
	drawFloor: function(oCanvas) {
		var c = this.oContext;
		var w = 64;
		var h = 64;
		c.setTransform(1, 0.5, -1, 0.5, 64, 96 + 64);
		if (oCanvas) {
			c.drawImage(oCanvas, 0, 0, w, h, 0, 0, w, h);
			c.drawImage(oCanvas, 0, 0, w, h, -64, 0, w, h);
			c.drawImage(oCanvas, 0, 0, w, h, 0, -64, w, h);
		} else {
			c.clearRect(0, 0, w, h);
			c.clearRect(-64, 0, w, h);
			c.clearRect(0, -64, w, h);
		}
	},
	
	/**
	 * Affiche le plafond
	 * @param oCanvas canvas source
	 */
	drawCeil: function(oCanvas) {
		var c = this.oContext;
		var w = 64;
		var h = 64;
		c.setTransform(1, 0.5, -1, 0.5, 64, 0);
		if (oCanvas) {
			c.drawImage(oCanvas, 0, 0, w, h, 0, 0, w, h);
		} else {
			c.clearRect(0, 0, w, h);
		}
	},
	
	serialize: function() {
		return this.getData();		
	},
	
	unserialize: function(a) {
		this.setData(a);
	}
});
