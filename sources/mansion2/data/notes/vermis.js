/**
 * Created by ralphy on 24/01/17.
 * @const MANSION
 * @property MANSION.NOTES.vermis
 * "De Vermis Mysteriis" by "Ludwig Prinn"
 * Effect : SUMMON NASTY THING
 */
O2.createObject('MANSION.NOTES.vermis', [
    {
        type: 'title',
        content: 'De Vermis Mysteriis'
    },
    {
        type: 'text',
        content: 'This book, written by Ludwig Prinn, contains spells and enchantments for summoning and bindings ' +
            'otherworldly entities. But it is unwise to cast such spells without extensive ' +
            'knowledge of the summoned creature as aforementionned creature could easily ' +
            'feed on its summoner.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_vermis.jpg',
    },
    {
        type: 'text',
        content: 'There should be no surprise : All entities that can be summoned with ' +
            'this book are utterly evil.',
    },
    {
        type: 'button',
        action: 'Horror',
        caption: 'Summon an entity',
        legend: '... at your own risks.'
    }
]);
