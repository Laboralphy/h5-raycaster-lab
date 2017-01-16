/**
 * Created by ralphy on 16/01/17.
 */
O2.createObject('MANSION.NOTES.Test1', [
    {
        type: 'title',
        content: 'Fragment of Voynich Manuscript'
    },
    {
        type: 'text',
        content: 'Illustrated with strange pictures of plants and writen in an unknown language, this text is incomprehensible. However someone wrote annotations and compiled a formula.'
    },
    {
        type: 'image',
        src: 'resources/ui/documents/voynich.png',
    },
    {
        type: 'text',
        content: "If you don't share your database connection (session) between multiple threads for concurrent inserts, this is safe. If multiple threads insert on the same connection, this is unsafe, i.e. you might get either ID or a completely invalid ID."
    },
    {
        type: 'image',
        src: 'resources/ui/documents/photo_owl.png',
    },
    {
        tag: 'spell_heal',
        type: 'button',
        action: 'heal',
        caption: 'Cast HEAL spell'
    },
    {
        type: 'text',
        content: "A simple class implementing the Bresenham algorithm with is historically used to draw lines of pixels on screen. This algorithm may have other uses."
    }
]);