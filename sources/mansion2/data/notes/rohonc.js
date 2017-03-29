/**
 * Created by ralphy on 16/01/17.
 * @const MANSION
 * @property MANSION.NOTES.rohonc
 * the rohonc codex
 * Effect : ...
 */
O2.createObject('MANSION.NOTES.rohonc', [
    {
        type: 'title',
        content: 'The Rohonc Codex'
    },
    {
        type: 'text',
        content: 'This illustrated manuscript written by an unknown author, with a text in an unknown language and ' +
        'writing system, that surfaced in Hungary in the early 19th century. It is absolutely incomprehensible.an '
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_rohonc.jpg',
    },
    {
        type: 'text',
        content: 'The codex has 448 paper pages (12x10 cm), each one having between 9 and 14 rows of symbols, ' +
        'which may or may not be letters. Besides the text, there are 87 illustrations that include religious, laic, ' +
        'and military scenes. The crude illustrations seem to indicate an environment where Christian, pagan, ' +
        'and Muslim religions coexist, as the symbols of the cross, crescent, and sun/swastika are all present.'
    },
    {
        type: 'button',
        action: 'Heal',
        caption: 'Try to read',
        legend: 'It gives headache.'
    }
]);



