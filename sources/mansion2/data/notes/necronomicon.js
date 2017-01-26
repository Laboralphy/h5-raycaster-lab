/**
 * Created by ralphy on 25/01/17.
 * @const MANSION
 * @property MANSION.NOTES.necronomicon
 * A test document : the necronomicon
 */
O2.createObject('MANSION.NOTES.necronomicon', [
    {
        type: 'title',
        content: 'Necronomicon'
    },
    {
        type: 'text',
        content: 'Written by Abdul Alhazred, the Mad Arab. This tome contains many sigils and incantations to summon various deities. '
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_necro.jpg',
    },
    {
        type: 'text',
        content: 'Alhazred is said to have been a worshipper of ancien and evil deities such as Yog-Sothoth and Cthulhu. He described in the Necronomicon ' +
            'how he found strange forgotten places like the ruins of babylon or the strange subterranean nameless city below the city of Irem.'
    },
    {
        type: 'button',
        action: 'Heal',
        caption: 'Read formula',
        legend: 'If you feel lucky you may try to cast a spell from this book.'
    }
]);