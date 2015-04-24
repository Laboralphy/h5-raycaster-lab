/** Registres des mobiles. Permet d'enregistrer les mobile dans les secteurs composant le labyrinthe et de pouvoir
 * Organiser plus efficacement les collisions inter-mobile (on n'effectue les tests de collision qu'entre les mobiles des secteur proches).
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 */
O2.createClass('O876_Raycaster.MobileRegister', {
  aSectors: null,         // Secteurs
  nSize: 0,               // Taille des secteur (diviseur position mobile -> secteur)

  /** Construit l'instance en initialisant la taille des secteur 
   * @param n int, taille des secteurs
   */
  __construct: function(n) {
    var x, y;
    this.nSize = n;
    this.aSectors = {};
    for (x = 0; x < n; x++) {
      this.aSectors[x] = {};
      for (y = 0; y < n; y++) {
        this.aSectors[x][y] = [];
      }
    }
  },

  /** Renvoie la référence d'un secteur, la fonction n'effectue pas de test de portée, aussi attention aux paramètres foireux.
   * @param x position du secteur recherché
   * @param y ...
   * @return Secteur trouvé
   */
  get: function(x, y) {
    if (x >= 0 && y >= 0 && y < this.nSize && x < this.nSize) {
      return this.aSectors[x][y];
    } else {
      return null;
    }
  },
  
  /** Désenregistre un mobile de son secteur
   * @param oMobile mobile à désenregistrer
   */
  unregister: function(oMobile) {
    if (oMobile.xSector < 0 || oMobile.ySector < 0 || oMobile.xSector >= this.nSize || oMobile.ySector >= this.nSize) {
      return;
    }
    var aSector = this.aSectors[oMobile.xSector][oMobile.ySector];
    var n = oMobile.nSectorRank;
    if (n == (aSector.length - 1)) {
      aSector.pop();
      oMobile.nSectorRank = -1;
    } else {
      aSector[n] = aSector.pop();
      aSector[n].nSectorRank = n;
    }
  },

  /** Enregistre en mobile dans son secteur, le mobile sera enregistré dans le secteur qu'il occupe réellement, calculé à partir de sa position
   * @param oMobile
   */
  register: function(oMobile) {
    if (oMobile.xSector < 0 || oMobile.ySector < 0 || oMobile.xSector >= this.nSize || oMobile.ySector >= this.nSize) {
      return;
    }
    var aSector = this.aSectors[oMobile.xSector][oMobile.ySector];
    var n = aSector.length;
    aSector.push(oMobile);
    oMobile.nSectorRank = n;
  }
});

