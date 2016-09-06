// Ce thinker permet de détecter la camera
// Pour une partie solo
O2.extendClass('SkullThinker', O876_Raycaster.Thinker, {
  nAngle: 0,
  nSearchAngle: 0,
  fAngle: 0,
  dx: 0, 
  dy: 0,
  oDummyData: null,
  aAngles: null,
  nTime: 0,
  nAction: 0,

  nLastFireTime: 0,
  nNewActionTime: 0,
  nDeadTime: 0,
  

  __construct: function() {
    this.aAngles = [0, 0.25 * PI, 0.5 * PI, 0.75 * PI, PI, -0.75 * PI, -0.5 * PI, -0.25 * PI];
    this.oDummyData = { oContinueRay: {bContinue: false} };
    this.think = this.thinkStart;
  },

  searchForPlayer: function() {
    this.nSearchAngle = (this.nSearchAngle + 1) % 32;
    this.fAngle = (((this.nSearchAngle - 16) * PI) / 32) + this.oMobile.fTheta;
    this.dx = Math.cos(this.fAngle);
    this.dy = Math.sin(this.fAngle);
    var rc = this.oGame.oRaycaster;
    var aVisibles = this.oGame.oRaycaster.castRay(this.oDummyData, this.oMobile.x, this.oMobile.y, this.dx, this.dy);
    var x, y, aSprites, i;
    return Marker.getMarkXY(aVisibles, rc.oCamera.xSector, rc.oCamera.ySector);
  },

  thinkStart: function() {
    //this.oMobile.fTheta = this.aAngles[Math.random(0, this.aAngles.length - 1)];
    this.oMobile.fSpeed = this.oMobile.data('speed');
    this.oMobile.data('hitpoints', this.oMobile.data('hitpoints'));
    this.oMobile.bEthereal = false;
    this.oMobile.oSprite.playAnimationType(1);
    this.think = this.thinkSearch;
  },

  // recherche de joueur.
  // Si un joueur est trouvé on passe à thinkFollow.
  thinkSearch: function() {
    this.nTime++;
    this.oMobile.oSprite.playAnimationType(1);
    if ((this.nTime % 200) == 0) {
      this.nAngle = MathTools.rnd(0, 7);
      this.oMobile.setAngle(this.aAngles[this.nAngle]);
    }
    if (this.searchForPlayer()) {
      this.think = this.thinkFollow;
    }
  },

  // choix d'une action. déplacement
  // recherche d'un joueur
  // Si joueur trouvé on lui tire dessus
  thinkFollow: function() {
    this.nTime++;
    if (this.nNewActionTime <= this.nTime) { // changement d'activité si le timer tombe à zero
      this.oMobile.oSprite.playAnimationType(1);
      this.nAngle = MathTools.rnd(0, 7);
      this.oMobile.fTheta = this.aAngles[this.nAngle];
      this.nNewActionTime = this.nTime + MathTools.rnd(20, 24);
    } else {
      this.oMobile.moveForward();
      if (this.oMobile.oWallCollision.x || this.oMobile.oWallCollision.y || this.oMobile.oMobileCollision != null) {
        this.nNewActionTime = this.nTime;
      }
      if (this.searchForPlayer()) {
        this.oMobile.fTheta = this.fAngle ;
        this.oMobile.oSprite.playAnimationType(2);
        this.nLastFireTime = this.nTime + 6; 
        this.think = this.thinkFire;
      }
    }
  },

  // Tir
  // Animation puis tir
  thinkFire: function() {
    this.nTime++;
    if (this.nLastFireTime <= this.nTime) {
      G.spawnMissile(this.oMobile, 'l3');
      this.oMobile.oSprite.playAnimationType(1);
      this.think = this.thinkFollow;
    }
  },

  thinkDie: function() {
    this.nTime++;
    this.oMobile.oSprite.playAnimationType(0);
    this.oMobile.bEthereal = true;
    this.nDeadTime = this.oMobile.oSprite.oAnimation.nDuration * (this.oMobile.oSprite.oAnimation.nCount);
    this.think = this.thinkDying;
  },

  thinkDying: function() {
    this.nDeadTime -= G.TIME_FACTOR;
    if (this.nDeadTime <= 0) {
      this.oMobile.gotoLimbo();
      this.think = this.thinkDead;
    }
  },

  thinkDead: function() {
    this.oMobile.bActive = false;
  }  
});
