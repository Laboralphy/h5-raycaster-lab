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
        content: 'The Mysterium Xarxes is a book written by the Daedric prince Mehrunes Dagon.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_xarces.jpg',
    },
    {
        type: 'text',
        content: 'The book also holds various magical incantations and rituals, which can be used to open a portal to ' +
        'Paradise... or not. The four artifact that are required to open such gate are extremely unlikely to be found.'
    },
    {
        type: 'button',
        action: 'Heal',
        caption: 'Read formula',
        legend: 'You notice that someone wrote annotations and compiled a formula. It seems like a Healing incantation.'
    }
]);



