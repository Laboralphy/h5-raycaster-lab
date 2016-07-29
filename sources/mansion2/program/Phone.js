O2.createClass('MANSION.Phone', {
	_oPhone: null,
	aApplications: null,
	sCurrentPhone: '',
	
	__construct: function(oRaycaster) {
		this.aApplications = {};
		var p = {
			//port: oRaycaster.addGXEffect(MANSION.GX.PhonePort),
			port: oRaycaster.addGXEffect(MANSION.GX.PhonePort2),
			land: oRaycaster.addGXEffect(MANSION.GX.PhoneLand)
		};
		this._oPhone = p;
	},
	
	/**
	 * Will instanciate and return the specified application
	 * This factory will only produce singleton
	 */
	openApplication: function(sApplication) {
		if (sApplication in this.aApplications) {
			return this.aApplications[sApplication];
		} else if (sApplication in MANSION.PhoneApp) {
			var A = MANSION.PhoneApp[sApplication];
			return this.aApplications[sApplication] = new A();
		} else {
			return null;
		}
	},
	
	/**
	 * Violently kill currently running application
	 */
	clearApplication: function() {
		var p = this.getCurrentPhone();
		if (p) {
			this.getCurrentPhone().setApplication(null);
			this.sCurrentPhone = '';
		}
	},

	/**
	 * Gently close currently running application
	 * returns true if there was an application to close
	 */
	close: function(sNext) {
		if (this.getCurrentPhone() && this.getCurrentPhone().isVisible()) {
			var oApp = this.getCurrentApplication();
			if (oApp) {
				this.trigger('phone.shutdown.' + oApp.name);
				this.hide((function() {
					this.clearApplication();
					if (sNext) {
						this.activate(sNext);
					}
				}).bind(this));
				return true;
			} else {
				return false;
			}
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
		if (this.close(sApplication)) {
			return;
		}
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
		this.trigger('phone.startup.' + sApplication, {application: oApp});
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
			return this.getCurrentPhone().getCurrentApplication();
		} else {
			return null;
		}
	},
	
	/**
	 * Hides phone
	 */
	hide: function(fNext) {
		var p = this._oPhone;
		if (p.land.getStatus() === 'visible') {
			return p.land.hide(fNext);
		} else if (p.port.getStatus() === 'visible') {
			return p.port.hide(fNext);
		}
		if (fNext) {
			fNext();
		}
	},
	
	/**
	 * Updates phone application according to game logic
	 */
	updateLogic: function(gl) {
		var oApp = this.getCurrentApplication();
		if (oApp) {
			oApp.update(gl);
		}
	}

});

O2.mixin(MANSION.Phone, O876.Mixin.Events);
