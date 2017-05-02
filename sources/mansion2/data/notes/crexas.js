/**
 * Created by ralphy on 16/01/17.
 * @const MANSION
 * @property MANSION.NOTES.crexas
 * the mysterium crexas
 * Effect : ...
 */
O2.createObject('MANSION.NOTES.crexas', [
    {
        type: 'title',
        content: 'The Crexas Infernal Tome'
    },
    {
        type: 'text',
        content: 'The Crexas Infernal Tome is a mysterious book rumoured to be written by a demonic entity.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_crexas.jpg',
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



