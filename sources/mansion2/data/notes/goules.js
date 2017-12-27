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
        content: 'Writen by a french author, August Comte d\'Erlette.'
    },
    {
        type: 'photo',
        src: 'resources/ui/documents/note_goules.jpg',
    },
    {
		type: 'text',
		content: 'the book depicts practices, '+
        'abductions, tortures and evil rituals performed a secret society ' +
        'whose members name themselves "les goules" (the ghouls).'
    },
    {
        type: 'button',
        action: 'Horror',
        caption: 'Read a passage',
        legend: 'This book is rumored to drive readers insane...'
    }
]);
