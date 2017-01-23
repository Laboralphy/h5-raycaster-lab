/**
 * Created by ralphy on 16/01/17.
 */
O2.createObject('MANSION.NOTES.Test1', [
    {
        type: 'title',
        content: 'Voynich Manuscript'
    },
    {
        type: 'text',
        content: 'Illustrated with strange pictures of plants and written in an unknown language, this text is incomprehensible.'
    },
    {
        type: 'image',
        src: 'resources/ui/documents/voynich.png',
    },
    {
        type: 'text',
        content: 'Because of the numerous drawing of plants and body parts, you believe this manuscript is about Medecine or Alchemy. ' +
            'The commentaries written in margins confirm your speculations.'
    },
    {
        type: 'button',
        action: 'heal',
        caption: 'Cast HEAL spell',
        legend: 'You notice that someone wrote annotations and compiled a formula.'
    }
]);