var O2 = require('o2');	// requis car le module hérite de la classe Plugin
var Plugin = require('mediator').Plugin; // requis : la classe parente
var http = require('httphelper');

/**
 * Ce plugin gère l'envoi d'une image avatar.
 * Lorsqu'un joueur se connecte à l'instance on renvoie l'image
 * au client
 */
var ModOds = O2.extendClass(Plugin, {
	getName: function() {
		return 'ModOds';
	},

	init: function() {
		this.register('playerIn');
		this.register('clientConnecting');
		this.register('clientDisconnecting');
	},
	
	/**
	 * Répond à un évènement de connexion client
	 * data {
	 * 	 s: chaine de service
	 * }
	 */
	clientConnecting: function(oInstance, xData) {
		xData.s.addService(function (c) {
			var sKey = c.getData('key');
			http.writeLog('ody-auth > client key: ' + sKey + ' - requesting');
			http.wget('http://127.0.0.1/ralphy/rcmwlog/auth.php?k=' + c.getData('key'), function(err, data) {
				if (err) {
					http.writeLog('ody-auth > client key: ' + sKey + ' - error');
					throw new Error('error during authentification : ' + err);
				} else {
					c.setData(JSON.parse(data));
					http.writeLog('ody-auth > client key: ' + sKey + ' - response');
				}
				c.next();
			});
		});
	},

	clientDisconnecting: function(oInstance, xData) {
		var oClient = xData.c;
		var oInventory = oClient.getEntity().getData('inventory');
		var aInv = oInventory.getBagItems().map(function(oItem) { return oItem.resref; });
		var oChain = xData.s;
		oChain.addService(function (c) {
			var sKey = oClient.getData('key');
			http.writeLog('ody-save > client key: ' + sKey + ' - requesting');
			var oPostData = {
				key: sKey,
				inventory: aInv
			};
			http.wpost('http://127.0.0.1/ralphy/rcmwlog/save.php', JSON.stringify(oPostData), function(err, data) {
				if (err) {
					http.writeLog('ody-save > client key: ' + sKey + ' - error');
					throw new Error('error during save : ' + err);
				} else {
					http.writeLog('ody-save > client key: ' + sKey + ' - response');
				}
				c.next();
			});
		});
	},

	playerIn: function(oInstance, oData) {
		oInstance.updateHud([oData.e], 'ModOds', {image: oData.c.getData('image'), color: oData.c.getData('color')});
	}
});

module.exports = ModOds;
