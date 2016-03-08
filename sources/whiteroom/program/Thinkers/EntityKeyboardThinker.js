O2.extendClass('EntityKeyboardThinker', O876_Raycaster.KeyboardThinker, {

  think: function() {
    this.updateKeys();
  },

  checkCollision: function() {
    if (this.oMobile.oMobileCollision != null) {
      var oTarget = this.oMobile.oMobileCollision;
      if (oTarget.oSprite.oBlueprint.nType != GEN_DATA.blueprintTypes.missile) {
        this.oMobile.rollbackXY();
      }
    }
  },

  forwardCommand: function() {
    this.oMobile.moveForward();
    this.checkCollision();
  },

  leftCommand: function() {
    if (this.bStrafe) {
      this.oMobile.strafeLeft();
      this.checkCollision();
    } else {
      this.oMobile.rotateLeft();
    }
  },

  rightCommand: function() {
    if (this.bStrafe) {
      this.oMobile.strafeRight();
      this.checkCollision();
    } else {
      this.oMobile.rotateRight();
    }
  },

  strafeDown: function() {
    this.bStrafe = true;
  },

  strafeUp: function() {
    this.bStrafe = false;
  },

  backwardCommand: function() {
    this.oMobile.moveBackward();
    this.checkCollision();
  },

  useDown: function() {
    this.oGame.activateWall(this.oMobile);    
  }
});

