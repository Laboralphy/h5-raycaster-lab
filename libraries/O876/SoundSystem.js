/**
 * Class of multiple channels audio management
 * deals with sound effects and background music
 * deals with crossfading background musics
 */
 
/* globals O2 */

O2.createClass('O876.SoundSystem', {
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
		this.aChans = [];
		this._createMusicChannel();
	},
	
	
	/****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ******/
	/****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ******/
	/****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ******/
	/**
	 * Returns true if the specified audio file is worth playing.
	 * and false if it's not.
	 *
	 * A file is worth playing if it has not already started to play a few milliseconds ago.
	 * his is why a "time" value is being passed among parameters
	 * This prevents two similar sounds from being played at very small interval (which produce ugly sound experience)
	 * 
	 * The typical example :
	 * When the player fires five missiles, each missile producing the same sound,
	 * It's not a good idea to play five sounds !
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

	/**
	 * Destroys all audio channels
	 */
	free: function() {
		this.setChannelCount(0);
		this._freeMusicChannel();
	},

	/**
	 * Sets the number of maximum channels
	 * If called more than one time, it will 
	 * delete any previous created channel,
	 * and will rebuild new fresh ones.
	 * @param int n number if channels
	 */
	setChannelCount: function(n) {
		var c = this.aChans;
		while (c.length > n) {
			c.pop().remove();
		}
		while (c.length < n) {
			this._addChan();
		}
	},

	/**
	 * returns the maximum number of useable channels
	 * @return int
	 */
	getChannelCount: function() {
		return this.aChans.length;
	},

	/**
	 * Play another music track, replacing, if needed, the previous music track.
	 * Music tracks are play in a separated channel
	 * @param sFile new file
	 */
	playMusic : function(sFile, bOverride) {
		var oChan = this.oMusicChan;
		oChan.loop = true;
		this._setChanSource(oChan, sFile);
		oChan.load();
		oChan.play();
	},

	/**
	 * Define the directory where sound files are stored
	 * @param s string, path where sound files are stored
	 */
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
		if (sFile === undefined) {
			throw new Error('sound file is not specified');
		}
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
			this.oMusicChan.volume = Math.min(1, Math.max(0, iVolume / 100));
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
	},

	/**
	 * Starts a sound file playback
	 */
	play : function(sFile, fVolume) {
		var nChan = null;
		var oChan = null;
		// check if we should cancel the play call
		if (this.bMute || sFile === undefined) {
			return -1;
		}
		// case : music channel -> redirect to playMusic
		if (nChan == this.CHAN_MUSIC) {
			this.playMusic(sFile);
			return nChan;
		} else if (this._hasChan()) { 
			// checks channel availability
			if (nChan === null) {
				// get a free channel, if none specified
				nChan = this._getFreeChan(sFile);
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
				this._setChanSource(oChan, sFile);
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
	},








	/****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ******/
	/****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ******/
	/****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ******/




	/**
	 * Sets a channel source
	 * Uses default path and extension
	 * This function is used internaly : use play()
	 * @param oChan HTMLAudio Element
	 * @param sSrc what file to play (neither path nor extension)
	 */
	_setChanSource: function(oChan, sSrc) {
		if (sSrc == undefined) {
			throw new Error('undefined sound');
		}
		oChan.src = this.sPath + '/' + this.sFormat + '/' + sSrc + '.' + this.sFormat;
	},
	
	
	/**
	 * creates a new audio channel element
	 * and appends it to the DOM
	 * @return HTMLAudioElement
	 */
	_createChan: function() {
		var oChan = document.createElement('audio');
		this.oBase.appendChild(oChan);
		return oChan;
	},

	/**
	 * Adds and initializes a new Audio channel
	 * @return HTMLAudioElement
	 */
	_addChan : function() {
		var oChan = this._createChan();
		oChan.setAttribute('preload', 'auto');
		oChan.setAttribute('autoplay', 'autoplay');
		oChan.__file = '';
		this.aChans.push(oChan);
		this.bAllUsed = false;
		return oChan;
	},

	/**
	 * returns true if the specified channel iis currently playing
	 * the specified sound file
	 * @param nChan int channel number
	 * @param sFile string sound file name
	 * @return boolean
	 */
	_isChanFree : function(nChan, sFile) {
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

	_getFreeChan : function(sFile) {
		if (!this._hasChan()) {
			return -1;
		}
		var iChan, nChanCount;
		for (iChan = 0, nChanCount = this.aChans.length; iChan < nChanCount; ++iChan) {
			if (this._isChanFree(iChan, sFile)) {
				return iChan;
			}
		}
		for (iChan = 0, nChanCount = this.aChans.length; iChan < nChanCount; ++iChan) {
			if (this._isChanFree(iChan)) {
				return iChan;
			}
		}
		this.nChanIndex = (this.nChanIndex + 1) % this.aChans.length;
		return this.nChanIndex;
	},

	_hasChan : function() {
		return this.aChans.length > 0;
	},

	_freeMusicChannel: function() {
		if (this.oMusicChan) {
			this.oMusicChan.remove();
			this.oMusicChan = null;
		}		
	},

	_createMusicChannel: function() {
		this._freeMusicChannel();
		this.oMusicChan = this._createChan();
		if (this.oMusicChan.canPlayType('audio/ogg')) {
			this.sFormat = 'ogg';
		} else if (this.oMusicChan.canPlayType('audio/mp3')) {
			this.sFormat = 'mp3';
		} else {
			throw new Error('neither ogg nor mp3 can be played back by this browser');
		}
	}

});

