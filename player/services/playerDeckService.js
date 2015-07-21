import pdb from '../../util/pdb';
import uuid from 'node-uuid';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

let playerDeckService = {

    getPlayerDeck(userId) {
        let connection;

        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
            .then(([db, collection]) => {
                connection = db;
                return collection.pfind({ userId }, { _id: 0 }).limit(1).toArray();
            })
            .then((playerDecks) => {
                if (playerDecks.length > 0) {
                    return playerDecks[0];
                } else {
                    return null;
                }
            })
            .then((playerDeck) => {
                connection.close();
                return playerDeck;
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

        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
            .then(([db, collection]) => {
                let playerDeckDoc = { userId, deck, primaryDeck };
                collection.update({ userId }, playerDeckDoc);
                db.close();

                return playerDeckDoc;
            });
    }
};

export default playerDeckService;