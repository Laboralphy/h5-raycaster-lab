/**
 * An implementation of the Mediator Design Pattern
 * This pattern allows application to communicate with plugins
 * The Client Application instanciate Mediator
 * The plugins are extends of the Plugin Class
 *
 * good to GIT
 */
 
 

O2.createClass('O876.Mediator.Plugin', {
	_oMediator: null,
	_NAME: '',
	
	getName: function() {
		return this._NAME;
	},
	
	register: function(sType) {
		this._oMediator.registerPluginSignal(sType, this);
	},
	
	unregister: function(sType) {
		this._oMediator.unregisterPluginSignal(sType, this);
	},

	setMediator: function(m) {
		this._oMediator = m;
	},
	
	getPlugin: function(s) {
		return this._oMediator.getPlugin(s);
	},
	
	sendSignal: function() {
		var aArgs = Array.prototype.slice.call(arguments, 0);
		return this._oMediator.sendPluginSignal.apply(this._oMediator, aArgs);
	}
});

O2.createClass('O876.Mediator.Mediator', {

	_oPlugins: null,
	_oRegister: null,
	_oApplication: null,
	
	/**
	 * Constructeur
	 */
	__construct: function() {
		this._oPlugins = {};
		this._oRegister = {};
	},
	
	
	setApplication: function(a) {
		return this._oApplication = a;		
	},
	
	getApplication: function() {
		return this._oApplication;		
	},
	
	
	
	/**
	 * Ajoute un plugin
	 * @param oPlugin instance du plugin ajouté
	 * @return instance du plugin ajouté
	 */
	addPlugin: function(oPlugin) {
		if (!('getName' in oPlugin)) {
			throw new Error('O876.Mediator : anonymous plugin');
		}
		var sName = oPlugin.getName();
		if (sName === '') {
			throw new Error('O876.Mediator : undefined plugin name');
		}
		if (!('setMediator' in oPlugin)) {
			throw new Error('O876.Mediator : no Mediator setter in plugin ' + sName);
		}
		if (sName in this._oPlugins) {
			throw new Error('O876.Mediator : duplicate plugin entry ' + sName);
		}
		this._oPlugins[sName] = oPlugin;
		oPlugin.setMediator(this);
		if ('init' in oPlugin) {
			oPlugin.init();
		}
		return oPlugin;
	},
	
	removePlugin: function(x) {
		if (typeof x != 'string') {
			x = x.getName();
		}
		this._oPlugins[x] = null;
	},
	
	/**
	 * Renvoie le plugin dont le nom est spécifié
	 * Renvoie undefined si pas trouvé
	 * @param sName string
	 * @return instance de plugin
	 */
	getPlugin: function(sName) {
		return this._oPlugins[sName];
	},
	
	/**
	 * Enregistrer un plugin pour qu'il réagisse aux signaux de type spécifié
	 * @param sSignal type de signal
	 * @param oPlugin plugin concerné
	 */
	registerPluginSignal: function(sSignal, oPlugin) {
		if (this._oRegister === null) {
			this._oRegister = {};
		}
		if (sSignal in oPlugin) {
			if (!(sSignal in this._oRegister)) {
				this._oRegister[sSignal] = [];
			}
			if (this._oRegister[sSignal].indexOf(oPlugin) < 0) {
				this._oRegister[sSignal].push(oPlugin);
			}
		} else {
			throw new Error('O876.Mediator : no ' + sSignal + ' function in plugin ' + oPlugin.getName());
		}
	},
	
	/** 
	 * Retire le plugin de la liste des plugin signalisés
	 * @param sSignal type de signal
	 * @param oPlugin plugin concerné
	 */
	unregisterPluginSignal: function(sSignal, oPlugin) {
		if (this._oRegister === null) {
			return;
		}
		if (!(sSignal in this._oRegister)) {
			return;
		}
		var n = this._oRegister[sSignal].indexOf(oPlugin);
		if (n >= 0) {
			ArrayTools.removeItem(this._oRegister[sSignal], n);
		}
	},
	
	
	
	/**
	 * Envoie un signal à tous les plugins enregistré pour ce signal
	 * signaux supportés
	 * 
	 * damage(oAggressor, oVictim, nAmount) : lorsqu'une créature en blesse une autre
	 * key(nKey) : lorsqu'une touche est enfoncée ou relachée
	 * time : lorsqu'une unité de temps s'est écoulée
	 * block(nBlockCode, oMobile, x, y) : lorsqu'un block a été activé
	 */
	sendPluginSignal: function(s) {
		var i, p, pi, n;
		if (this._oRegister && (s in this._oRegister)) {
			p = this._oRegister[s];
			n = p.length;
			if (n) {
				var aArgs;
				if (arguments.length > 1) {
					aArgs = Array.prototype.slice.call(arguments, 1);
				} else {
					aArgs = [];
				}
				for (i = 0; i < n; i++) {
					pi = p[i];
					pi[s].apply(pi, aArgs);
				}
			}
		}
	}
});
