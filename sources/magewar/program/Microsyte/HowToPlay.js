O2.createClass('MW.HowToPlay', {
	nPage: 0,
	aPages: null,
	aButton: null,
	
	display: function(n) {
		if (n <= 0) {
			this.aButtons[0].disabled = 'disabled';
		} else {
			this.aButtons[0].disabled = '';
		}
		if (n >= (this.aPages.length - 1)) {
			this.aButtons[1].disabled = 'disabled';
		} else {
			this.aButtons[1].disabled = '';
		}
		this.nPage = Math.max(0, Math.min(this.aPages.length, n));
		var XHR = new O876.XHR();
		XHR.get(this.aPages[this.nPage], this.oPage);
	},
	
	next: function() {
		this.display(this.nPage + 1);
	},

	prev: function() {
		this.display(this.nPage - 1);
	},

	run: function() {
		var w = 512, h = 480;
		MW.Microsyte.open('How to play', 512, 480);
		var oButtonBar = MW.Microsyte.oMicrosyte.linkDiv('<button type="button">◀ Previous</button> <button type="button">▶ Next</button> <button type="button">✖ Close</button>', 0, 0);
		oButtonBar.style.right = '16px';
		oButtonBar.style.bottom = '16px';
		oButtonBar.style.left = '';
		oButtonBar.style.top = '';
		this.aButtons = oButtonBar.getElementsByTagName('button');
		this.aButtons[0].addEventListener('click', this.prev.bind(this));
		this.aButtons[1].addEventListener('click', this.next.bind(this));
		this.aButtons[2].addEventListener('click', MW.Microsyte.close);
		this.oPage = MW.Microsyte.oMicrosyte.linkDiv('', 24, 40, 512 - 24 - 8);
		this.aPages = [
			'resources/pages/index.html',
			'resources/pages/man-controls.html',
			'resources/pages/man-controls-adv.html',
			'resources/pages/man-spacebar.html',
			'resources/pages/man-alchemy.html',
			'resources/pages/man-end.html'
		];
		this.display(0);
	}
});
