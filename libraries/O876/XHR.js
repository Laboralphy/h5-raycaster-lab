/**
 * Outil d'exploitation de requete Ajax
 * Permet de chainer les requete ajax avec un système de file d'attente.
 * good to GIT
 */

O2.createClass('O876.XHR', {
	_oInstance : null,
	aQueue: null,
	_bAjaxing : false,
	pCurrentCallback : null,
	
	__construct: function() {
		this.aQueue = [];
	},

	// Renvoie une instance XHR
	getInstance : function() {
		if (this._oInstance === null) {
			this._oInstance = new XMLHttpRequest();
			this._oInstance.addEventListener('readystatechange', this._dataReceived.bind(this));
		}
		return this._oInstance;
	},

	_dataReceived : function(oEvent) {
		var xhr = oEvent.target;
		if (xhr.readyState == XMLHttpRequest.DONE) {
			var n = this.aQueue.shift();
			if (n) {
				if (xhr.status == 200) {
					n.callback(xhr.responseText);
				} else {
					n.callback(null, xhr.status.toString());
				}
			}
			if (this.aQueue.length) {
				this.runAjax();
			} else {
				this._bAjaxing = false;
			}
		}
	},

	runAjax: function() {
		this._bAjaxing = true;
		var q = this.aQueue;
		if (q.length) {
			var n = q[0];
			var xhr = this.getInstance();
			xhr.open(n.method, n.url, true);
			xhr.send(n.data);
		}
	},

	autoRunAjax: function() {
		if (!this._bAjaxing) {
			this.runAjax();
		}
	},


	/**
	 * Get data from server asynchronously and feed the spécified DOM Element
	 * 
	 * @param string sURL url
	 * @param object/string/function oTarget
	 * @return string
	 */
	get : function(sURL, pCallback) {
		if (sURL === null) {
			throw new Error('url is invalid');
		}
		this.aQueue.push({method: 'GET', data: null, url: sURL, callback: pCallback});
		this.autoRunAjax();
	},
	
	post: function(sURL, sData, pCallback) {
		if (typeof sData === 'object') {
			sData = JSON.stringify(sData);
		}
		this.aQueue.push({method: 'POST', data: sData, url: sURL, callback: pCallback});
		this.autoRunAjax();
	},
	
	/**
	 * Get data from server synchronously.
	 * It is known that querying synchronously is bad for health and makes animals suffer. 
	 * So don't use synchronous ajax calls.
	 */
	getSync: function(sURL) {
		console.warn('Synchronous Ajax Query (url : ' + sURL + ') ! It is known that querying synchronously is bad for health and makes animals suffer.');
		var xhr = this.getInstance();
		xhr.open('GET', sURL, false);
	    xhr.send(null);
	    if (xhr.status == 200) {
	    	return xhr.responseText;
	    } else {
	    	throw new Error('XHR failed to load: ' + sURL + ' (' + xhr.status.toString() + ')');
	    }
	},

	postSync: function(sURL, sData) {
		console.warn('Synchronous Ajax Query (url : ' + sURL + ') ! It is known that querying synchronously is bad for health and makes animals suffer.');
		var xhr = this.getInstance();
		xhr.open('POST', sURL, false);
	    xhr.send(sData);
	    if (xhr.status == 200) {
	    	return xhr.responseText;
	    } else {
	    	throw new Error('XHR failed to post to: ' + sURL + ' (' + xhr.status.toString() + ')');
	    }
	}
});
