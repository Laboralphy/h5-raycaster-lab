O2.createClass('PlayersheetPlugin', {

	oGame: null,
	oEffectProcessor: null,
	nPreviousMode: 0,

	uiController: function(sCommand, xParams) {
		switch (sCommand) {
			case 'on':
				this.clear();
				this.centerWidget(this.declareWidget(new UI.PlayersheetWindow(xParams)));
				break;
		}
	},

	key: function(nKey) {
		if (this.oGame.nIntfMode == UI.INTFMODE_NONE && nKey == KEYS._INT_SHEET) {
			this.oGame.ui_open('Playersheet', {creature : this.oGame.oDungeon.getPlayerCreature()});
			return true;
		}
		if (this.oGame.nIntfMode == UI.INTFMODE_PLAYERSHEET && nKey == KEYS._INT_SHEET) {
			this.oGame.ui_close();
			return true;
		}
		return false;
	},

	setGame: function(g) {
		this.oGame = g;
		this.oGame.registerPluginSignal('key', this);
	}
});
