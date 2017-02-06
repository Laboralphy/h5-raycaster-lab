/**
 * Created by ralphy on 24/01/17?
 * @const MANSION
 * @property MANSION.NOTES.reglas
 * las reglas de ruina
 * Effect : HORROR
 */
O2.createObject('MANSION.NOTES.reglas', [
    {
        type: 'title',
        content: 'Las Reglas de Ruina'
    },
    {
        type: 'text',
        content: 'This book describes the Great Old One Kassogtha, sister and incestuous bride of Cthulhu.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_reglas.jpg',
    },
    {
        type: 'text',
        content: 'The book also foretells of the coming of a messiah of destruction, ' +
        'who would be born in the western land of the red savage across the great ocean in Columbus\' ' +
        'New World, a man that shall set the Great Old One free from her stellar prison.'
    },
    {
        type: 'button',
        action: 'Heal',
        caption: 'Read formula',
        legend: 'It may help you defend yourself against hostile and vengeful spirits.'
    }
]);