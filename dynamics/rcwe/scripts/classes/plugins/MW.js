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
		var $button = $('<button type="button" title="Exports a MW-Level">MW</button>');
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
		var $button = $('<button type="button">⚓ Export</button>');
		$button.on('click', this.cmd_export.bind(this));
		$form.append($button);		
		this.oForm = $form;
		this.oAdvPadBody.empty();
		this.oAdvPadBody.append($desc).append($form);
		var $this = $(oEvent.target);
		$this.siblings().removeClass('selected');
		$this.addClass('selected');
	},
	
	cmd_export: function() {
		var sLevel = prompt('what is the level name ?');
		if (sLevel === null || sLevel === '') {
			return;
		}
		var oApplication = W;
		var data = oApplication.serialize();
		var oAdapter = new RCWE.RCDataBuilder();
		var d2 = oAdapter.buildLevelData(data);
		$.post('services/?action=mw.post&n=' + sLevel, JSON.stringify(d2))
		.fail(function(err) {
			oApplication.error(err);
		}).done(function(d) {
			oApplication.popup('Message', 'Export done.');
		});
	}
});
