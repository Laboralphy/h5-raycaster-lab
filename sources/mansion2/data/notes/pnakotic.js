/**
 * Created by ralphy on 31/01/17.
 *
 * @const MANSION
 * @property MANSION.NOTES.pnakotic
 * "Pnakotic Manuscripts"
 */
O2.createObject('MANSION.NOTES.pnakotic', [
    {
        type: 'title',
        content: 'Pnakotic Manuscripts'
    },
    {
        type: 'text',
        content: 'The original manuscripts were in scroll form and were passed down through the ages, ' +
        'eventually falling into the hands of secretive cults. The Great Race of Yith is believed ' +
        'to have produced the first five chapters of the Manuscripts, which, among other things, ' +
        'contain a detailed chronicle of the race\'s history.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_pnakotic.jpg',
    },
    {
        type: 'text',
            content: 'The Pnakotic Manuscripts were kept in the Great Race\'s library city of Pnakotus (hence the name). ' +
            'They cover a variety of subjects, including descriptions of Chaugnar Faugn and Yibb-Tstll, ' +
            'the location of Xiurhn, Rhan-Tegoth\'s rituals, and others.'
    },
    {
        type: 'button',
        action: 'Horror',
        caption: 'Summon an entity',
        legend: '... at your own risks.'
    }
]);
