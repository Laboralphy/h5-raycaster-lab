O2.extendClass('RCWE.FileImportDialog', RCWE.Window, {

	_id: 'fileimportdialog',

	oScrollZone: null,
	bMultiple: false,
	
	sLastOpened: '',
	
	oFileSystem: null,
	
	build: function() {
		__inherited('Import File');
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
		this.addCommand('<b>↵</b>', 'Close the file open dialog and return to the editor', this.cmd_close.bind(this));
		this.addCommand(' Import', 'Load the selected file', this.cmd_open.bind(this));
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
			var $ul = $('<ul class="import"></ul>');
			var $li, $ulsrc;
			for (var sGame in data) {
				$li = $('<li class="source"><span>' + sGame + '</span></li>');
				$ulsrc = $('<ul class="source"></ul>');
				data[sGame].forEach(function(f) {
					var a = f.split('/');
					var s = a.pop().replace(/\.lvl.js$/, '');
					a.push(s);
					var sUrl = a.join('.');
					var $lilevel = $('<li class="level"></li>'); 
					$ulsrc.append($lilevel);
					var $button = $('<button type="button">' + s + '</button>');
					$button.data('file', sUrl);
					$button.on('click', (function(oEvent) {
						var sFile = $(oEvent.target).data('file');
						this.doAction('load', sFile);
					}).bind(this));
					$lilevel.append($button);
				}, this);
				if ($('li', $ulsrc).length === 0) {
					$ulsrc.append('<li class="notfound">no .lvl.js file</li>');
				}
				$li.append($ulsrc);
				$ul.append($li);
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
