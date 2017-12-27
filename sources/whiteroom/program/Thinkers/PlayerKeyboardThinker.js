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
    this.on('forward.down', this.forwardDown.bind(this));
    this.on('backward.down', this.backwardDown.bind(this));
    this.on('left.down', this.leftDown.bind(this));
    this.on('right.down', this.rightDown.bind(this));
    this.on('forward.up', this.forwardUp.bind(this));
    this.on('backward.up', this.backwardUp.bind(this));
    this.on('left.up', this.leftUp.bind(this));
    this.on('right.up', this.rightUp.bind(this));
    this.on('forward.command', this.forwardCommand.bind(this));
    this.on('backward.command', this.backwardCommand.bind(this));
    this.on('left.command', this.leftCommand.bind(this));
    this.on('right.command', this.rightCommand.bind(this));
    this.on('use.down', this.useDown.bind(this));
    this.on('fire.down', this.fireDown.bind(this));
    this.on('strafe.down', this.strafeDown.bind(this));
    this.on('strafe.up', this.strafeUp.bind(this));
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
      var G = MAIN.game;
    G.spawnMissile(this.oMobile, 'l1');
  },

  thinkDie: function() {
    this.oMobile.bEthereal = true;
    this.think = this.thinkDying;
    this.nDeadTime = 18;
    this.oGame.oRaycaster.oEffects.addGXEffect(O876_Raycaster.GXFade).fadeIn('#000', 0.5);
  },

  thinkDying: function() {
      var G = MAIN.game;
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

