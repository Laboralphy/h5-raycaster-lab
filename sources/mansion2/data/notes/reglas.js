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
        content: 'This book foretells the coming of a messiah of destruction.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_reglas.jpg',
    },
    {
        type: 'text',
        content: 'The events foretold in this book are extremely pessimistic. ' +
        'Mad cultists are very fond of these kind of writings.'
    },
    {
        type: 'button',
        action: 'Horror',
        caption: 'Read formula',
        legend: 'Reading this book is so depressing...'
    }
]);
