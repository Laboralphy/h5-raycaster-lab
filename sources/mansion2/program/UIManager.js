/**
 * Cette classe est spécialisée dans la gestion de l'UI
 * Particulièrement dan sla création des widgets
 */
O2.createClass('MANSION.UIManager', {

	oSystem: null,

	init: function() {
		H5UI.font.defaultFont = 'monospace';
		H5UI.font.defaultSize = 10;
		var oSystem = new UI.System();
		oSystem.setRenderCanvas(document.getElementById(CONFIG.raycaster.canvas));
		this.oSystem = oSystem;
		this.createMenu();
		oSystem.hide();
	},

	getRenderCanvas: function() {
		if (this.oSystem) {
			return this.oSystem.getRenderCanvas();
		}
	},

	show: function() {
		if (this.oSystem) {
			this.oSystem.show();
		}
	},

	hide: function() {
		if (this.oSystem) {
			this.oSystem.hide();
		}
	},

	isVisible: function() {
		if (this.oSystem) {
			return this.oSystem.isVisible();
		} else {
			return false;
		}
	},

	toggle: function() {
		if (this.isVisible()) {
			this.hide();
		} else {
			this.show();
		}
	},

	render: function() {
		if (this.oSystem) {
			this.oSystem.render();
		}
	},

	/**
	 * Création du widget du menu principal
	 */
	createMenu: function() {
		var w = new UI.Window({caption: MANSION.STRINGS_DATA.UI.menu_title});
		w.setSize(128, 128);
		this.oSystem.declareWidget(w);
		this.oSystem.centerWidget(w);
		var b;

		var bw = 96, bh = 16, bs = 24, bx = 16, by = 40;
		
		for (var o in MANSION.STRINGS_DATA.UI.menu_options) {
			b = new H5UI.Button();
			b.setCaption(MANSION.STRINGS_DATA.UI.menu_options[o]);
			b.setSize(bw, bh);
			b.moveTo(bx, by);
			w.linkControl(b);
			by += bs;
		}
	}
});