O2.createClass('MW.Login', {
	oElements: null,
	
	onLogin: null,
	
	run: function() {
		var sKey = this.getLoginKey();
		if (sKey && this.onLogin) {
			this.onLogin(this);
		} else {
			this.displayLogin();
		}
	},

	displayLogin: function() {
		this.getElement('logo').style.display = '';
		this.getElement('login').style.display = '';
		// rapport de status à chercher en asynchrone (à mettre dans le div status)
		var XHR = new O876.XHR();
		XHR.get('/mwstatus/?h=1', (function(data) {
			this.getElement('status').innerHTML = data;
		}).bind(this));
		// definir le toogle d'options
		this.getElement('options_switch').addEventListener('click', this.toggleOptions.bind(this));
		// "how to play" section : clicking on how to play will display a small window
		this.getElement('htp_switch').addEventListener('click', this.howToPlay.bind(this));
		this.getElement('screen').style.display = 'none';
		this.getElement('nickname').addEventListener('keypress', (function(oEvent) {
			this.getElement('nickname_error').innerHTML = '&nbsp;';
			if (oEvent.keyCode == 13) {
				this.doSubmitLoginForm();
			}
		}).bind(this));
		this.getElement('connect').addEventListener('click', this.doSubmitLoginForm.bind(this));
		this.getElement('options').style.display = 'none';
		this.getElement('nickname').focus();
	},

	/**
	 * Renvoie un élément par son id
	 * @param string s identifiant
	 * @return DOMElement
	 */
	getElement: function(s) {
		if (this.oElements === null) {
			this.oElements = {};
		}
		if (!(s in this.oElements)) {
			this.oElements[s] = document.getElementById(s);
		}
		return this.oElements[s];
	},
	
	toggleOptions: function() {
		var oOptionPad = this.getElement('options');
		var bVisible = oOptionPad.style.display != 'none';
		oOptionPad.style.display = bVisible ? 'none' : 'block';
		this.getElement('options_switch').innerHTML = bVisible ? 'Show options' : 'Hide options';
	},
	
	/**
	 * Vérifie la validité d'un identifiant avant de l'envoyer au serveur
	 * @param string sLogin identifiant
	 * @return bool
	 */
	checkLogin: function(sLogin) {
		// checking login name
		if (sLogin.length < 2) {
			return false;
		} else {
			return true;
		}
	},
	
	/**
	 * Renvoie l'identifiant saisie dans le champ prévu à cet effet
	 * @return string
	 */
	getNickname: function() {
		var oNickname = document.getElementById('nickname');
		if (oNickname) {
			return oNickname.value;
		} else {
			return;
		}
	},
	
	getOptionCheck: function(s) {
		return this.getElement(s).checked;
	},
	
	/**
	 * Démarrage du jeu
	 */
	startGame: function() {
		if (this.onLogin) {
			this.onLogin(this);
		}
	},
	
	/**
	 * Lance l'écran de "how to play"
	 */
	howToPlay: function() {
		var htp = new MW.HowToPlay();
		htp.run();
	},
	
	/**
	 * Affichage de l'écran de jeu
	 */
	displayGameScreen: function() {
		var oLogo = document.getElementById('logo');
		var oLogin = document.getElementById('login');
		var oScreen = document.getElementById('screen');
		oLogo.style.display = 'none';
		oLogin.style.display = 'none';
		if (this.getElement('opt_hires').checked) {
			oScreen.width = 800;
			oScreen.height = 500;
		}
		oScreen.style.display = '';
	},
	
	/**
	 * Lance l'opération de login à partir des données saisie dans le formulaire
	 */
	doSubmitLoginForm: function() {
		var oNickname = this.getElement('nickname');
		var oError = this.getElement('nickname_error');
		var sLogin = oNickname.value;
		if (!this.checkLogin(sLogin)) {
			oError.innerHTML = 'Invalid nickname.';
			return;
		}
		this.displayGameScreen();
		this.startGame();
	},
	
	/**
	 * Analyse la barre de recherche pour tenter de localiser une clé de login
	 */
	getLoginKey: function() {
		var sKey = '';
		var r = location.search.match(/(\?|&)k=([0-9a-z]+)/i);
		if (r) {
			sKey = r[2];
		}
		return sKey;
	}
});
