O2.createClass('RCWE.FileSystem', {
	NAMESPACE: 'module/',
	EXT_FILE: '.file',
	EXT_THUMBNAIL: '.thumb',
	EXT_DATE: '.date',

	/** 
	 * Save a file of the storage
	 */
	save: function(sName, oContent, sThumbnail) {
		var d = Date.now();
		sName = sName.replace(/\./g, '_');
		localStorage.setItem(this.NAMESPACE + sName + this.EXT_FILE, JSON.stringify(oContent));
		localStorage.setItem(this.NAMESPACE + sName + this.EXT_THUMBNAIL, sThumbnail);
		localStorage.setItem(this.NAMESPACE + sName + this.EXT_DATE, d);
	},
	
	load: function(sName) {
		sName = sName.replace(/\./g, '_');
		return JSON.parse(localStorage.getItem(this.NAMESPACE + sName + this.EXT_FILE));
	},
	
	remove: function(sName) {
		sName = sName.replace(/\./g, '_');
		localStorage.removeItem(this.NAMESPACE + sName + this.EXT_FILE);
		localStorage.removeItem(this.NAMESPACE + sName + this.EXT_THUMBNAIL);
		localStorage.removeItem(this.NAMESPACE + sName + this.EXT_DATE);
	},
	
	list: function() {
		var sFile, aRegs, oRegEx = new RegExp('^' + this.NAMESPACE + '([^\\.]+)\\' + this.EXT_FILE + '$');
		var aResult = [];
		for (var i = 0; i < localStorage.length; ++i) {
			sFile = localStorage.key(i);
			aRegs = sFile.match(oRegEx);
			if (aRegs) {
				aResult.push(aRegs[1]);
			}
		}
		return aResult;
	},
	
	getData: function(sFile) {
		return {
			thumb: 	localStorage.getItem(this.NAMESPACE + sFile + this.EXT_THUMBNAIL),
			date: localStorage.getItem(this.NAMESPACE + sFile + this.EXT_DATE)
		}
	},
	
	getStorageUsage: function() {
		var nUsage;
		if ('toSource' in localStorage) {
			nUsage = localStorage.toSource().length;
		} else {
			nUsage = 0;
			var sKey;
			for (var i = 0; i < localStorage.length; ++i) {
				sKey = localStorage.key(i);
				nUsage += sKey.length;
				nUsage += localStorage.getItem(sKey).length;
			}
		}
		return {
			usage: nUsage,
			capacity: 5000000
		};
	}
});
