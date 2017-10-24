/**
 * Created by ralphy on 16/01/17.
 * @const MANSION
 * @property MANSION.NOTES.xarces
 * the mysterium xarces
 * Effect : ...
 */
O2.createObject('MANSION.NOTES.xarces', [
    {
        type: 'title',
        content: 'The Mysterium Xarces'
    },
    {
        type: 'text',
        content: 'The Mysterium Xarces is a mysterious book rumoured to be written by a demonic entity.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_xarces.jpg',
    },
    {
        type: 'text',
        content: 'The tome has been brought to mortal realm and is used by cultists in order to summon and unleash ' +
        'legions of demons and spread chaos.'
    },
    {
        type: 'button',
        action: 'Random blessing',
        caption: 'Read formula',
        legend: 'You notice that someone wrote annotations and compiled a formula.'
    }
]);
