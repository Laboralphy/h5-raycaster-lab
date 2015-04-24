/** Classe de déplacement automatisé et stupidité artificielle des mobiles
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * 
 * Classe spécialisée dans le déplacement des missile
 * Un missile possède deux animation 0: die 1: go
 * Ce thinker gère le dispenser.
 * Réécrire les methode advance et thinkHit pour personnaliser les effets
 */
O2.extendClass('O876_Raycaster.MissileThinker', O876_Raycaster.Thinker, {
  oOwner: null,				// Mobile a qui appartient ce projectile
  nExplosionTime: 0,		// Compteur d'explosion
  nExplosionMaxTime: 4,		// Max du compteur d'explosion (recalculé en fonction de la durée de l'anim)
  bExiting: true,			// Temoin de sortie du canon pour eviter les fausse collision avec le tireur
  oLastHitMobile: null,		// Dernier mobile touché
  nStepSpeed: 4,			// Nombre de déplacement par frame
  
  ANIMATION_EXPLOSION: 0,
  ANIMATION_MOVING: 1,
  
  nLifeOut: 0,
  
  __construct: function() {
    this.think = this.thinkIdle;
  },

  /** Renvoie true si le missile collisionne un objet ou un mur
   */
  isCollisioned: function() {
    var bWallCollision = this.oMobile.oWallCollision.x != 0 || this.oMobile.oWallCollision.y != 0;  // collision murale
    var bMobileCollision = this.oMobile.oMobileCollision !== null;                        // collision avec un mobile
    var nTargetType = bMobileCollision ? this.oMobile.oMobileCollision.getType() : 0;
    var bOwnerCollision = this.oMobile.oMobileCollision == this.oOwner;                   // collision avec le tireur
    var bSolidCollision = bMobileCollision &&                                             // collision avec un mobile solide (non missile, et non item)
      nTargetType != RC.OBJECT_TYPE_MISSILE &&
      nTargetType != RC.OBJECT_TYPE_ITEM;

    if (bWallCollision) {
      this.oMobile.oMobileCollision = null;
      return true;
    }

    if (bOwnerCollision && !this.bExiting) {
      return true;
    }

    if (this.bExiting) {
      this.bExiting = bOwnerCollision;
      return false;
    }

    if (bSolidCollision) {
      return true;
    }
    return false;
  },
  
  advance: function() {
    this.oMobile.moveForward();
  },
  
  explode: function() {
    this.oLastHitMobile = this.oMobile.oMobileCollision;
    this.oMobile.rollbackXY();
    this.oMobile.oSprite.playAnimationType(this.ANIMATION_EXPLOSION);
    this.nExplosionTime = 0;
    this.nExplosionMaxTime = this.oMobile.oSprite.oAnimation.nDuration * this.oMobile.oSprite.oAnimation.nCount;
    this.oMobile.bEthereal = true;
    this.think = this.thinkHit;
  },

  extinct: function() {
    this.oMobile.bEthereal = true;
    this.oMobile.gotoLimbo();
    this.oMobile.oSprite.playAnimationType(-1);
    this.think = this.thinkIdle;
  },

  fire: function(oMobile) {
    this.bExiting = true;
    this.oOwner = oMobile;
    this.oMobile.oSprite.playAnimationType(this.ANIMATION_MOVING);
    this.oMobile.bSlideWall = false;
    this.oMobile.bEthereal = false;
    this.think = this.thinkGo;
    this.advance();
  },

  thinkGo: function() {
	if (this.nLifeOut < this.oGame.nTime) {
      this.extinct();
      return;
	}
    for (var i = 0; i < this.nStepSpeed; i++) {
      this.advance();
      if (this.isCollisioned()) {
        this.explode();
        break;
      }
    }
  },

  thinkHit: function() {
    this.nExplosionTime += this.oGame.TIME_FACTOR;
    if (this.nExplosionTime >= this.nExplosionMaxTime) {		
      this.oMobile.gotoLimbo();
      this.think = this.thinkIdle;
    }
  },

  thinkIdle: function() {
    this.oMobile.bActive = false;
  }
});
