import pdb from '../../util/pdb';
import uuid from 'node-uuid';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

let playerDeckService = {

    getPlayerDeck(userId) {
        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
            .then(([db, collection]) => {
                return collection.pfind({ userId }, { _id: 0 }).limit(1).toArray();
            })
            .then((playerDecks) => {
                if (playerDecks.length > 0) {
                    return playerDecks[0];
                } else {
                    return null;
                }
            });
    },

    createPlayerDeck(userId, deck) {
        let deckWithIds = deck.map((card) => {
            card.id = uuid.v4();
            return card;
        });

        let primaryDeck = deckWithIds.map((card) => {
            return card.id;
        });

        let playerDeckDoc;

        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
            .then(([db, collection]) => {
                let playerDeckDoc = { userId, deck, primaryDeck };
                return collection.update({ userId }, playerDeckDoc);
            })
            .then(() => {
                return playerDeckDoc;
            });
    }
};

export default playerDeckService;