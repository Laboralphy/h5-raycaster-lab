/**
 * Created by ralphy on 16/01/17.
 * @const MANSION
 * @property MANSION.NOTES.Test1
 * A test document : the voynich manuscript
 */
O2.createObject('MANSION.NOTES.voynich', [
    {
        type: 'title',
        content: 'Voynich Manuscript'
    },
    {
        type: 'text',
        content: 'Illustrated with strange pictures of plants and written in an unknown language, this text is incomprehensible.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_voynich.jpg',
    },
    {
        type: 'text',
        content: 'Because of the numerous drawing of plants and body parts, you believe this manuscript is about Medecine or Alchemy. ' +
            'The commentaries written in margins confirm your speculations.'
    },
    {
        type: 'button',
        action: 'heal',
        caption: 'Read formula',
        legend: 'You notice that someone wrote annotations and compiled a formula. It seems like a Healing incantation.'
    }
]);