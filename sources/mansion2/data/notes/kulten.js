/**
 * Created by ralphy on 31/01/17.
 *
 * @const MANSION
 * @property MANSION.NOTES.kulten
 * "Unaussprechlichen Kulten"
 * effect : SUMMON BAD THINGS
 * will summon a nasty vengefull spirit : SUMMON
 */
O2.createObject('MANSION.NOTES.kulten', [
    {
        type: 'title',
        content: 'Unaussprechlichen Kulten'
    },
    {
        type: 'text',
        content: 'Unaussprechliche Kulten is believed to have been written by Friedrich Wilhelm von Junzt.'
    },
    {
        type: 'text',
            content: 'The text contains information on cults that worship pre-human deities, and their long ' +
            'forgotten temples scattered throughout the world.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_kulten.jpg',
    },
    {
        type: 'text',
            content: 'The book describes secret items used as keys to gains access to treasures hidden in ancient ' +
            'temples and other worshipping spots such as the Black Stone and the Temple of the Toad in Honduras.'
    },
    {
        type: 'button',
        action: 'Summon',
        caption: 'Summon an entity',
        legend: '... at your own risks.'
    }
]);
