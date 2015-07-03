import pdb from '../../util/pdb';

const { TECH_DOMAIN_MONGOLAB_URI } = process.env;

let playerDeckService = {

    getPlayerDeck(userId) {
        let connection;

        return new Promise((resolve, reject) => {
            pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
                .then(([db, collection, promise]) => {
                    connection = db;
                    return promise(collection.find({ userId }, { _id: 0 }).limit(1));
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
                    throw err;
                });
        });
    },

    createPlayerDeck(userId, deck) {
        return new Promise((resolve, reject) => {
            pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
                .then(([db, collection]) => {
                    let playerDeckDoc = { userId, deck };
                    collection.update({ userId }, playerDeckDoc);
                    db.close();

                    resolve(playerDeckDoc);
                })
                .catch((err) => {
                    throw err;
                });
        });
    }
};

export default playerDeckService;