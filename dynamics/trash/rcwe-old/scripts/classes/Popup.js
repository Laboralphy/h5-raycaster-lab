O2.extendClass('RCWE.Popup', RCWE.Document, {
	bOpen: false,
	sBaseClasses: '',
	bFragile: true,
	
	__construct: function() {
		this.build();
		$cont = this.getContainer();
		$cont.addClass('popup');
		this.sBaseClasses = $cont.attr('class');
		$cont.hide();
		$('body').append($cont);
		$('body').bind('mousedown', this.closeIfFragile.bind(this));
		$(document).bind('keydown', this.closeIfEscape.bind(this));
	},
	
	closeIfEscape: function(oEvent) {
		if (oEvent.keyCode === 27) {
			this.close(); 
		}		
	},
	
	closeIfFragile: function(oEvent) {
		if (this.bFragile) {
			this.close(); 
		}		
	},
	
	setClass: function(s) {
		this.getContainer().removeClass().addClass(this.sBaseClasses).addClass(s);
	},
	
	setSize: function(nWidth, nHeight) {
		$cont = this.getContainer();
		var w2 = nWidth >> 1;
		var h2 = nHeight >> 1;
		$cont.css({
			'width': nWidth.toString() + 'px', 
			'height': nHeight.toString() + 'px', 
			'left': '50%', 
			'top': '50%', 
			'position' : 'absolute', 
			'margin-left': '-' + w2.toString() + 'px', 
			'margin-top': '-' + h2.toString() + 'px'
		});		
	},
	
	toggle: function(sPage, nWidth, nHeight) {
		if (this.bOpen) {
			this.close();
		} else {
			this.open(sPage, nWidth, nHeight);
		}
	},
	
	display: function(sTitle, sHTML, nWidth, nHeight) {
		this.bOpen = true;
		this.setSize(nWidth, nHeight);
		this.setContent(sTitle, sHTML);
		$cont = this.getContainer();
		$cont.fadeIn('fast');
	},
	
	open: function(sPage, nWidth, nHeight, bFragile) {
		if (bFragile === undefined) {
			bFragile = true;
		}
		this.bOpen = true;
		$cont = this.getContainer();
		this.setSize(nWidth, nHeight);
		this.load(sPage).done(function() {
			$cont.fadeIn('fast');
		});
		this.bFragile = bFragile;
	},
	
	close: function() {
		if (this.bOpen) {
			this.bOpen = false;
			$cont = this.getContainer();
			$cont.fadeOut('fast');
		}
	}
});