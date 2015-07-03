import pdb from '../../util/pdb';
import uuid from 'node-uuid';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

let playerDeckService = {

    getPlayerDeck(userId) {
        let connection;

        return new Promise((resolve, reject) => {
            pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
                .then(([db, collection]) => {
                    connection = db;
                    return collection.pfind({ userId }, { _id: 0 }).limit(1).toArray();
                })
                .then((playerDecks) => {
                    if (playerDecks.length) {
                        resolve(playerDecks[0]);
                    } else {
                        resolve(null);
                    }

                    connection.close();
                })
                .catch((err) => {
                    reject(err);
                    console.log(err.stack);
                    throw err;
                });
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

        return new Promise((resolve, reject) => {
            pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
                .then(([db, collection]) => {
                    let playerDeckDoc = { userId, deck, primaryDeck };
                    collection.update({ userId }, playerDeckDoc);
                    db.close();

                    resolve(playerDeckDoc);
                })
                .catch((err) => {
                    reject(err);
                    console.log(err.stack);
                    throw err;
                });
        });
    }
};

export default playerDeckService;