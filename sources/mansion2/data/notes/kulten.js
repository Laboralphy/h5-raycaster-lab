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
            content: 'The text contains information on cults that worship pre-human deities such as Ghatanothoa ' +
            'and includes hieroglyphs relating to the latter. There is also information on more recent cults including ' +
            'that of Bran, The Dark Man.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_kulten.jpg',
    },
    {
        type: 'text',
            content: 'The book describes secret items used as keys to gains access to treasures hidden in mysterious place ' +
                'such as the Black Stone and the Temple of the Toad (possibly associated with Tsathoggua) in Honduras.'
    },
    {
        type: 'button',
        action: 'Horror',
        caption: 'Summon an entity',
        legend: '... at your own risks.'
    }
]);
