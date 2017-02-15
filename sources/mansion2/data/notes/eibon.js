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
        'wizard who claimed to have boldly travelled where no man has gone before. ' +
        'Eibon visited many strange alien worlds on remote planets and reported ' +
        'having slayed the most brutal otherworldly entities.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_eibon.jpg',
    },
    {
        type: 'text',
        content: 'How did Eibon fought so many monsters and lived to tell the story ? ' +
        'The book is itself an amazing peace of adventure. Eibon describes the ' +
        'spells he used during his journeys, he wrote glyphs and sigils. ' +
        'Most of the incantations are unreadable but some scholar wrote ' +
        'translation of a few formula.'
    },
    {
        type: 'button',
        action: 'Protect',
        caption: 'Read formula',
        legend: 'It may help you defend yourself against hostile and vengeful spirits.'
    }
]);