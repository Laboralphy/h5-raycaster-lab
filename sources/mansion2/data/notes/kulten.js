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
        type: 'photo',
        src: 'resources/ui/documents/note_kulten.jpg',
    },
    {
        type: 'text',
            content: 'The text contains information on cults that worship pre-human deities, and their long ' +
            'forgotten temples and relics scattered throughout the world.'
    },
    {
        type: 'button',
        action: 'Random curse curse',
        caption: 'Read incantation',
        legend: 'Dark gods of chaos reward wall those who cast such incantations.'
    }
]);
