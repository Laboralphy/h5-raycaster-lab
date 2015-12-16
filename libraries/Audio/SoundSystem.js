/**
 * Class of multiple channels audio management
 * deals with sound effects and background music
 * deals with crossfading background musics
 */
 
/* globals O2 */

O2.createClass('SoundSystem', {
	CHAN_MUSIC : 99,

	HAVE_NOTHING: 0,		// on n'a aucune information sur l'état du fichier audio ; mieux vaut ne pas lancer la lecture.
	HAVE_METADATA: 1,		// on a les méta données.
	HAVE_CURRENT_DATA: 2,	// on a assez de données pour jouer cette frames seulement.
	HAVE_FUTURE_DATA: 3,	// on a assez de données pour jouer les deux prochaines frames. 
	HAVE_ENOUGH_DATA: 4,	// on a assez de données.
	
	oBase : null,
	aChans : null,
	oMusicChan : null,
	nChanIndex : -1,

	nPlayed : 0,
	
	fMuteVolume: 0,
	bMute: false,
	bAllUsed: false,
	
	sCrossFadeTo: '',
	bCrossFading: false,

	sSndPlayedFile: '',
	fSndPlayedVolume: 0,
	nSndPlayedTime: 0,

	__construct : function() {
		this.oBase = document.getElementsByTagName('body')[0];
		this.aChans = [];
		this.aAmbient = [];
		this.oMusicChan = this.createChan();
		this.oMusicChan.loop = true;
		this.aChans = [];
	},
	
	worthPlaying: function(nTime, sFile, fVolume) {
		if (this.nSndPlayedTime != nTime || this.sSndPlayedFile != sFile || this.fSndPlayedVolume != fVolume) {
			this.sSndPlayedFile = sFile;
			this.fSndPlayedVolume = fVolume;
			this.nSndPlayedTime = nTime;
			return true;
		} else {
			return false;
		}
	},
	
	mute: function() {
		if (!this.bMute) {
			this.oMusicChan.pause();
			this.bMute = true;
		}
	},
	
	unmute: function() {
		if (this.bMute) {
			this.oMusicChan.play();
			this.bMute = false;
		}
	},

	
	destroyItem: function(o) {
		o.parentNode.removeChild(o);
	},

	free : function() {
		for ( var i = 0; i < this.aChans.length; i++) {
			this.destroyItem(this.aChans[i]);
		}
		this.destroyItem(this.oMusicChan);
		this.aChans = [];
	},
	
	createChan: function() {
		var oChan = document.createElement('audio');
		this.oBase.appendChild(oChan);
		return oChan;
	},

	addChan : function() {
		var oChan = this.createChan();
		oChan.setAttribute('preload', 'auto');
		oChan.setAttribute('autoplay', 'autoplay');
		oChan.__file = '';
		this.aChans.push(oChan);
		this.bAllUsed = false;
		return oChan;
	},

	addChans : function(n) {
		for (var i = 0; i < n; i++) {
			this.addChan();
		}
	},

	isChanPlaying : function(nChan, sFile) {
		if (nChan == this.CHAN_MUSIC) {
			return !this.oMusicChan.ended;
		}
		if (nChan < 0) {
			nChan = 0;
		}
		if (nChan >= this.aChans.length) {
			nChan = this.aChans.length - 1;
		}
		var oChan = this.aChans[nChan];
		if (sFile === undefined) {
			return !oChan.ended;
		} else {
			return !(oChan.ended && ((sFile == oChan.__file) || (oChan.__file !== '')));
		}
	},

	isChanFree : function(nChan, sFile) {
		if (nChan == this.CHAN_MUSIC) {
			return this.oMusicChan.ended;
		}
		if (nChan < 0) {
			nChan = 0;
		}
		if (nChan >= this.aChans.length) {
			nChan = this.aChans.length - 1;
		}
		var oChan = this.aChans[nChan];
		if (sFile === undefined) {
			return oChan.ended;
		} else {
			var bEmpty = oChan.__file === '';
			var bNotPlaying = oChan.ended;
			var bAlreadyLoaded = sFile == oChan.__file;
			return bEmpty || (bNotPlaying && bAlreadyLoaded);
		}
	},

	getFreeChan : function(sFile) {
		if (!this.hasChan()) {
			return -1;
		}
		var iChan;
		for (iChan = 0; iChan < this.aChans.length; iChan++) {
			if (this.isChanFree(iChan, sFile)) {
				return iChan;
			}
		}
		for (iChan = 0; iChan < this.aChans.length; iChan++) {
			if (this.isChanFree(iChan)) {
				return iChan;
			}
		}
		this.nChanIndex = (this.nChanIndex + 1) % this.aChans.length;
		return this.nChanIndex;
	},

	hasChan : function() {
		return this.aChans.length > 0;
	},

	play : function(sFile, nChan, fVolume) {
		if (this.bMute) {
			return -1;
		}
		var oChan = null;
		if (sFile === undefined) {
			return -1;
		}
		if (nChan == this.CHAN_MUSIC) {
			this.playMusic(sFile);
			return;
		} else if (this.hasChan()) {
			if (nChan === undefined) {
				nChan = this.getFreeChan(sFile);
			}
			oChan = this.aChans[nChan];
		} else {
			oChan = null;
		}
		if (oChan !== null) {
			if (oChan.__file != sFile) {
				oChan.src = sFile;
				oChan.__file = sFile;
				oChan.load();
			} else if (oChan.readyState > this.HAVE_NOTHING) {
				oChan.currentTime = 0;
				oChan.play();
			}
		}
		if (fVolume !== undefined) {
			oChan.volume = fVolume;
		}
		return nChan;
	},

	/**
	 * Joue le prochain fichier musical dans la liste
	 */
	playMusic : function(sFile) {
		var oChan = this.oMusicChan;
		oChan.src = sFile;
		oChan.load();
		oChan.play();
	},

	/**
	 * Diminue graduellement le volume sonore du canal musical
	 * puis change le fichier sonore
	 * puis remonte graduellement le volume
	 * le programme d'ambience est reseté par cette manip
	 */
	crossFadeMusic: function(sFile) {
		if (this.bCrossFading) {
			this.sCrossFadeTo = sFile;
			return;
		}
		var iVolume = 100;
		var nVolumeDelta = -10;
		this.bCrossFading = true;
		var oInterval = null;
		oInterval = window.setInterval((function() {
			iVolume += nVolumeDelta;
			this.oMusicChan.volume = iVolume / 100;
			if (iVolume <= 0) {
				this.playMusic(sFile);
				this.oMusicChan.volume = 1;
				window.clearInterval(oInterval);
				this.bCrossFading = false;
				if (this.sCrossFadeTo) {
					this.crossFadeMusic(this.sCrossFadeTo);
					this.sCrossFadeTo = '';
				}
			}
		}).bind(this), 100);
	}
});
