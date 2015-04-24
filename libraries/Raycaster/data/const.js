var RC = {
  OBJECT_TYPE_NONE: 0,
  OBJECT_TYPE_MOB: 1,			// Mobile object with Thinker procedure
  OBJECT_TYPE_PLAYER: 2,		// Player (non visible, user controlled mob)
  OBJECT_TYPE_PLACEABLE: 3,		// Non-mobile visible and collisionnable object
  OBJECT_TYPE_MISSILE: 4,		// Short lived mobile with owner 
  OBJECT_TYPE_ITEM: 5,			// Inventory objet
  
  FX_NONE: 0,					// Pas d'effet graphique associé au sprite
  FX_LIGHT_ADD: 1,				// Le sprite est translucide (opération ADD lors du dessin)
  FX_LIGHT_SOURCE: 2,			// Le sprite ne devien pas plus sombre lorsqu'il s'éloigne de la camera
  FX_ALPHA_75: 1 << 2,
  FX_ALPHA_50: 2 << 2,			// le sprite est Alpha 50 % transparent
  FX_ALPHA_25: 3 << 2,
  FX_ALPHA: [1, 0.75, 0.50, 0.25, 0],
  FX_DIM0: 0x10,				// indicateur dim 0 pour corriger un bug graphique d'optimisation
};

