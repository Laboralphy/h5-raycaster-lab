/**
 * Created by ralphy on 24/01/17?
 * @const MANSION
 * @property MANSION.NOTES.prodigiorum
 * A test document : prodigiorum ac
 */
O2.createObject('MANSION.NOTES.prodigiorum', [
    {
        type: 'title',
        content: 'Prodigiorum Ac'
    },
    {
        type: 'text',
        style: 'italic',
        content: 'Prodigiorum ac ostentorum chronicon, quae praeter naturae ordinem, et in superioribus et his ' +
            'inferioribus mundi regionibus, ab exordio mundi usque ad haec nostra tempora acciderunt'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_prodigiorum.jpg',
    },
    {
        type: 'text',
        content: 'The main subject is a discussion about the physical nature of the globe and the nature of the soul. ' +
            'It is filled with strange pictures and drawing of mythical creatures. It seems completely irrational and ' +
            'may only be the work of a demented dreamer.'
    },
    {
        type: 'button',
        action: 'Heal',
        caption: 'Read formula',
        legend: 'It may help you defend yourself against hostile and vengeful spirits.'
    }
]);