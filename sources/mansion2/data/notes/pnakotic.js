/**
 * Created by ralphy on 31/01/17.
 *
 * @const MANSION
 * @property MANSION.NOTES.pnakotic
 * "Pnakotic Manuscripts"
 * Effect Haste
 */
O2.createObject('MANSION.NOTES.pnakotic', [
    {
        type: 'title',
        content: 'Pnakotic Manuscripts'
    },
    {
        type: 'text',
        content: 'A collection of alien writings that were kept in the Great Race\'s library city of Pnakotus.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_pnakotic.jpg',
    },
    {
        type: 'text',
            content: 'A variety of subjects, including descriptions of ' +
            'greater and lesser dark deities and their rituals.'
    },
    {
        type: 'button',
        action: 'Haste',
        caption: 'Read formula',
        legend: 'This will slightly increase your walking speed.'
    }
]);
