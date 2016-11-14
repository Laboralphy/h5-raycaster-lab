O2.extendClass('UI.MainMenu', UI.Window, {
	/**
	 * Création du widget du menu principal
	 */
	__construct: function(ui) {
		__inherited({caption: MANSION.STRINGS_DATA.UI.menu_title});
		this.setSize(128, 128);
		this.setBackgroundImage('resources/ui/windows/menu-main.png');
		var b;

		var bw = 96, bh = 16, bs = 24, bx = 16, by = 40;
		
		for (var o in MANSION.STRINGS_DATA.UI.menu_options) {
			b = new H5UI.Button();
			b.setSize(bw, bh);
			b.moveTo(bx, by);
			b.setCaption(MANSION.STRINGS_DATA.UI.menu_options[o]);
			this.linkControl(b);
			b.on('click', ui.commandFunction(o));
			by += bs;
		}
	}
});
