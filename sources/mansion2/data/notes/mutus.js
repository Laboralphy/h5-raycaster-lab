/**
 * Created by ralphy on 24/01/17?
 * @const MANSION
 * @property MANSION.NOTES.mutus
 * mutus liber
 * effect : LIGHT + POWER UP
 * This is an alchemy book.
 */
O2.createObject('MANSION.NOTES.mutus', [
    {
        type: 'title',
        content: 'Mutus Liber'
    },
    {
        type: 'text',
        content: 'Many alchemist claimed to have written this enigmatic book.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_mutus.jpg',
    },
    {
        type: 'text',
        content: 'Consisting mainly of illustrated plates, Mutus Liber shows how to proceed to achieve the Great Work, ' +
            'whose ultimate purpose is to obtain the philosopher’s stone.'
    },
    {
        type: 'button',
        action: 'Light',
        caption: 'Read formula',
        legend: ''
    }
]);