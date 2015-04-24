O2.extendClass('LaserThinker', O876_Raycaster.MissileThinker, {
  thinkHit: function() {
    var nMin, nMax;
    if (this.nExplosionTime === 0) { // Au tout début de l'explosion
      if (this.oLastHitMobile != null) { // J'ai touché un truc ?
        nMin = this.oMobile.getBlueprint('mindamage'); 
        nMax = this.oMobile.getBlueprint('maxdamage'); 
        if (nMax) { // Est ce que j'ai du power ?
          // apparament oui, j'endomage le mobile touché
          G.damageMobile(this.oLastHitMobile, MathTools.rnd(nMin, nMax), this.oOwner);
        }
      }
    }
    __inherited();  // Faire les autre trucs du thinker dans cette phase
  }  
});

