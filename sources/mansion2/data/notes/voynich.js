/**
 * Created by ralphy on 16/01/17.
 * @const MANSION
 * @property MANSION.NOTES.voynich
 * the voynich manuscript
 * Effect : VITALITY UP
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
        content: 'Because of the numerous drawing of plants and body parts, you believe this manuscript is about Medecine or Alchemy.'
    },
    {
        type: 'button',
        action: 'PermaVitality',
        caption: 'Read formula',
        legend: 'You notice that someone wrote annotations and compiled a formula. It seems like a Healing incantation.'
    }
]);
