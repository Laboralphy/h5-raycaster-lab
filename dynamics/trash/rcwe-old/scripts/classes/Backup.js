/**
 * Classe de sauvegarde de l'application
 * Classe spécialisée
 */
O2.createClass('RCWE.Backup', {

	_oApplication: null,
	_sSignature: 'RCWE',
	_nVersion: 1,
	_bRemote: false,
	
	setApplication: function(oApp) {
		this._oApplication = oApp;
	},
	
	getApplication: function() {
		var oApp = this._oApplication;
		if (oApp === null) {
			throw new Error('No application specifiy in the Saver class !');
		}
		return oApp;
	},
	
	save: function(sFile, oThumbnail) {
		var oApp = this.getApplication();
		var a = [this._sSignature, this._nVersion];
		a.push(oApp.oWorldGrid.serialize());
		a.push(oApp.oWallTiles.serialize());
		a.push(oApp.oFlatTiles.serialize());
		a.push(oApp.oBlockBuilder.serialize());
		a.push(oApp.oObjectBuilder.serialize());
		a.push(oApp.oObjectPlacer.serialize());
		a.push(oApp.oSkyView.serialize());
		a.push(oApp.oGradBuilder.serialize());
		a.push(oApp.oWorldView.serialize());
		a.push(oApp.oTagRegistry);
		if (this._bRemote) {
			$.post('fs.php?w=' + sFile, JSON.stringify(a)).fail(function() {
				oApp.error('Could not save the file ' + sFile + ' on the server.');
			});
			if (oThumbnail) {
				$.post('fs.php?t=' + sFile, oThumbnail).fail(function() {
					oApp.error('Could not save the thumbnail of ' + sFile + ' on the server.');
				});
			}
		} else {
			try {
				localStorage.setItem('rcwe_file_' + sFile, JSON.stringify(a));
				localStorage.setItem('rcwe_mfiletime_' + sFile, Date.now());
				localStorage.setItem('rcwe_thumbnail_' + sFile, oThumbnail);
			} catch (e) {
				localStorage.removeItem('rcwe_file_' + sFile);
				localStorage.removeItem('rcwe_mfiletime_' + sFile);
				localStorage.removeItem('rcwe_thumbnail_' + sFile);
				oApp.error('Could not save the file ' + sFile + ' on the local storage (There is usually a storage limit of 5MB).');
			}
		}
	},
	
	
	loaded: function(aData) {
		var oApp = this.getApplication();
		var sSignature = aData[0];
		if (sSignature != this._sSignature) {
			oApp.error('Loaded data is not of the expected format');
			return;
		} 
		var nVersion = aData[1];
		var p = this['loaded_' + nVersion.toString()];
		if (p) {
			p.apply(this, [aData]);
		} else {
			oApp.error('There is no loader function for this version : ' + nVersion);
		}
	},
	
	loaded_1: function(aData) {
		var oApp = this.getApplication();
		oApp.oWorldGrid.unserialize(aData[2]);
		oApp.oWallTiles.unserialize(aData[3]);
		oApp.oFlatTiles.unserialize(aData[4]);
		oApp.oBlockBuilder.unserialize(aData[5]);
		oApp.oObjectBuilder.unserialize(aData[6]);
		oApp.oObjectPlacer.unserialize(aData[7]);
		oApp.oSkyView.unserialize(aData[8]);
		oApp.oGradBuilder.unserialize(aData[9]);
		oApp.oWorldView.unserialize(aData[10]);
		oApp.oTagRegistry = aData[11];
	},
	

	load: function(sFile) {
		var oApp = this.getApplication();
		// determiner si remote ou local
		var sData = localStorage.getItem('rcwe_file_' + sFile);
		if (sData === null) {
			$.getJSON('fs.php?r=' + sFile, this.loaded.bind(this)).fail(function() {
				oApp.error('Could not load the requested file : ' + sFile + '.');
			});
		} else {
			this.loaded(JSON.parse(sData));
		}
	}
	
});