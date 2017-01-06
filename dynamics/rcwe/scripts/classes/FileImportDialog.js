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
		this.addCommand('<span class="icon-download"></span> Import', 'Imports the selected level into the editor (overwrites the editor current content)', this.cmd_import.bind(this));
		this.addCommand('<span class="icon-upload"></span> Overwrite', 'Exports the editor current level into the selected project, replacing the selected level entry', this.cmd_export.bind(this));
		this.addCommand('<span class="icon-upload"></span> Export new...', 'Exports the editor current level into the selected project. Will prompt for a new level name', this.cmd_exportnew.bind(this));
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
	
	cmd_delunused: function(oEvent) {
		var $btn = $(oEvent.target);
		var sProject = $btn.data('project');
		var nTileCount = $btn.data('tilecount');
		if (confirm('Delete ' + nTileCount + ' unused tile' + (nTileCount > 1 ? 's' : '') + ' from ' + sProject + ' project ? ')) {
			$.ajax({
				url: 'services/',
				type: 'POST',
				dataType: 'json',
				data: {
					action: 'import.remunused',
					p: sProject
				},
				success: (function() {
					W.popup('Message', 'Done.');
					this.cmd_checkunused();
				}).bind(this),
				error: function(err) {
					W.error('An error occured while deleting those tiles : ' + err);
				}
			});
		}
	},
	
	cmd_checkunused: function() {
		var sProject = $('select.twinSelect', this.oScrollZone).eq(0).val();
		// ask service
		$.rcweGetJSON('services/', { action: 'import.unused', p: sProject }, (function(data) {
			var $report = $('div.unused', this.oScrollZone);
			$report.empty();
			var nTileCount = Object.keys(data).length;
			if (nTileCount) {
				$report.append('<p>Here is the list of duplicate and unused tiles for <b>' + sProject + '</b>, you should delete them.</p>');
				var $div = $('<div></div>');
				var $remBtn = $('<button type="button" style="font-weight: bold; color: #800">DELETE THESE TILES</button>');
				$report.append($div);
				$div.append($remBtn);
				$remBtn.data('project', sProject);
				$remBtn.data('tilecount', nTileCount);
				$remBtn.on('click', this.cmd_delunused.bind(this));
				for (var sResource in data) {
					if (data[sResource] == 0) {
						$report.append('<img class="unused" src="../../sources/' + sProject + '/resources/tiles/' + sResource + '"/>');
					}
				}
			} else {
				$report.append('<p>It seems there are no unused tiles for <b>' + sProject + '</b>. This is good to know.</p>')
			}
		}).bind(this));
	},
	
	show: function() {
		__inherited();
		$.rcweGetJSON('services/', { action: 'import.list' }, (function(data) {
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
			var $p = $('<p><b>Import/Export a level</b></p><p>This is the import/export tool. It can be used to transfer levels from editor and game projects which are located under the <i>sources</i> directory.</p>');
			this.oScrollZone.empty().append($p, $form);
			
			$p = $('<p><b>Check unused resources</b></p><p>You may check whereas each graphical resource (tile) is unused or missing.</p>');
			var $missingBtn = $('<button type="button">Check unused/missing resources</button>');
			var $unused = $('<div></div>');
			$unused.append($missingBtn);
			var $report = $('<div class="unused"></div>');
			this.oScrollZone.append('<hr/>', $p, $unused, $report);
			$missingBtn.on('click', this.cmd_checkunused.bind(this));
		}).bind(this));
	},


	hide: function() {
		__inherited();
		this.oScrollZone.empty();
	}
});
