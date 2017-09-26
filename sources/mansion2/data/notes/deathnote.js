/**
 * Created by ralphy on 16/01/17.
 * @const MANSION
 * @property MANSION.NOTES.deathnote
 * the mysterium deathnote
 * Effect : ...
 */
O2.createObject('MANSION.NOTES.deathnote', [
    {
        type: 'title',
        content: 'The Death Note'
    },
    {
        type: 'text',
        content: 'The human whose name is written in this note shall die.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_deathnote.jpg',
    },
    {
        type: 'text',
        content: 'This note will not take effect unless the writer has the person\'s face in their mind when writing ' +
        'his/her name. Therefore, people sharing the same name will not be affected.'
    },
    {
        type: 'text',
        content: 'If the cause of death is written within the next 40 seconds of writing the person\'s name, ' +
        'it will happen. '
    },
    {
        type: 'button',
        action: 'Random curse blessing',
        caption: 'Write a name',
        legend: 'This notebook has no power, this is a fake.'
    }
]);



