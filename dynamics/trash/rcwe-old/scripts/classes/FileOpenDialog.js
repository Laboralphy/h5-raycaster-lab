O2.extendClass('RCWE.FileOpenDialog', RCWE.Window, {

	oScrollZone: null,
	bMultiple: false,
	THUMBNAIL_PATH: 'files/thumbnails',
	
	build: function() {
		__inherited('Open File');
		var c = this.getContainer();
		c.addClass('fileopendialog');

		// c'est dans cette scrollzone qu'on va afficher les fichiers
		var $oScrollZone = $('<div></div>');
		$oScrollZone.css({
			'overflow-y': 'scroll',
			'width': '720px',
			'height': '512px'
		});
		this.oScrollZone = $oScrollZone;
		c.append($oScrollZone);

		c.hide();
	},

	makeFileThumbnail: function(aFileDef) {
		var $oDiv = $('<div></div>');
		$oDiv.addClass('thumbnail');
		aFileDef.sort(function(a, b) {
			return a[1] - b[1];
		});
		$oDiv.append('<div class="title">' + aFileDef[0] + '</div>');
		if (aFileDef[2]) {
			$oDiv.append('<img src="' + aFileDef[2] + '"/>');		
		} else {
			$oDiv.append('<img src="' + this.THUMBNAIL_PATH + '/' + aFileDef[0] + '.png"/>');		
		}
		$oDiv.bind('click', this.thumbnailClick.bind(this));
		this.oScrollZone.append($oDiv);
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

	open: function() {
		this.getContainer().show();
		// localStorage
		if (localStorage.length > 0) {
			var sFile, aRegs;
			for (var i = 0; i < localStorage.length; ++i) {
				sFile = localStorage.key(i);
				aRegs = sFile.match(/^rcwe_file_(.*)/);
				if (aRegs) {
					sFile = aRegs[1];
					this.makeFileThumbnail([sFile, localStorage.getItem('rcwe_mfiletime_' + sFile), localStorage.getItem('rcwe_thumbnail_' + sFile)]);
				}
			}
		}
		// remoteServer
		$.get('fs.php?l=1', this.makeFileThumbnails.bind(this));
	},

	close: function() {
		this.getContainer().hide();
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
	}

});
