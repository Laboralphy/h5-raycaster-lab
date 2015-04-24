O2.createClass('Cutscene', {
	
	RAYCASTER_WIDTH: 800,
	RAYCASTER_HEIGHT: 500,
	
	RAYCASTER_LEVEL: null,
	
	
	// beaucoup de canvas
	oRenderCanvas: null, // canvas de rendu
	oRenderContext: null, // Contexte 2D du canvas de rendu
	oFinalCanvas: null, // canvas de destination, c'est là qu'on copie le canvas de rendu une fois prêt
	oFinalContext: null, // context 2D du canvas final
	oRCCanvas: null, // Canvas du raycaster
	oRCContext: null, // contexte 2D du raycaster
	xRC: 0,
	yRC: 0,
	
	oRaycaster: null,
	oCameraThinker: null,
	
	bRender: false,   // désactivation du rendu avant chargement texture
	
	aPopups: null,
	nTime: 0,
	
	
	
	__construct: function() {
		this.aPopups = [];
		this.oRenderCanvas = O876.CanvasFactory.getCanvas();
		this.oRenderContext = this.oRenderCanvas.getContext('2d'); 
		this.oRCCanvas = O876.CanvasFactory.getCanvas();
		this.oRCCanvas.width = this.RAYCASTER_WIDTH;
		this.oRCCanvas.height = this.RAYCASTER_HEIGHT;
		this.oRCContext = this.oRenderCanvas.getContext('2d');
		this.defineData();
		this.buildRaycaster();
	},
	
	
	/** 
	 * Termine le menu : libération de toutes les ressources occupées
	 */
	finalize: function() {
		this.oRenderCanvas = null;
		this.oRenderContext = null;
		this.oFinalCanvas = null;
		this.oFinalContext = null;
		this.oRCCanvas = null;
		this.oRCContext = null;
		
		this.oRaycaster = null;
		this.oCameraThinker = null;
	},
	
	/**
	 * Construction de l'instance Raycaster
	 */
	buildRaycaster: function() {
		this.bRender = false;
		this.oRaycaster = new O876_Raycaster.Raycaster();
		this.oRaycaster.setConfig({
			canvas: this.oRCCanvas,
			smoothTextures: false,
			ghostVision: 0,
			drawMap: false,
			zoom: 1
		});
		this.oRaycaster.initialize();
		this.oRaycaster.defineWorld(this.RAYCASTER_LEVEL);
		this.oRaycaster.buildLevel();
		var oThinker = this.oRaycaster.oThinkerManager.createThinker('O876_Raycaster.Linear');
		this.oRaycaster.oCamera.setThinker(oThinker);
	},
	
	sortPopups: function(a, b) {
		return a[0] - b[0];
	},
	
	popup: function(sMessage, nDelay) {
		if (nDelay === undefined) {
			nDelay = 0;
		}
		var oGX = new O876_Raycaster.GXMessage(this.oRaycaster);
		oGX.setMessage(sMessage);
		oGX.yTo += 4;
		oGX.yPos = oGX.yTo - 16;
		oGX.buildPath();
		this.aPopups.push([this.nTime + nDelay, oGX]);
		this.aPopups.sort(this.sortPopups);
		return oGX.getTime();
	},
	
	runPopups: function() {
		if (this.aPopups.length) {
			if (this.nTime >= this.aPopups[0][0]) {
				var aGX = this.aPopups.shift();
				this.oRaycaster.oEffects.addEffect(aGX[1]);
			}
		}
	},

	getLabyMap: null,
	getLevelData: null,

	/** 
	 * Définition des données du raycaster
	 */
	defineData: function() {
		this.RAYCASTER_LEVEL = this.getLevelData();
		var aLaby = this.getLabyMap();
		var xBlock, yBlock, aRow, nBlock, nCode;
		for (yBlock = 0; yBlock < aLaby.length; yBlock++) {
			aRow = [];
			for (xBlock = 0; xBlock < aLaby[yBlock].length; xBlock++) {
				nBlock = aLaby[yBlock][xBlock];
				if (nBlock in this.RAYCASTER_LEVEL.walls.metacodes) {
					if (typeof this.RAYCASTER_LEVEL.walls.metacodes[nBlock] === 'object') {
						nCode = MathTools.rndChoose(this.RAYCASTER_LEVEL.walls.metacodes[nBlock]);
					} else {
						nCode = this.RAYCASTER_LEVEL.walls.metacodes[nBlock];
					}
				} else {
					nCode = 0;
				}
				aRow.push(nCode);
			}
			this.RAYCASTER_LEVEL.map.push(aRow);
		}
	},

	/** 
	 * Assigne le canvas de destination à l'objet
	 * @param c HTMLCanvasElement un canvas
	 */
	setFinalCanvas: function(c) {
		this.oFinalCanvas = c;
		this.oFinalContext = c.getContext('2d');
		this.oRenderCanvas.width = c.width;
		this.oRenderCanvas.height = c.height;
	},
	
	onRender: null,
	
	/** 
	 * rendu du menu et copie de la surface dans le canvas de destination
	 */
	render: function() {
		if (this.bRender) {
			this.nTime++;
			this.runPopups();
			// rendu du raycaster
			this.oRaycaster.frameProcess();
			this.oRaycaster.frameRender();
			var xRC = this.xRC;
			var yRC = this.yRC;
			this.oRenderContext.drawImage(this.oRCCanvas, xRC, yRC);
			if (this.onRender) {
				this.onRender();
			}
			this.oFinalContext.drawImage(this.oRenderCanvas, 0, 0);
		} else {
			if (this.oRaycaster.oImages.complete()) {
				if (this.oRaycaster.shadeProcess()) {
					this.bRender = true;
				}
			}
		}
	}
});
