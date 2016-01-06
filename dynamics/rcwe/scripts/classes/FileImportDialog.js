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
		//this.addCommand('<b>↵</b>', 'Close the file open dialog and return to the editor', this.cmd_close.bind(this));
		//this.addCommand(' Import', 'Load the selected file', this.cmd_open.bind(this));
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
	
	/**
	 * Make a file thumbnail with the specified data structure
	 * - name : the file name
	 * - img : the image thumbnail
	 */
	makeFileThumbnail: function(aFileDef) {
		var $oDiv = $('<div></div>');
		$oDiv.addClass('thumbnail');
		$oDiv.append('<div class="title">' + aFileDef.name + '</div>');
		if (aFileDef.img) {
			$oDiv.append('<img src="' + aFileDef.img + '"/>');		
		}
		$oDiv.bind('click', this.thumbnailClick.bind(this));
		this.oScrollZone.append($oDiv);
		return $oDiv;
	},
	
	thumbnailClick: function(oEvent) {
		var $oDiv = $(oEvent.currentTarget);
		if (!this.bMultiple) {
			$oDiv.siblings().removeClass('selected');
		}
		$oDiv.toggleClass('selected');
	},

	makeFileThumbnails: function(aList) {
		if (typeof alist === 'string') {
			aList = JSON.parse(aList);
		}
		aList.forEach(this.makeFileThumbnail.bind(this));
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

	show2: function() {
		__inherited();
		$.getJSON('services/?action=import.list', (function(data) {
			function getSelectedProjectFile(oFrom) {
				var $from = $(oFrom);
				var $s = $('select', $from.parents('ul.source'));
				return $('option:selected', $s).val();
			}
			function getSelectedProject(oFrom) {
				var $from = $(oFrom);
				return $from.parents('li.source').data('project');
			}
			var $ul = $('<ul class="import"></ul>');
			var $li, $ulsrc, $option, $select, $b;
			for (var sGame in data) {
				$li = $('<li class="source"><input type="radio" name="game" value="' + sGame + '"/><span>' + sGame + '</span></li>');
				$li.data('project', sGame);
				$ulsrc = $('<ul class="source"></ul>');
				$lisrc = $('<li></li>');
				$ulsrc.append($lisrc);
				$select = $('<select></select>');
				data[sGame].forEach(function(f) {
					var a = f.split('/');
					var s = a.pop().replace(/\.lvl.js$/, '');
					a.push(s);
					var sUrl = a.join('.');
					var $option = $('<option value="' + s + '">' + s + '</option>');
					$option.data('file', sUrl);
					$select.append($option);
				}, this);
				$li.append($ulsrc);
				$ul.append($li);
				$ulsrc.append('<li><button type="button" title="Imports the selected level"> Import</button> <button type="button" title="Export the current level into the selected name"><b>⚓</b> Overwrite</button> <button type="button" title="Export the current level into a new one"><b>⚓</b> Export...</button></li>');
				$b = $('button', $ulsrc);
				if (data[sGame].length === 0) {
					$lisrc.append('<span>no .lvl.js file</span>').addClass('notfound');
					$b.eq(0).attr('disabled', 'disabled');
					$b.eq(1).attr('disabled', 'disabled');
				} else {
					$lisrc.append($select);
					$b.eq(0).removeAttr('disabled').on('click', (function(oEvent) {
						var sSelected = getSelectedProjectFile(oEvent.target);
						var sProject = getSelectedProject(oEvent.target);
						this.doAction('load', sProject, sSelected);
					}).bind(this));
					$b.eq(1).removeAttr('disabled').on('click', (function(oEvent) {
						var sSelected = getSelectedProjectFile(oEvent.target);
						var sProject = getSelectedProject(oEvent.target);
						this.doAction('save', sProject, sSelected);
					}).bind(this));
				}
				$b.eq(2).removeAttr('disabled').on('click', (function(oEvent) {
					var sProject = getSelectedProject(oEvent.target);
					this.doAction('save', sProject);
				}).bind(this));
			}
			this.oScrollZone.empty().append($ul);
		}).bind(this))
		.fail(function(data) {
			W.error(data.responseText);
		});
	},

	hide: function() {
		__inherited();
		this.oScrollZone.empty();
	},
	
	getSelected: function() {
		var aFiles = [];
		$('div.thumbnail.selected div.title', this.oScrollZone).each(function() {
			aFiles.push($(this).html());
		});
		if (this.bMultiple) {
			return aFiles;
		} else {
			return aFiles[0];
		}
	},

	cmd_open: function() {
		var sFile = this.getSelected();
		this.sLastOpened = sFile;
		var $load = $('div.thumbnail.selected', this.oScrollZone);
		if ($load.hasClass('remote')) {
			this.doAction('loadremote', sFile);
		} else {
			this.doAction('load', sFile);
		}
	},
	
	cmd_delete: function() {
		var fs = this.oFileSystem;
		var $removed = $('div.thumbnail.selected', this.oScrollZone);
		if ($removed.hasClass('remote')) {
			this.doAction('cantdelete');
		} else {
			fs.remove(this.getSelected());
			$removed.fadeOut(function() { $removed.remove(); });
		}
	},
	
	cmd_close: function() {
		this.doAction('close');
	},
});
