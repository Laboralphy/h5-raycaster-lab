O2.extendClass('RCWE.FileOpenDialog', RCWE.Window, {

	_id: 'fileopendialog',

	oScrollZone: null,
	bMultiple: false,
	
	sLastOpened: '',
	
	oFileSystem: null,
	
	build: function() {
		__inherited('Open File');
		var c = this.getContainer();
		c.addClass('fileopendialog');

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
		//this.addCommand(' Open', 'Load the selected file', this.cmd_open.bind(this));
		this.addCommand('<span class="icon-folder"></span> Open', 'Load the selected file', this.cmd_open.bind(this));
		this.addCommand('<span class="icon-bin" style="color: #A00"></span> Delete', 'Delete the selected file', this.cmd_delete.bind(this));
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
		$.rcweGetJSON('services/', { action: 'level.list' }, (function(data) {
			data.forEach(function(f) {
				var $d = this.makeFileThumbnail({name: f, img: RCWE.CONST.PATH_TEMPLATES + '/levels/' + f + '/thumbnail.png'});
				$d.addClass('remote');
			}, this);
		}).bind(this),
		function(err) {
			W.error(err);
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
		var $removed = $('div.thumbnail.selected', this.oScrollZone);
		var sFile = this.getSelected();
		this.doAction('delete', sFile);
		$removed.fadeOut(function() { $removed.remove(); });
	},
	
	cmd_close: function() {
		this.doAction('close');
	},
});
