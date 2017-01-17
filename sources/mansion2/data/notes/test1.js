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
        content: 'Illustrated with strange pictures of plants and written in an unknown language, this text is incomprehensible. However someone wrote annotations and compiled a formula.'
    },
    {
        type: 'image',
        src: 'resources/ui/documents/voynich.png',
    },
    {
        tag: 'spell_heal',
        type: 'button',
        action: 'heal',
        caption: 'Cast HEAL spell'
    },
    {
        type: 'text',
        style: 'italic',
        content: 'When you click on this button, you cast the spell. Once cast, the button is made unavailable'
    },

]);