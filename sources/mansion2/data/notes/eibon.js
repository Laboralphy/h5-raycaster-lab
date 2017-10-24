/**
 * Created by ralphy on 24/01/17?
 * @const MANSION
 * @property MANSION.NOTES.eibon
 * effect : PROTECT
 * liber ivonis : provides protection against vengeful spirits
 */
O2.createObject('MANSION.NOTES.eibon', [
    {
        type: 'title',
        content: 'Liber Ivonis',
    },
    {
        type: 'text',
        content: 'A very ancien text, written 12,000 years ago by an Hyperborean ' +
        'wizard named Eibon.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_eibon.jpg',
    },
    {
        type: 'text',
        content: 'Eibon claimed to have visited many strange alien worlds ' + 
        'on remote planets and slayed the most brutal otherworldly entities.'
    },
    {
        type: 'button',
        action: 'Protect',
        caption: 'Read formula',
        legend: 'It may help you defend yourself against hostile and vengeful spirits.'
    }
]);
