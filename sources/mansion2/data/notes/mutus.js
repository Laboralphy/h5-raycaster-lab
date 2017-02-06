/**
 * Created by ralphy on 24/01/17?
 * @const MANSION
 * @property MANSION.NOTES.mutus
 * A test document : mutus liber
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
        action: 'Heal',
        caption: 'Read formula',
        legend: 'It may help you defend yourself against hostile and vengeful spirits.'
    }
]);