/** Un blueprint est un élément de la palette de propriétés
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * Les blueprint servent de modèle et de référence pour alimenter les propriétés des sprites créé dynamiquement pendant le jeu
 */
O2.createClass('O876_Raycaster.Blueprint', {
  sId: '',
  nType: 0,
  // propriétés visuelles
  oTile: null,        // référence objet Tile

  // propriétés physiques
  nPhysWidth: 0,      // Largeur zone impactable
  nPhysHeight: 0,     // Hauteur zone impactable
  sThinker: '',       // Classe de Thinker
  nFx: 0,             // Gfx raster operation
  oXData: null,       // Additional data

  __construct: function(oData) {
    if (oData !== undefined) {
      this.nPhysWidth = oData.width;
      this.nPhysHeight = oData.height;
      this.sThinker = oData.thinker;
      this.nFx = oData.fx;
      this.nType = oData.type;
      if ('data' in oData) {
        this.oXData = oData.data;
      } else {
        this.oXData = {};
      }
    }
  },

  getData: function(sData) {
    if (this.oXData && (sData in this.oXData)) {
      return this.oXData[sData];
    } else {
      return null;
    }
  }
});


