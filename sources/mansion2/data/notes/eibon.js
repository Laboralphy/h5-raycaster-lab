/**
 * Created by ralphy on 24/01/17?
 * @const MANSION
 * @property MANSION.NOTES.eibon
 * A test document : the voynich manuscript
 */
O2.createObject('MANSION.NOTES.eibon', [
    {
        type: 'title',
        content: 'Liber Ivonis'
    },
    {
        type: 'text',
        content: '"The Book of Eibon (or Liber Ivonis in latin)" is the tale of Eibon, a powerful Hyperborean wizard who lived ten thousand years ago. ' +
            'Eibon was a famous wizard who accomplished exploits on remote, alien worlds and planets.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_eibon.jpg',
    },
    {
        type: 'text',
        content: 'During his journeys, Eibon had to fight strange creatures, and slayed many otherworldly horrors with spells. ' +
            'Such spells are written in this very book.'
    },
    {
        type: 'button',
        action: 'Heal',
        caption: 'Read formula',
        legend: 'It may help you defend yourself against hostile and vengeful spirits.'
    }
]);