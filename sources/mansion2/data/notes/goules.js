/**
 * Created by ralphy on 23/01/17.
 * @const MANSION
 * @property MANSION.NOTES.goules
 * effect : HORROR
 * "Le culte des goules" by "Comte d'Erlette"
 * will trigger an "horror effect" : HORROR
 */
O2.createObject('MANSION.NOTES.goules', [
    {
        type: 'title',
        content: 'Le Culte des Goules',
    },
    {
        type: 'text',
        content: 'A forbidden book written by french author Comte d\'Erlette. ' +
        'Like many book of itd kind, this one is rare and hold many secrets. '


    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_culte_goules.jpg',
    },
    {
        type: 'text',
        content: 'This tome depicts gruesome facts about an ancient and secret ' +
        'society whose members name themselves "les goules". ' +
        'These cultists were among the most dreadful and cruel. ' +
        'The book depicts practices, abductions, tortures and evil rituals. ' +
        'The text is extremely shocking and the pictures are totally disturbing.'
    },
    {
        type: 'button',
        action: 'Horror',
        caption: 'Read a passage',
        legend: 'This book is rumored to drive readers insane...'
    }
]);
