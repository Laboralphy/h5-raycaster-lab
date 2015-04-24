O2.extendClass('RCWE.WorldViewer', RCWE.Window, {

	oContainer:null,
	oCanvas: null,
	oContext: null,
	oToolBar: null,
	oScript: null,
	oSky: null,
	xStart: 1,
	yStart: 1,
	aStart: 0,
	
	sScreenShot: '',
	
	onExit: null,
	
	build: function() {
		__inherited('World view');
		var $oContainer = this.getContainer();
		$oContainer.addClass('rcViewer');
		
		var $oCanvas = $('<canvas style="width: 800px; height: 500px" id="screen" width="400" height="250"></canvas>');
		
		var $oScript = $('<textarea style="width: 800px; height: 500px; font-size: 75%"></textarea>');
		$oScript.hide();
		
		this.oCanvas = $oCanvas;
		this.oContext = $oCanvas.get(0).getContext('2d');
		this.oScript = $oScript;
		
		$oContainer.append($oCanvas).append($oScript).append('<div style="font-family: monospace">Use the arrow keys <b>←↑↓→</b> to move the camera. Use <b>C</b> to straffe. Press <b>SPACE</b> to open doors.</div>');
		
		this.addCommand('<b>STOP</b>', 'Exit the renderng view and return to the previous mode.', this.cmd_stop.bind(this));
		this.addCommand('def.', 'show the world definition file', this.cmd_def.bind(this));
		this.addCommand('&nbsp;3D&nbsp;', 'show the world definition file', this.cmd_3d.bind(this)).hide();
	},

	cmd_stop: function() {
		if (window.G) {
			G.screenShot();
			var rc = G.oRaycaster;
			var rcc = rc.oCamera;
			var ps = rc.nPlaneSpacing;
			this.sScreenShot = G._oScreenShot.toDataURL();
			this.xStart = rcc.x / ps | 0;
			this.yStart = rcc.y / ps | 0;
			this.aStart = rcc.fTheta;
			G._halt();
			G = null;
			if (this.onExit) {
				this.onExit(this);
			}
		}
		this.oContext.clearRect(0, 0, this.oCanvas.width(), this.oCanvas.height());
	},
	
	/**
	 * Changement de vue
	 * Concerne deux bouton et deux composant DOM
	 * @param $bFrom objet jquery : Bouton qui a déclenché le changement de vue
	 * @param $bTo objet jquery : Bouton caché qui doit être afficher (pour revenir à la vue précédente
	 * @param $vFrom obj jqu : Composant qui doit disparaitre
	 * @param $vTo obj jqu : Composant qui doit apparaitre
	 */
	changeView: function($bFrom, $bTo, $vFrom, $vTo, sSpeed) {
		sSpeed = sSpeed || 'fast';
		$bFrom.fadeOut(sSpeed, function() {
			$bTo.fadeIn(sSpeed);
		});
		$vFrom.fadeOut(sSpeed, function() {
			$vTo.fadeIn(sSpeed);
		});
	},
	
	cmd_def: function(oEvent) {
		var $b1 = $(oEvent.target);
		var $b2 = $b1.next();
		this.changeView($b1, $b2, this.oCanvas, this.oScript);
	},
	
	cmd_3d: function(oEvent) {
		var $b1 = $(oEvent.target);
		var $b2 = $b1.prev();
		this.changeView($b1, $b2, this.oScript, this.oCanvas);
	},
	
	serialize: function() {
		return [this.xStart, this.yStart, this.aStart];
	},
	
	unserialize: function(a) {
		this.xStart = a[0];
		this.yStart = a[1];
		this.aStart = a[2];
	}
});




