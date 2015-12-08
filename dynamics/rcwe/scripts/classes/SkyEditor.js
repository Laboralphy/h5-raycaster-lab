O2.extendClass('RCWE.SkyEditor', RCWE.Window, {
	build: function() {
		__inherited('SkyEditor');
		this.getContainer().addClass('SkyEditor');
		var $structure = $(
			'<table>' + 
				'<tbody>' + 
					'<tr class="section gradient"><td><form></form></td><td><canvas width="256" height="192" class="gradient"></canvas></td></tr>' + 
					'<tr class="section sky"><td></td><td><img width="256" height="192" class="sky"/></td></tr>' + 
				'</tbody>' +
			'</table>'
		);
		var $form = $('form', $structure);
		$form.append('<div><b>Visibility factors</b></div>');
		$form.append('<div><span class="label">visib :</span><input name="visib" type="number" min="1" max="10" step="1" value="10"/></div>');
		$form.append('<div><span class="label">diffu :</span><input name="diffu" type="number" min="0" max="10" step="1" value="0"/></div>');
		$form.append('<hr/>');
		$form.append('<div><b>Colors</b></div>');
		$form.append('<div><span class="label">ceil :</span><input name="ceil" type="color" value="#666666"/></div>');
		$form.append('<div><span class="label">fog :</span><input name="fog" type="color" value="#000000"/></div>');
		$form.append('<div><span class="label">floor :</span><input name="floor" type="color" value="#999999"/></div>');
		$form.append('<div><span class="label">filtr :</span><input name="filtr" type="color" value="#888888"/></div>');
		var $bResetFiltr = $('<button type="button" title="Reset the filter to its initial value">Reset filtr</button>');
		$bResetFiltr.on('click', function() {
			$('input[name="filtr"]', $form).val('#888888');
		});
		$form.append($('<div></div>').append($bResetFiltr));
		
		$td = $('tr.section.sky td', $structure);
		$td.eq(0).append('<hr/>');
		$td.eq(0).append('<div><b>Sky image</b></div>');
		$td.eq(0).imageLoader({
			load: this.cmd_loadSky.bind(this),
			loadHTML: '<button type="button" title="Load image">Load...</button>',
			emptyable: true
		});		

		
		$('input', $form).on('change', this.draw.bind(this));
		$('img.sky', $structure).hide();

		this.getBody().append($structure);
		this.draw();
	},
	
	getData: function() {
		var $form = $('form', this.getContainer());
		var $inputs = $('input', $form);
		var oRes = {};
		$inputs.each(function() {
			var $input = $(this);
			var sName = $input.attr('name');
			var sValue = $input.val();
			oRes[sName] = $input.attr('type') == 'number' ? sValue | 0 : sValue;
		});
		return oRes;
	},
	
	setData: function(d) {
		var $form = $('form', this.getContainer());
		var $inputs = $('input', $form);
		$inputs.each(function() {
			var $input = $(this);
			var sName = $input.attr('name');
			$input.val(d[sName]);
		});
	},

	draw: function() {
		var $canvas = $('canvas', this.getContainer());
		var $form = $('form', this.getContainer());
		var oContext = $canvas.get(0).getContext('2d');
		var w = $canvas.attr('width') | 0;
		var h = $canvas.attr('height') | 0;
		var oGradient = oContext.createLinearGradient(0, 0, 0, h);
		var oData = this.getData();
		oGradient.addColorStop(0, oData.ceil);
		if (oData.visib == 10) {
			oGradient.addColorStop(0.5, oData.fog);
		} else {
			oGradient.addColorStop(0.5 - (10 - oData.visib) / 20, oData.fog);
			oGradient.addColorStop(0.5 + (10 - oData.visib) / 20, oData.fog);
		}
		oGradient.addColorStop(1, oData.floor);
		oContext.fillStyle = oGradient;
		oContext.fillRect(0, 0, w, h);
		
		oGradient = oContext.createLinearGradient(0, 0, w, 0);
		oGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
		var oFogColor = GfxTools.buildStructure(oData.fog);
		oFogColor.a = 1 - (oData.diffu / 10);
		var sFogColor = GfxTools.buildRGBA(oFogColor);
		if (oData.visib == 10) {
			oGradient.addColorStop(0.5, sFogColor);
		} else {
			oGradient.addColorStop(0.5 - (10 - oData.visib) / 20, sFogColor);
			oGradient.addColorStop(0.5 + (10 - oData.visib) / 20, sFogColor);
		}
		oGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
		oContext.fillStyle = '#AAA';
		oContext.strokeStyle = 'transparent';
		oContext.beginPath();
		oContext.moveTo(0, 0);
		oContext.lineTo(w - 1, h - 1);
		oContext.lineTo(w - 1, 0);
		oContext.lineTo(0, h - 1);
		oContext.lineTo(0, 0);
		oContext.fill();
		oContext.fillStyle = oGradient;
		oContext.fill();
	},

	cmd_loadSky: function(sData) {
		var $img = $('img.sky', this.getContainer());
		$img.fadeOut(function() {
			$img.attr('src',  sData);
			if (sData) {
				$img.fadeIn();
			}
		});
	},

	serialize: function() {
		var d = this.getData();
		var $img = $('img.sky', this.getContainer());
		d.sky = $img.attr('src');
		return d;
	},

	unserialize: function(oData) {
		this.setData(oData);
		if (oData.sky) {
			var $img = $('img.sky', this.getContainer());
			$img.attr('src',  oData.sky);
			this.cmd_loadSky(oData.sky);
		}
		this.draw();
	}
});
