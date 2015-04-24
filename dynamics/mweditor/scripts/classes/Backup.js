/**
 * Classe de sauvegarde de l'application
 * Classe spécialisée
 */
O2.extendClass('MWE.Backup', RCWE.Backup, {

	_nVersion: 'mwe',
	_bRemote: true,
	
	save: function(sFile, oThumbnail, bExport) {
		var oApp = this.getApplication();
		var a = [this._sSignature, this._nVersion];
		var aWorld = oApp.oWorldGrid.serialize();
		var aNewWorld = [];
		var aRow;
		var x, y, n;
		var pc = oApp.getPaletteCodes().toHex;
		n = aWorld.length;
		for (y = 0; y < n; ++y) {
			aRow = [];
			for (x = 0; x < n; ++x) {
				aRow.push(pc[aWorld[y][x] & 0xFF] | (pc[aWorld[y][x] >> 8] << 8));
			}
			aNewWorld.push(aRow);
		}
		a.push(aNewWorld);
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
			if (bExport) {
				$.post('fs.php?x=' + sFile, JSON.stringify(oApp.exportGame(a))).fail(function() {
					oApp.error('Could not save the export file ' + sFile + ' on the server.');
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
	
	
	
	loaded_mwe: function(aData) {
		var oApp = this.getApplication();
		var aWorld = aData[2];
		var x, y, n;
		var pc = oApp.getPaletteCodes().fromHex;
		n = aWorld.length;
		var u = 0;
		for (y = 0; y < n; ++y) {
			for (x = 0; x < n; ++x) {
				u = aWorld[y][x] >> 8;
				if (u) {
					// un code upper n'est à prendre en compte que s'il ne vaut pas 0
					u = pc[u] << 8;
				}
				aWorld[y][x] = pc[aWorld[y][x] & 0xFF] | u;
			}
		}
		oApp.oWorldGrid.unserialize(aWorld);
		oApp.oObjectPlacer.unserialize(aData[3]);
		oApp.oSkyView.unserialize(aData[4]);
		oApp.oGradBuilder.unserialize(aData[5]);
		oApp.oWorldView.unserialize(aData[6]);
		oApp.oTagRegistry = aData[7];
	},
});
