/**
 * @const RC raycaster constants
 */
O2.createObject('RC', {
    /**
     * @property OBJECT_TYPE_NONE
     * Mobiles with this type are undefined
     * This property is not used by the framework
     * and should not be used
     */
    OBJECT_TYPE_NONE: 0,

    /**
     * @property OBJECT_TYPE_MOB
     * Mobiles with this type are creatures that roam in the labyrinth
     * They usually got a Thinker procedure and several animation frames.
     */
    OBJECT_TYPE_MOB: 1,

    /**
     * @property OBJECT_TYPE_PLAYER
     * Mobiles with this type are human players.
     * They are assigned a Thinker which is generally controlled by
     * input devices (mouse or keyboard)
     */
    OBJECT_TYPE_PLAYER: 2,

    /**
     * @property OBJECT_TYPE_PLACEABLE
     * Mobiles with this type are considered static objects and are
     * kicked out of the Mobile list and added to the Static list
     * (furniture, trees, structures are generally placeable)
     */
    OBJECT_TYPE_PLACEABLE: 3,

    /**
     * @property OBJECT_TYPE_MISSILE
     * Mobiles with this type are missiles,
     * Generally short lived mobile with a simple thinker and an owner
     * The owner is the mobile (PLAYER or MOB that fired the missile.
     */
    OBJECT_TYPE_MISSILE: 4,

    /**
     * @property OBJECT_TYPE_ITEM
     * A Mobile with this type is an item which can be added to an inventory.
     * Behave like placeable, have no collision, can be picked up
     */
    OBJECT_TYPE_ITEM: 5,

    /**
     * @property FX_NONE
     * No effect assigned to the sprite
     */
    FX_NONE: 0,

    /**
     * @property FX_LIGHT_ADD
     * The sprite will be translucent with an "add" composite drawing operation
     */
    FX_LIGHT_ADD: 1,

    /**
     * @property FX_LIGHT_SOURCE
     * The sprite is a light source, and will not be drawn darker when far
     * from player's point of view
     */
    FX_LIGHT_SOURCE: 2,			// Le sprite ne devien pas plus sombre lorsqu'il s'éloigne de la camera

    /**
     * @property FX_ALPHA_75
     * The sprite opacity is 75%
     */
    FX_ALPHA_75: 1 << 2,

    /**
     * @property FX_ALPHA_50
     * The sprite opacity is 50%
     */
    FX_ALPHA_50: 2 << 2,

    /**
     * @property FX_ALPHA_25
     * The sprite opacity is 25%, almost invisible
     */
    FX_ALPHA_25: 3 << 2,

    /**
     * @property FX_DIM0
     * Undocumented. Used for optimisation.
     */
    FX_DIM0: 0x10,

    /**
     * @property FX_ALPHA
     * This array is internally used by the framework
     */
    FX_ALPHA: [1, 0.75, 0.50, 0.25, 0],


	/**
     * @property TIME_DOOR_DOUBLE
     * Time (in milliseconds) during a double panel door opening
	 */
	TIME_DOOR_DOUBLE: 600,

	/**
	 * @property TIME_DOOR_DOUBLE
	 * Time (in milliseconds) during a single panel door opening (horizontally)
	 */
	TIME_DOOR_SINGLE_HORIZ: 800,

	/**
	 * @property TIME_DOOR_DOUBLE
	 * Time (in milliseconds) during a single panel door opening (vertically)
	 */
	TIME_DOOR_SINGLE_VERT: 800,

	/**
	 * @property TIME_DOOR_DOUBLE
	 * Time (in milliseconds) during a secret passage opening
	 */
	TIME_DOOR_SECRET: 2000,

	/**
	 * @property TIME_DOOR_AUTOCLOSE
	 * Time (in milliseconds) during an autoclose door stays open
	 */
	TIME_DOOR_AUTOCLOSE: 3000,


});

