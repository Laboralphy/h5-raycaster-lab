/** Classe de distribution optimisée de mobiles
 * O876 Raycaster project
 * @date 2012-04-04
 * @author Raphaël Marandet 
 * 
 * Classe gérant une liste de mobile qui seront réutilisé à la demande.
 * Cette classe permet de limiter le nom de d'instanciation/destruction
 */
O2.createClass('O876_Raycaster.MobileDispenser', {
  aBlueprints: null,

  __construct: function() {
    this.aBlueprints = {};
  },

  registerBlueprint: function(sId) {
    this.aBlueprints[sId] = [];
  },

  /** Ajoute un mobile dans sa pile de catégorie
   */
  pushMobile: function(sBlueprint, oMobile) {
    this.aBlueprints[sBlueprint].push(oMobile);
  },

  /**
   * @return O876_Raycaster.Mobile
   */
  popMobile: function(sBlueprint) {
    if (this.aBlueprints[sBlueprint].length) {
      return this.aBlueprints[sBlueprint].pop();
    } else {
      return null;
    }
  },

  render: function() {
    var sRender = '';
    for (var sBlueprint in this.aBlueprints) {
      if (this.aBlueprints[sBlueprint].length) {
        sRender += '[' + sBlueprint + ': ' + this.aBlueprints[sBlueprint].length.toString() + ']';
      }
    }
    return sRender;
  }
});
