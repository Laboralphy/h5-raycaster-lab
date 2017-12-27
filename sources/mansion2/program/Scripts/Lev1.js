O2.extendClass('MANSION.Script.Lev1', MANSION.Script.Abstract, {

    /**
     * On active l'auto spawn
     */
    autoSpawnStart: function() {
        this.removeEvent();
        this.game().autoSpawnStart();
    },

    /**
     * On active l'auto spawn
     */
    autoSpawnStop: function() {
        this.removeEvent();
        this.game().autoSpawnStop();
    },

    /**
	 * Dalle : activation du fantome de stray dancer
     */
    wraithStrayDancer: function() {
        if (this.playerHasItem('key_main_door')) {
            this.spawnWraithAtLocator('w_stray_dancer', 'sp_stray_dancer', {
                duration: 3000,
                boo: true
            });
            this.removeEvent();
        }
    },

    wraithDementedKnife: function() {
        this.spawnWraithAtLocator('w_demented_knife', 'sp_demented_knife', {
            boo: true
        });
        this.removeEvent();
    },

    /**
     * On a pris la clé de backyard, cela fait apparaitre un fantome qui va locker la porte
     */
    gotKeyBackyard: function() {
        this.spawnGhost('g_white_teeth');
        this.removeEvent();
    },

    /**
     * On penetre la clairiere de l'est
     */
    enteringEastGlade: function() {
        this.spawnGhost('g_severed_jaw');
        this.removeEvent();
    },

    /**
     * On ressort de la clairiere ouest
     */
    exitingWestGlade: function() {
        if (this.playerHasItem('key_main_door')) {
            this.spawnGhost('g_bashed_boy');
            this.removeEvent();
        }
    },

    lookOutOfMainWindow: function() {
        this.spawnWraithAtLocator('w_twisted_novellist', 'sp_twisted_novellist', {
            duration: 6000,
        });
    }
});
