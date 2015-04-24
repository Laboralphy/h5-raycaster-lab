O2.createClass('WSC.ClientSocketAbstract', {
	oSocket: null,
	oEventHandlers: null,


	/**
	 * Envoie d'un message au serveur
	 * @param string sMessage message
	 * @param any xData
	 */
	send: function(sMessage, xData) {
		this.oSocket.emit(sMessage, xData);
	},

	/**
	 * Initie la connexion au server 
	 * Utilise les données affichées dans la bar de location
	 */
	connect: function() {
		var sIP = location.hostname;
		var sPort = location.port;
		this.oSocket = io.connect('http://' + sIP + ':' + sPort + '/');
	},

	/**
	 * Définit un nouveau handler de message socket
	 * Lorsque le client recevra un message de ce type : il appelera la methode correspondante
	 * @param string sEvent message socket à prendre en compte
	 */
	setSocketHandler: function(sEvent, pHandler) {
		if (this.oEventHandlers === null) {
			this.oEventHandlers = {};
		}
		this.oEventHandlers[sEvent] = pHandler;
		this.oSocket.on(sEvent, pHandler);
	},
	
	setSocketHandlers: function(oHandlers) {
		for (var sMessage in oHandlers) {
			this.setSocketHandler(sMessage, oHandlers[sMessage]);
		}
	},
	
	/**
	 * Supprime un gestionnaire de message socket
	 * @param string sEvent message socket à ne plus prendre en compte
	 */
	clearSocketHandler: function(sEvent) {
		this.oSocket.removeListener(sEvent, this.oEventHandlers[sEvent]);
		this.oEventHandlers[sEvent] = null;
	},
	
	/**
	 * Désactive tous les gestionnaires de message socket de cette classe
	 * (leur methode commence par "sc")
	 */
	deactivateNetworkListeners: function() {
		for (var sEvent in this.oEventHandlers) {
			this.clearSocketHandler(sEvent);
		}
		this.oEventHandlers = {};
	},	
	
	/**
	 * Déconnecte le client du server
	 */
	disconnect: function() {
		this.deactivateNetworkListeners();
		this.oSocket.disconnect();
	}
});
