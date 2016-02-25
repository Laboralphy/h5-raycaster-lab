O2.createObject('MW.Microsyte', {
	oMicrosyte: null,
	bOpen: false,

	/**
	 * Ouverture d'une fenetre
	 * @param string sTitle titre de la fenetre
	 * @param int w largeur de la fenetre en pixels
	 * @param int h hauteur de la fenetre en pixels
	 */
	open: function(sTitle, w, h) {
		if (MW.Microsyte.bOpen) {
			MW.Microsyte.close();
		}
		if ('G' in window) {
			G.getKeyboardDevice().unplugEvents();
		}
		MW.Microsyte.oMicrosyte = new O876.Microsyte('page');
		MW.Microsyte.bOpen = true;
		var m = MW.Microsyte.oMicrosyte;
		m.setSize(w, h);
		m.center();
		m.clear();
		m.show();
		var oTitle = m.linkDiv(sTitle, 4, 4, w - 2);
		oTitle.className = 'title';
	},
	
	/**
	 * Fermeture de la fenetre actuellement ouverte
	 * (et replug des event keaybord)
	 */
	close: function() {
		var m = MW.Microsyte.oMicrosyte;
		m.clear();
		m.hide();
		MW.Microsyte.bOpen = false;
		if ('G' in window) {
			G.getKeyboardDevice().plugEvents();
		}
	},
	
	
	/**
	 * Ouverture de la ligne de saisie du chat
	 */
	openChatForm: function() {
		MW.Microsyte.open('Message', 512, 64);
		var m = MW.Microsyte.oMicrosyte;
		m.linkDiv('<input id="edit_message" style="width: 100%;" />', 24, 40, 512 - 24 - 24);
		var oMsg = document.getElementById('edit_message');
		oMsg.focus();
		oMsg.onkeypress = MW.Microsyte.sendMessage;
		oMsg.onblur = MW.Microsyte.close;
	},
	
	/**
	 * Cette form intervient lorsque le jeu s'acheve
	 * Elle permet d'afficher des information de fin de partie
	 * @param string sTitle titre à afficher
	 * @param string sContent contenu html
	 */
	openInfoForm: function(sTitle, sContent) {
		MW.Microsyte.open(sTitle, 512, 400);
		var m = MW.Microsyte.oMicrosyte;
		m.linkDiv(sContent, 24, 40, 512 - 24 - 8);
	},
	
	/**
	 * Envoie d'un message de chat
	 * Lorsque la fenetre de ligne de saisie de chat est ouverte c'est cet event qui est déclenché quand
	 * on saisi une ligne de texte
	 * @param oEvent evenement javascript en réponse à une touche pressée
	 */
	sendMessage: function(oEvent) {
		if (oEvent.keyCode === 13) {
			var oMsg = document.getElementById('edit_message');
			G.sendChatMessage(oMsg.value);
			MW.Microsyte.close();
			return false;
		}
	}
});
