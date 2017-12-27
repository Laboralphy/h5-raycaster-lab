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
            'otherworldly entities.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_vermis.jpg',
    },
    {
        type: 'text',
        content: 'It is unwise to cast such spells without extensive ' +
            'knowledge of the summoned creature.',
    },
    {
        type: 'button',
        action: 'Random curse',
        caption: 'Read a passage',
        legend: 'Don\'t do that'
    }
]);
