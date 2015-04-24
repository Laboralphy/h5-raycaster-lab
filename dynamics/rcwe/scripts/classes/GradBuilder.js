O2.extendClass('RCWE.GradBuilder', RCWE.Window, {

	oCanvas: null,
	oContext: null,
	
	oVisual: null,
	
	build: function() {
		__inherited('Gradient builder');
		var c = this.getContainer();
		
		var $oCanvas = $('<canvas width="320" height="240"></canvas>');
		var oContext = $oCanvas.get(0).getContext('2d');
		this.oCanvas = $oCanvas.get(0);
		this.oContext = oContext;
		
		var $oForm = $('<form style="float: left"></form>');
		$oForm.append('<span class="label" title="ceil color (if neither sky nor ceil texture defined)">&nbsp;ceil:<input type="text" size="4" name="ceil" value="#888"/><br/>');
		$oForm.append('<span class="label" title="fog color">&nbsp;&nbsp;fog:<input type="text" size="4" name="fog" value="#000"/><br/>');
		$oForm.append('<span class="label" title="floor color (if neither sky nor floor texture defined)">floor:<input type="text" size="4" name="floor" value="#666"/><br/>');
		$oForm.append('<span class="label" title="fog intensity factor between 0 and 1">fdist:<input type="text" size="4" name="fogdist" value="1"/><br/>');
		$oForm.append('<span class="label" title="light factor (20 = low light, 200 = bright light, 10000 = no shadow at all)">light:<input type="text" size="4" name="light" value="100"/><br/>');
		$oForm.append('<span class="label" title="light emitted from walls (value is between 0 (no light diffused) and 1 (no shading on walls))">diffu:<input type="text" size="4" name="diffuse" value="0"/><br/>');
		$oForm.append('<span class="label" title="color filter applied to object to match the ambience">filtr:<input type="text" size="4" name="filter" value="#888"/><br/>');
		$('input[name="ceil"], input[name="floor"], input[name="fog"], input[name="filter"]', $oForm).colorf3({change: this.updateCanvas.bind(this)});
		$('input[name="fogdist"], input[name="light"], input[name="diffuse"]', $oForm).bind('change', this.updateCanvas.bind(this));
		var $oDiv = $('<div align="center"></div>');
		$oDiv.append($oCanvas);
		c.append($oForm).append($oDiv).append('<br style="clear: both" />');
		
		this.oForm = $oForm;
		this.updateCanvas();
	},
	
	updateCanvas: function() {
		var $ceil = $('input[name="ceil"]', this.oForm);
		var $fog = $('input[name="fog"]', this.oForm);
		var $floor = $('input[name="floor"]', this.oForm);
		var $fogdist = $('input[name="fogdist"]', this.oForm);
		var $light = $('input[name="light"]', this.oForm);
		var $diffuse = $('input[name="diffuse"]', this.oForm);
		var $filter= $('input[name="filter"]', this.oForm);

		var f, sFilter = $filter.val();
		if (sFilter != '') { 
			f = GfxTools.buildStructure(sFilter);
			f.r = f.r / 0x88;
			f.g = f.g / 0x88;
			f.b = f.b / 0x88;
			if (f.r == 0x88 && f.g == 0x88 && f.b == 0x88) {
				f = false;
			}
		} else {
			f = false;
		}
		
		this.oVisual = {
				floorColor: $floor.val(),	
				ceilColor: $ceil.val(),	
				fogColor: $fog.val(),
				fogDistance: $fogdist.val(),
				gradients: null,
				filter: f,
				light: $light.val(),
				diffuse: $diffuse.val()
		};
		this.buildGradient();
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		var h2 = h >> 1;
		this.oContext.fillStyle = this.oVisual.gradients[0];
		this.oContext.fillRect(0, 0, w, h2);
		this.oContext.fillStyle = this.oVisual.gradients[1];
		this.oContext.fillRect(0, h2, w, h2);
	},
	
	/** Création des gradient
	 * pour augmenter la luz :
	 * this.oVisual.light = 200; 
	 * this.oVisual.fogDistance = 1; 
	 * G.oRaycaster.buildGradient();
	 */
	buildGradient : function() {
		var g;
		this.oVisual.gradients = [];
		g = this.oContext.createLinearGradient(0, 0, 0, this.oCanvas.height >> 1);
		g.addColorStop(0, GfxTools.buildRGBA(this.oVisual.ceilColor));
		if (this.oVisual.fogDistance < 1) {
			g.addColorStop(this.oVisual.fogDistance, GfxTools.buildRGBA(this.oVisual.fogColor));
		}
		g.addColorStop(1, GfxTools.buildRGBA(this.oVisual.fogColor));
		this.oVisual.gradients[0] = g;

		g = this.oContext.createLinearGradient(0, this.oCanvas.height - 1, 0, (this.oCanvas.height >> 1) + 1);
		g.addColorStop(0, GfxTools.buildRGBA(this.oVisual.floorColor));
		if (this.oVisual.fogDistance < 1) {
			g.addColorStop(this.oVisual.fogDistance, GfxTools.buildRGBA(this.oVisual.fogColor));
		}
		g.addColorStop(1, GfxTools.buildRGBA(this.oVisual.fogColor));
		this.oVisual.gradients[1] = g;
	},
	
	getVisual: function() {
		var v = this.oVisual;
		this.updateCanvas();
		var oVisual = {
			ceilColor : GfxTools.buildStructure(v.ceilColor), 
			floorColor : GfxTools.buildStructure(v.floorColor), 
			fogColor : GfxTools.buildStructure(v.fogColor), 
			fogDistance : v.fogDistance,
			filter : v.filter,
			light : v.light,
			diffuse: v.diffuse
		};
		return oVisual;
	},
	
	serialize: function() {
		return this.getVisual();
	},
	
	unserialize: function(a) {
		$('input[name="ceil"]', this.oForm).val('#' + GfxTools.buildString3FromStructure(a.ceilColor));
		$('input[name="floor"]', this.oForm).val('#' + GfxTools.buildString3FromStructure(a.floorColor));
		$('input[name="fog"]', this.oForm).val('#' + GfxTools.buildString3FromStructure(a.fogColor));
		$('input[name="fogdist"]', this.oForm).val(a.fogDistance);
		$('input[name="light"]', this.oForm).val(a.light);
		$('input[name="diffuse"]', this.oForm).val(a.diffuse);
		var f = false;
		if (a.filter) {
			f = {
				r: a.filter.r * 0x88 | 0,
				g: a.filter.g * 0x88 | 0,
				b: a.filter.b * 0x88 | 0
			};
		}
		$('input[name="filter"]', this.oForm).val(a.filter === false ? '#888' : GfxTools.buildString3FromStructure(f));
		this.updateCanvas();
	}
});