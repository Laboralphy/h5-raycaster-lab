O2.extendClass('Game', O876_Raycaster.Transistate, {
  oRaycaster: null,
  oKbdDevice: null,
  oMotionDevice: null,

  aLevels: null,
  nLevel: 0,
  sLevel: 'level0',

  oHUD: null,
  oHUDData: null,
  aTagMap: null,

  // Persistance entre niveaux
  oPlayerData: null,
  
  TIME_FACTOR: 50,


  /** Initialisation du moteur
   * Initialise le canvas, le timer, le gestionnaire de taches...
   */
  stateInitialize: function() {
    // Initialise le canvas
    this.nInterval = CONFIG.game.interval;
    this.sDoomloopType = CONFIG.game.doomloop;
    this.oRaycaster = new O876_Raycaster.Raycaster();
    if (this.oKbdDevice == null) {
      this.oKbdDevice = new O876_Raycaster.KeyboardDevice();
      this.oKbdDevice.plugEvents();
    }
    if (this.oMotionDevice == null) {
      this.oMotionDevice = new O876_Raycaster.MotionDevice();
      this.oMotionDevice.plugEvents();
    }
	
    this.oRaycaster.setConfig(CONFIG.raycaster);
    this.oRaycaster.TIME_FACTOR = this.TIME_FACTOR;

    // Interface HUD
    if (this.oHUD == null) {
      var oDivHUD = document.getElementById('hud');
      if (oDivHUD.childNodes.length == 0) {
        this.oHUD = document.createTextNode('');
        oDivHUD.appendChild(this.oHUD);
      } else {
        this.oHUD = oDivHUD.childNodes[0];
      }
    }
    

    this.oRaycaster.initialize();

    this.selectLevel();
    this.setDoomloop('stateBuildLevel');
    this.resume();
  },
  
  getKeyboardDevice: function() {
	  return this.oKbdDevice;
  },

  /** Prépare le chargement du niveau. RAZ de tous les objets.
   */
  stateBuildLevel: function() {
    this.loadLevelMap(this.sLevel);
    this.oRaycaster.oThinkerManager = new O876_Raycaster.ThinkerManager();
    this.oRaycaster.oThinkerManager.oGameInstance = this;
    this.oRaycaster.buildLevel();
    var oCT = new PlayerKeyboardThinker(); 
    oCT.oGame = this;
    this.oRaycaster.oCamera.setThinker(oCT);
    if (this.oPlayerData) {
      this.oRaycaster.oCamera.setData('score', this.oPlayerData.score);
    }
    this.oRaycaster.oCamera.data('hitpoints', GEN_DATA.player.maxhitpoints);
    this.oRaycaster.oCamera.data('maxhitpoints', GEN_DATA.player.maxhitpoints);
    this.setDoomloop('stateLoadComplete');
  },

  stateLoadComplete: function() {
    if (this.oRaycaster.oImages.complete()) {
      this.setDoomloop('stateShading');
    }
  },

  stateShading: function() {
    if (this.oRaycaster.shadeProcess()) {
    	this.setDoomloop('stateRunning', CONFIG.game.doomloop);
    }
  },

  stateRunning: function() {
    //this.runTimeDelta(this.oRaycaster, 'frameProcess');
    this.oRaycaster.frameProcess();
    this.oRaycaster.frameRender();
    this.updateHUD();
  },

  ///////////////////////////////////

  updateHUD: function() {
    if (this.oHUDData == null) {
      this.oHUDData = {
        refresh: 0,
        score: 0,
        hp: 0
      };
    }
    var oPlayer = this.oRaycaster.oCamera;
    var nHP = oPlayer.data('hitpoints');
    var nScore = oPlayer.data('score') || 0;
    var bUpdate = nHP != this.oHUDData.hp || nScore != this.oHUDData.score;
    if (bUpdate) {
      this.oHUDData.hp = nHP;
      this.oHUDData.score = nScore;
      var sHUD = '';
      sHUD += 'LIFE: ' + nHP + ' - SCORE: ' + nScore;
      this.oHUD.data = sHUD;
    }
  },

  // Prépare les donnée d'un niveau généré aléatoirement
  selectLevel: function() {
    if (this.aLevels == null) {
      this.aLevels = WORLDS_DATA;
    }
    if (this.aLevels.length > 0) {
      this.nLevel = this.aLevels.shift();
    } else {
      this.nLevel++;
    }
    this.sLevel = 'level' + this.nLevel.toString();
    WORLD_DATA[this.sLevel] = {
      map: this.nLevel,
      walls: GFX_DATA.textures.white,
      tiles: GFX_DATA.tiles,
      visual: {
        ceilColor: {r: 240, g: 240, b: 240},
        floorColor: {r: 250, g: 250, b: 250},
        light: 200,
        fogDistance: 1,
        fogColor: {r: 0, g: 0, b: 0}
      },
      startpoint: {x: 0, y: 0, angle: 0},
      blueprints: BLUEPRINTS,
      objects: []      
    };
  },

  loadLevelMap: function(sName) {
    if (typeof WORLD_DATA[sName].map == 'object') {
      return;
    }
    var nSeed = WORLD_DATA[sName].map;
    var oMap = this.aTagMap = JSON.parse((new O876.XHR()).getSync(CONFIG.game.urlLaby + nSeed));
    var x, y;
    var x64, y64;
    var aMap = [], aMapRow;
    var aMetaCodes = WORLD_DATA[sName].walls.metacodes;
    for (y = 0; y < oMap.length; y++) {
      aMapRow = [];
      y64 = y * this.oRaycaster.nPlaneSpacing + (this.oRaycaster.nPlaneSpacing >> 1);
      for (x = 0; x < oMap[y].length; x++) {
        x64 = x * this.oRaycaster.nPlaneSpacing + (this.oRaycaster.nPlaneSpacing >> 1);
        aMapRow.push(aMetaCodes[oMap[y][x]]);
        switch (oMap[y][x]) {
          case LABY.BLOCK_ENTRANCE: // entrance -> définir le point de départ solo
            if (oMap[y - 2][x] == LABY.BLOCK_VOID) {
              WORLD_DATA[sName].startpoint.y = y64 - (this.oRaycaster.nPlaneSpacing << 1);
              WORLD_DATA[sName].startpoint.x = x64;
              WORLD_DATA[sName].startpoint.angle = - PI / 2;
            }
            if (oMap[y][x - 2] == LABY.BLOCK_VOID) {
              WORLD_DATA[sName].startpoint.y = y64;
              WORLD_DATA[sName].startpoint.x = x64 - (this.oRaycaster.nPlaneSpacing << 1);
              WORLD_DATA[sName].startpoint.angle = PI;
            }
            if (oMap[y + 2][x] == LABY.BLOCK_VOID) {
              WORLD_DATA[sName].startpoint.y = y64 + (this.oRaycaster.nPlaneSpacing << 1);
              WORLD_DATA[sName].startpoint.x = x64;
              WORLD_DATA[sName].startpoint.angle = PI / 2;
            }
            if (oMap[y][x + 2] == LABY.BLOCK_VOID) {
              WORLD_DATA[sName].startpoint.y = y64;
              WORLD_DATA[sName].startpoint.x = x64 + (this.oRaycaster.nPlaneSpacing << 1);
              WORLD_DATA[sName].startpoint.angle = 0;
            }
          break; 

          case LABY.BLOCK_MOB_BASE: // mob
            WORLD_DATA[sName].objects.push({
              blueprint: 'skull',
              x: x64,
              y: y64,
              angle: 0
            });
          break;
        }
      }
      aMap.push(aMapRow);
    }
    WORLD_DATA[sName].map = aMap;
    this.oRaycaster.defineWorld(WORLD_DATA[sName]);
  },


  /** L'objet spécifié tire un missile */
  spawnMissile: function(oMobile, sType) {
    var oMissile = this.oRaycaster.oHorde.spawnMobile(sType, oMobile.x, oMobile.y, oMobile.fTheta);
    oMissile.oThinker.fire(oMobile);
    oMissile.fSpeed = oMissile.data('speed');
    return oMissile;
  },

  /** Endomage le mobile spécifié 
   * Diminue la valeur de "hp"
   */
  damageMobile: function(oMobile, nDamage, oDamager) {
    var oFlash;
    if (oMobile == this.oRaycaster.oCamera) { // cas spécial de la caméra
      oFlash = this.oRaycaster.addGXEffect(O876_Raycaster.GXFlash);
      oFlash.setFlash('#F00', 0.5, 600);
    }
    oMobile.data('hitpoints', oMobile.data('hitpoints') - nDamage);
    if (oMobile.data('hitpoints') <= 0) {
      this.killMobile(oMobile, oDamager);
    }
  },

  /** Soigne un mobile si celui ci possède des point de vie et des points de vie max
   * Le soin ne peut pas dépasser le nombre de points de vie max
   */
  healMobile: function(oMobile, nHeal) {
    var nMaxHP = oMobile.data('maxhitpoints');
    if (nMaxHP && oMobile.data('hitpoints') != null) {
      oMobile.data('hitpoints', Math.min(nMaxHP, oMobile.data('hitpoints') + nHeal));
    }
  },

  /** Détruit un mobile
   * Le score du mobile détruit est ajouté au score du mobile destructeur
   */
  killMobile: function(oMobile, oKiller) {
    oMobile.data('hitpoints', 0);
    if ('thinkDie' in oMobile.oThinker) {
      oMobile.oThinker.think = oMobile.oThinker.thinkDie;
    }
    var nPoints = oMobile.data('score');
    if (nPoints) {
      this.increaseScore(oKiller, nPoints);
    }
  },

  /** Augmente le score
   */
  increaseScore: function(oMobile, nPoints) {
    var nScore = oMobile.data('score');
    if (nScore == null) {
      nScore = 0;
    }
    oMobile.setData('score', nScore + nPoints);
  },


  /** Le mobile active le mur qui se trouve devant lui
   */
  activateWall: function(oMobile) {
    var rc = this.oRaycaster;
    var x = (oMobile.x + Math.cos(oMobile.fTheta) * (rc.nPlaneSpacing * 0.75)) / rc.nPlaneSpacing | 0;
    var y = (oMobile.y + Math.sin(oMobile.fTheta) * (rc.nPlaneSpacing * 0.75)) / rc.nPlaneSpacing | 0;

    var nPhys = this.aTagMap[y][x]; // rc.getMapPhys(x, y);
    var o;
    switch (nPhys) {
      case LABY.BLOCK_DOOR: 
      case LABY.BLOCK_ELEVATOR_UP_DOOR: 
      case LABY.BLOCK_ELEVATOR_DOWN_DOOR:
      case LABY.BLOCK_DOOR_THEME_CELL: 
        if (!Marker.getMarkXY(rc.oDoors, x, y)) {
          // DOORS
          o = new O876_Raycaster.GXDoor(rc);
          o.x = x;
          o.y = y;
          rc.oEffects.addEffect(o);
        }
      break;

      case LABY.BLOCK_TREASURE:
        rc.setMapCode(x, y, 12);
        this.aTagMap[y][x] = 0;
        this.increaseScore(oMobile, 2);
        o = rc.addGXEffect(O876_Raycaster.GXFlash);
        o.setFlash('#FC0', 0.75, 800);
        if (oMobile.getData('maxhitpoints') && oMobile.getData('maxhitpoints') > oMobile.getData('hitpoints')) {
          this.healMobile(oMobile, 8);
        } else {
          this.increaseScore(oMobile, 2);
        }
      break;

      case LABY.BLOCK_SECRET:
        if (!Marker.getMarkXY(rc.oDoors, x, y)) {
          o = new O876_Raycaster.GXSecret(rc);
          o.x = x;
          o.y = y;
          rc.oEffects.addEffect(o);
        }
      break;

      case LABY.BLOCK_ELEVATOR_SWITCH:
        // sauvegarde des données du joueur
        this.oPlayerData = {
          score: rc.oCamera.getData('score')
        };
        this.setDoomloop('stateInitialize');
      break;
    }
  },

  popupMessage: function(sMessage) {
    var oMessage = new O876_Raycaster.GXPopup(this.oRaycaster);
    oMessage.setPopupSize(320, 48);
    oMessage.setPopupText(sMessage);
    this.oRaycaster.oEffects.addEffect(oMessage);
  }
});


function main() {
  window.G = new Game('stateInitialize');
  G.resume();
}
