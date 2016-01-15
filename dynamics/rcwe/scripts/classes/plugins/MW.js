O2.extendClass('RCWE.Plugin.MW', O876.Mediator.Plugin, {
	
	oAdvPadBody: null,
	oAdvPadToolbar: null,
	oForm: null,
	
	description: 'This plugin will export levels for the blight magic multiplayer game.',
	
	getName: function() {
		return 'MW';
	},
	
	init: function() {
		this.build();
	},
	
	build: function() {
		var $toolbar = $('.o876window.AdvancedPad tr.toolbar > td > div');
		var $body = $('.o876window.AdvancedPad tr.body > td > div.body');
		this.oAdvPadBody = $body;
		this.oAdvPadToolbar = $toolbar;
		// ⚀⚁⚂⚃⚄⚅
		var $button = $('<button type="button" title="Exports or imports a MW-Level">MW</button>');
		$toolbar.append($button);
		$button.on('click', this.cmd_buildrdg.bind(this));
	},
	
	// change of texture
	cmd_changetext: function(oEvent) {
		var $target = $(oEvent.target);
		var sNew = $target.val();
		var sType = sNew.charAt(0);
		var $image = $('div.preview.' + sType, this.oForm);
		if ($image.length) {
			$image.css('background-image', 'url(services/mw/textures/' + sNew + ')');
		} else {
			console.error('no image div.preview.' + sType, 'in', this.oForm);
		}
	},
	
	
	// random dungeon generator
	cmd_buildrdg: function(oEvent) {
		var $desc = $('<div class="rdgpad"><p><b>Blight Magic Export</b></p><p>Click on the export button to export the current level to the blight magic network project.</p></div>');
		var $form = $('<form class="rdgpad"></form>');
		$form.append('<hr/>');

		var $importButton = $('<button type="button"> Import</button>');
		$importButton.on('click', this.cmd_import.bind(this));
		$form.append($importButton);

		var $button = $('<button type="button">⚓✎ Overwrite</button>');
		$button.on('click', this.cmd_export.bind(this));
		$form.append($button);		

		var $buttonNew = $('<button type="button">⚓✚ Export new...</button>');
		$buttonNew.on('click', this.cmd_exportnew.bind(this));
		$form.append($buttonNew);		

		
		$form.append('<br/>');
		var $select = $('<select name="map"></select>');
		$select.attr('size', '8');
		$form.append($select);
		$.getJSON('services/?action=mw.list', function(data) {
			data.forEach(function(sMap) {
				var $option = $('<option></option>');
				$select.append($option.val(sMap).html(sMap));
			});
		});

		this.oForm = $form;
		this.oAdvPadBody.empty();
		this.oAdvPadBody.append($desc).append($form);
		var $this = $(oEvent.target);
		$this.siblings().removeClass('selected');
		$this.addClass('selected');
		
	},
	
	runExport: function(sLevel) {
		if (sLevel === null || sLevel === '') {
			return;
		}
		var oApplication = W;
		var data = oApplication.serialize();
		var oAdapter = new RCWE.RCDataBuilder();
		var d2 = oAdapter.buildLevelData(data);
		$.post('services/?action=mw.post&n=' + sLevel, JSON.stringify(d2))
		.fail(function(err) {
			oApplication.error(err.responseText);
		}).success(function(d) {
			oApplication.popup('Message', 'Export done.');
		});
	},
	
	runImport: function(sLevel) {
		if (sLevel === null || sLevel === '') {
			return;
		}
		var oApplication = W;
		$.get('services/?action=mw.import&l=' + sLevel)
		.fail(function(err) {
			oApplication.error(err);
		}).success(function(d) {
			oApplication.unserialize(JSON.parse(d));
			oApplication.cmd_clickOnBlockBrowser();
		});
	},
	
	cmd_exportnew: function() {
		this.runExport(prompt('what is the level name ?'));
	},
	
	cmd_export: function() {
		this.runExport($('select[name="map"]', this.oForm).val());
	},
	
	cmd_import: function() {
		this.runImport($('select[name="map"]', this.oForm).val());
	}
});
