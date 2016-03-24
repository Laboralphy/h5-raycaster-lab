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
	
	sFormat: '',
	sPath: '', 
	
	oInterval: null,

	__construct : function() {
		this.oBase = document.body;
		this.aChans = [];
		this.aAmbient = [];
		this.oMusicChan = this.createChan();
		this.oMusicChan.loop = true;
		if (this.oMusicChan.canPlayType('audio/ogg')) {
			this.sFormat = 'ogg';
		} else if (this.oMusicChan.canPlayType('audio/mp3')) {
			this.sFormat = 'mp3';
		} else {
			throw new Error('neither ogg nor mp3 can be played back by this browser');
		}
		this.aChans = [];
	},
	
	setChanSource: function(oChan, sSrc) {
		oChan.src = this.sPath + '/' + this.sFormat + '/' + sSrc + '.' + this.sFormat;
	},
	
	/**
	 * returns true if the specified audio file is worth playing.
	 * will return false if an audio file with the same name, volume
	 * has already been played recently (same timestamp)
	 * @param nTime current timestamp (given by Date.now() for example)
	 * @param sFile audio file name
	 * @param fVolume
	 */
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
	
	/**
	 * Stops sounds from being played
	 * call unmute to restore normal audio function
	 */
	mute: function() {
		if (!this.bMute) {
			this.oMusicChan.pause();
			this.bMute = true;
		}
	},

	/**
	 * Restores normal audio function
	 * useful to restore sound after a mute() call
	 */
	unmute: function() {
		if (this.bMute) {
			this.oMusicChan.play();
			this.bMute = false;
		}
	},

	
	free : function() {
		for ( var i = 0; i < this.aChans.length; i++) {
			this.aChans[i].remove();
		}
		this.oMusicChan.remove();
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
		// case : music channel
		if (nChan == this.CHAN_MUSIC) {
			return this.oMusicChan.ended;
		}
		// check specified channel number validity
		nChan = Math.max(0, Math.min(this.aChans.length - 1, nChan));
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
		var iChan, nChanCount;
		for (iChan = 0, nChanCount = this.aChans.length; iChan < nChanCount; ++iChan) {
			if (this.isChanFree(iChan, sFile)) {
				return iChan;
			}
		}
		for (iChan = 0, nChanCount = this.aChans.length; iChan < nChanCount; ++iChan) {
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
		var oChan = null;
		// check if we should cancel the play call
		if (this.bMute || sFile === undefined) {
			return -1;
		}
		// case : music channel -> redirect to playMusic
		if (nChan == this.CHAN_MUSIC) {
			this.playMusic(sFile);
			return nChan;
		} else if (this.hasChan()) { 
			// checks channel availability
			if (nChan === undefined) {
				// get a free channel, if none specified
				nChan = this.getFreeChan(sFile);
			}
			oChan = this.aChans[nChan];
		} else {
			// no free channel available
			oChan = null;
			return -1;
		}
		if (oChan !== null) {
			// we got a channel
			if (oChan.__file != sFile) {
				// new file
				this.setChanSource(oChan, sFile);
				oChan.__file = sFile;
				oChan.load();
			} else if (oChan.readyState > this.HAVE_NOTHING) {
				// same file, play again from start
				oChan.currentTime = 0;
				oChan.play();
			}
		} else {
			// could not get a channel:
			// exit in shame
			return -1;
		}
		// set volume, if specified
		if (fVolume !== undefined) {
			oChan.volume = fVolume;
		}
		return nChan;
	},

	/**
	 * Joue le prochain fichier musical dans la liste
	 */
	playMusic : function(sFile, bOverride) {
		var oChan = this.oMusicChan;
		this.setChanSource(oChan, sFile);
		oChan.load();
		oChan.play();
	},
	
	setPath: function(s) {
		this.sPath = s;
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
		if (this.oInterval) {
			window.clearInterval(this.oInterval);
		}
		this.oInterval = window.setInterval((function() {
			iVolume += nVolumeDelta;
			this.oMusicChan.volume = iVolume / 100;
			if (iVolume <= 0) {
				this.playMusic(sFile);
				this.oMusicChan.volume = 1;
				window.clearInterval(this.oInterval);
				this.oInterval = null;
				this.bCrossFading = false;
				if (this.sCrossFadeTo) {
					this.crossFadeMusic(this.sCrossFadeTo);
					this.sCrossFadeTo = '';
				}
			}
		}).bind(this), 100);
	}
});
