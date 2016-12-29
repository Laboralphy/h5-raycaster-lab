/**
 * Cette classe est spécialisée dans la gestion de l'UI
 * Particulièrement dans la création des widgets
 */
O2.createClass('MANSION.UIManager', {

	oSystem: null,
	
	oWidgets: null,

	init: function() {
		H5UI.font.defaultFont = 'monospace';
		H5UI.font.defaultSize = 10;
		var oSystem = new UI.System();
		oSystem.setRenderCanvas(document.getElementById(CONFIG.raycaster.canvas));
		this.oSystem = oSystem;
		this.oWidgets = {};
		this.oWidgets.menu = this.declareWidget(new UI.MainMenu(this));
		this.oWidgets.album = this.declareWidget(new UI.Album(this));
		this.oWidgets.notes = this.declareWidget(new UI.Notes(this));
		this.displayWidget('menu');
		oSystem.hide();
	},
	
	declareWidget: function(w) {
		this.oSystem.oScreen.linkControl(w);
		this.oSystem.centerWidget(w);
		return w;
	},

	getWidget: function(s) {
		return this.oWidgets[s];
	},
	
	displayWidget: function(s) {
		var w, wShown;
		for (var sWidget in this.oWidgets) {
			w = this.oWidgets[sWidget];
			if (s === sWidget) {
				w.show();
				wShown = w;
			} else {
				w.hide();
			}
		}
		return wShown;
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
	
	commandFunction: function(sCommand, oExtraParams) {
		oExtraParams = oExtraParams || {};
		oExtraParams.command = sCommand;
		return (function(oEvent) {
			this.trigger('command', oExtraParams);
			oEvent.stop = true;
		}).bind(this);
	}
});

O2.mixin(MANSION.UIManager, O876.Mixin.Events);
