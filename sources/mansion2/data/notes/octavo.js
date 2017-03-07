/**
 * Created by ralphy on 24/01/17?
 * @const MANSION
 * @property MANSION.NOTES.octavo
 * The In-Octavo
 * Effect : Heal
 */
O2.createObject('MANSION.NOTES.octavo', [
    {
        type: 'title',
        content: 'The Octavo'
    },
    {
        type: 'text',
        content: 'The Octavo contains the great eight spells which the Creator himself used to create the "Discworld".' +
            'Unfortunately, the Discworld being an imaginary world, there is no chance the aforementioned spells are working.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_octavo.jpg',
    },
    {
        type: 'text',
        content: 'The Octavo is said to have been forgotten by the Creator once his job was done...'
    },
    {
        type: 'button',
        action: 'Heal',
        caption: 'Read "formula"',
        legend: 'This is a regular book... And a funny one at that.'
    }
]);