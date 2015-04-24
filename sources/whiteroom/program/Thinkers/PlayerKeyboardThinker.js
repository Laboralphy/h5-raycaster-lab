O2.extendClass('PlayerKeyboardThinker', EntityKeyboardThinker, {
  nDeadTime: 0,
  nRotationTime: 0,
  nRotationMask: 0,
  nRotationLeftTime: 0,
  nRotationRightTime: 0,

  ROTATION_MASK_LEFT: 0,
  ROTATION_MASK_RIGHT: 1,
  ROTATION_MASK_FORWARD: 2,
  ROTATION_MASK_BACKWARD: 3,



  __construct: function() {
    this.defineKeys({
      forward: KEYS.UP,
      backward: KEYS.DOWN,
      left: KEYS.LEFT,
      right: KEYS.RIGHT,
      use: KEYS.SPACE,
      fire: KEYS.ALPHANUM.X,
      strafe: KEYS.ALPHANUM.C
    });
  },
  
  setRotationMask: function(nBit, bValue) {
    var nMask = 1 << nBit;
    var nNotMask = 255 ^ nMask;
    if (bValue) {
      this.nRotationMask |= nMask;
    } else {
      this.nRotationMask &= nNotMask;
      if (this.nRotationMask == 0) {
        this.nRotationTime = 0;
      }
    }
  },

  forwardDown: function() {
    this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
  },

  backwardDown: function() {
    this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
  },

  leftDown: function() {
    this.setRotationMask(this.ROTATION_MASK_LEFT, true);
  },

  rightDown: function() {
    this.setRotationMask(this.ROTATION_MASK_RIGHT, true);
  },

  forwardUp: function() {
    this.setRotationMask(this.ROTATION_MASK_FORWARD, false);
  },

  backwardUp: function() {
    this.setRotationMask(this.ROTATION_MASK_FORWARD, false);
  },

  leftUp: function() {
    this.setRotationMask(this.ROTATION_MASK_LEFT, false);
  },

  rightUp: function() {
    this.setRotationMask(this.ROTATION_MASK_RIGHT, false);
  },

  processRotationSpeed: function() {
    if (this.nRotationMask != 0) {
      this.nRotationTime++;
      switch (this.nRotationTime) {  
        case 1:
          this.oMobile.fRotSpeed = GEN_DATA.speeds.player.rotation / 4;
        break;

        case 4:
          this.oMobile.fRotSpeed = GEN_DATA.speeds.player.rotation / 2;
        break;

        case 8:
          this.oMobile.fRotSpeed = GEN_DATA.speeds.player.rotation;
        break;
      }
    }
  },


  forwardCommand: function() {
    this.processRotationSpeed();
    __inherited();
  },
  
  leftCommand: function() {
    this.processRotationSpeed();
    __inherited();
  },
  
  rightCommand: function() {
    this.processRotationSpeed();
    __inherited();
  },

  fireDown: function() {
    G.spawnMissile(this.oMobile, 'l1');
  },

  thinkDie: function() {
    this.oMobile.bEthereal = true;
    this.think = this.thinkDying;
    this.nDeadTime = 18;
    var oFadeOut = new O876_Raycaster.GXFade(this.oGame.oRaycaster);
    oFadeOut.oColor = {r: 0, g: 0, b: 0};
    oFadeOut.fAlpha = 0;
    oFadeOut.fAlphaFade = 0.05;
    this.oGame.oRaycaster.oEffects.addEffect(oFadeOut);
  },

  thinkDying: function() {
    this.nDeadTime--;
    if (this.nDeadTime <= 0) {
      this.think = this.thinkDead;
      G.pause();
      window.alert('GAME OVER');
    }
  },

  thinkDead: function() {
  }
});

