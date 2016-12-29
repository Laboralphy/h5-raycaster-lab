O2.extendClass('RCWE.WorldViewer', RCWE.Window, {

	_id: 'worldviewer',

	oContainer:null,
	oCanvas: null,
	oContext: null,
	oToolBar: null,
	oScript: null,
	oSky: null,
	xStart: null,
	yStart: null,
	aStart: null,
	
	oProgress: null,
	
	sScreenShot: '',
	
	build: function() {
		__inherited('World view');
		var $oContainer = this.getContainer();
		$oContainer.addClass('rcViewer');
		
		var $oCanvas = $('<canvas id="screen" width="400" height="250"></canvas>');
		
		var $oScript = $('<textarea style="width: 95%; height: 90%; font-size: 75%"></textarea>');
		$oScript.hide();
		
		this.oCanvas = $oCanvas;
		this.oContext = $oCanvas.get(0).getContext('2d');
		this.oScript = $oScript;
		
		var $progress = $('<div class="progress"><div>Building level...</div><progress id="raycaster_progress" min="0" max="10" value="0"></progress></div>');
		this.getToolBar().append($progress);
		$progress.hide();
		this.oProgress = $progress;
		this.getBody().css('text-align', 'center')
			.append($progress)
			.append($oCanvas)
			.append($oScript);
		
		this.addCommand('<b>↵</b>', 'Exit the rendering view and return to world grid view.', this.cmd_stop.bind(this));
		this.addCommand('', 'show the world definition file', this.cmd_def.bind(this));
		this.addCommand('3D', 'show the rendering window', this.cmd_3d.bind(this)).hide();
		this.addCommandSeparator();
		this.getToolBar().append('<span class="hint" style="font-family: monospace">Use the arrow keys <b>←↑↓→</b> to move the camera. Use <b>C</b> to straffe. Press <b>SPACE</b> to open doors.</span>');
	},
	
	resizeProc: function(oEvent) {
		var hWork, wWork;
		var $screen = $('#screen');
		var $screenContainer = $screen.parent();
		var oScreen = $screen.get(0);
		var fCanvasRatio = oScreen.width / oScreen.height;
		var fContainerRatio = $screenContainer.width() / $screenContainer.height();
		if (fContainerRatio > fCanvasRatio) {
			// check if heights are matching
			hWork = $screenContainer.height();
			if ($screen.height() != hWork) {
				$screen.height(hWork - 8);
				$screen.width($screen.height() * fCanvasRatio | 0);
			}
		} else {
			// check if widths are matching
			wWork = $screenContainer.width();
			if ($screen.width() != wWork) {
				$screen.width(wWork - 16);
				$screen.height($screen.width() / fCanvasRatio | 0);
			}
		}
	},
	
	startGame: function(oLevelData, oConfig) {
		var $screen = $('#screen');
		var $screenContainer = $screen.parent();
		var $progress = $('div.progress', this.getBody());
		$screen.hide();
		$progress.show();
		var g = new RCWE.Game(oLevelData);
		g.setConfig(oConfig);
		var hWork, wWork;
		var pResizeEvent = this.resizeProc;
		g.on('error', (function(sError) {
			this.doAction('error', sError);
		}).bind(this));
		g.on('enter', (function() {
			$progress.hide();
			$screen.show();
			if (this.xStart !== null) {
				var rc = g.oRaycaster.oCamera;
				rc.x = this.xStart;
				rc.y = this.yStart;
				rc.fTheta = this.aStart;
			}
		}).bind(this));
		$(window).on('resize', pResizeEvent);
		g.on('stop', (function() {
			$(window).off('resize', pResizeEvent);
			var rc = g.oRaycaster.oCamera;
			this.xStart = rc.x;
			this.yStart = rc.y;
			this.aStart = rc.fTheta;
		}).bind(this));
		$(window).trigger('resize');
		window.G = g;
	},

	cmd_stop: function() {
		if (window.G) {
			G.screenShot();
			this.sScreenShot = G._oScreenShot.toDataURL();
			G._halt();
			G = null;
		}
		this.oContext.clearRect(0, 0, this.oCanvas.width(), this.oCanvas.height());
		this.doAction('stop');
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
