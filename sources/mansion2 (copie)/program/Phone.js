O2.createClass('MANSION.Phone', {
	_oPhone: null,
	aApplications: null,
	sActiveApp: '',
	sCurrentPhone: '',
	
	__construct: function(oRaycaster) {
		this.aApplications = {};
		this._oPhone = {
			port: oRaycaster.addGXEffect(MANSION.GX.PhonePort),
			land: oRaycaster.addGXEffect(MANSION.GX.PhoneLand)
		};
	},
	
	openApplication: function(sApplication) {
		if (this.sActiveApp === sApplication) {
			return this.oApplication;
		}
		if (sApplication in this.aApplications) {
			return this.oApplication = this.aApplications[sApplication];
		} else if (sApplication in MANSION.PhoneApp) {
			var A = MANSION.PhoneApp[sApplication];
			return this.oApplication = this.aApplications[sApplication] = new A();
		} else {
			return null;
		}
	},

	/**
	 * Activates an Application 
	 * - loads the application if not already loaded
	 * - brings over the proper phone (either portrait or landscape)
	 * - displays the application
	 * @param sApplication application name
	 */
	activate: function(sApplication) {
		var oApp;
		if (sApplication in this.aApplications) {
			oApp = this.aApplications[sApplication];
		} else {
			oApp = this.openApplication(sApplication);
		}
		var oNewPhone;
		if (this.sCurrentPhone === oApp.getOrientation()) {
			oNewPhone = this._oPhone[oApp.getOrientation()];
			oNewPhone.setApplication(oApp);
			oNewPhone.show();
		} else {
			var sNewOrient = oApp.getOrientation();
			oNewPhone = this._oPhone[sNewOrient];
			oNewPhone.setApplication(oApp);
			this.sCurrentPhone = sNewOrient;
			this.hide(function() {
				oNewPhone.show();
			});
		}
		return oApp;
	},
	
	isActive: function(sApplication) {
		if (this.sCurrentPhone) {
			if (this._oPhone[this.sCurrentPhone].getStatus() !== 'visible') {
				return false;
			}
			var oApp = this.getCurrentApplication();
			return !!(oApp && oApp.name === sApplication && oApp.getOrientation());
		} else {
			return false;
		}
	},
	
	getCurrentPhone: function() {
		return this._oPhone[this.sCurrentPhone];
	},
	
	getCurrentApplication: function() {
		if (this.sCurrentPhone) {
			return this._oPhone[this.sCurrentPhone].getCurrentApplication();
		} else {
			return null;
		}
	},
	
	/**
	 * Hides phone
	 */
	hide: function(fNext) {
		var p = this._oPhone;
		if (p.land.getStatus('visible')) {
			return p.land.hide(fNext);
		} else if (p.port.getStatus('visible')) {
			return p.port.hide(fNext);
		}
	}
});
