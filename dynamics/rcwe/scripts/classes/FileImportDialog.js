O2.extendClass('RCWE.FileImportDialog', RCWE.Window, {

	_id: 'fileimportdialog',

	oScrollZone: null,
	bMultiple: false,
	
	sLastOpened: '',
	
	oFileSystem: null,
	
	build: function() {
		__inherited('Import/Export Levels');
		var c = this.getContainer();
		c.addClass('fileimportdialog');

		// c'est dans cette scrollzone qu'on va afficher les fichiers
		var $oScrollZone = $('<div></div>');
		$oScrollZone.css({
			'overflow-y': 'scroll',
			'width': '100%',
			'height': '100%'
		});
		this.oScrollZone = $oScrollZone;
		this.getBody().append($oScrollZone);
		this.addCommand(' Import', 'Imports the selected level into the editor (overwrites the editor current content)', this.cmd_import.bind(this));
		this.addCommand('⚓✎ Overwrite', 'Exports the editor current level into the selected project, replacing the selected level entry', this.cmd_export.bind(this));
		this.addCommand('⚓✚ Export new...', 'Exports the editor current level into the selected project. Will prompt for a new level name', this.cmd_exportnew.bind(this));
	},
	
	cmd_import: function() {
		var $selectGame = $('select.twinSelect.main', this.getContainer());
		var $selectLevel = $('select.twinSelect.sub', this.getContainer());
		var sGame = $selectGame.val();
		var sLevel = $selectLevel.val();
		if (sGame && sLevel) {
			this.doAction('load', sGame, sLevel);
		} else {
			W.error('You must select a game and a level to perform this operation');
		}
	},

	cmd_export: function() {
		var $selectGame = $('select.twinSelect.main', this.getContainer());
		var $selectLevel = $('select.twinSelect.sub', this.getContainer());
		var sGame = $selectGame.val();
		var sLevel = $selectLevel.val();
		if (sGame && sLevel) {
			this.doAction('save', sGame, sLevel);
		}
	},
	
	cmd_exportnew: function() {
		var $selectGame = $('select.twinSelect.main', this.getContainer());
		var sGame = $selectGame.val();
		if (sGame) {
			this.doAction('save', sGame);
		} else {
			W.error('You must select a game and a level to perform this operation');
		}
	},
	
	show: function() {
		__inherited();
		$.getJSON('services/?action=import.list', (function(data) {
			var $opt;
			var $form = $('<form class="levelSelector"></form>');
			$form.twinSelect({data: data});
			var $both = $('select.twinSelect', $form);
			$both.attr('size', 8);
			$both.detach();
			var $table = $('<table><tr><th>game</th><th>level</th><th></th></tr><tr><td></td><td></td><td></td></tr></table>');
			var $tds = $('td', $table);
			$tds.eq(0).append($both.get(0));
			$tds.eq(1).append($both.get(1));
			
			$form.append($table);
			$p = $('<p><b>Import/Export a level</b></p><p>This is the import/export tool. It can be used to transfer levels from editor and game projects which are located under the <i>sources</i> directory.</p>');
			this.oScrollZone.empty().append($p, $form);
		}).bind(this));
	},


	hide: function() {
		__inherited();
		this.oScrollZone.empty();
	}
});
