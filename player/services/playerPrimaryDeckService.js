import pdb from '../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

let playerPrimaryDeckService = {

    updatePrimaryDeck(userId, primaryDeck) {
        if (primaryDeck.length > 5) {
            throw 'No more than five primary cards';
        }

        let connection, col;

        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
            .then(([db, collection]) => {
                connection = db;
                col = collection;
                return collection.pfind({ userId }, { _id: 0 }).limit(1).toArray();
            })
            .then((playerDecks) => {
                if (playerDecks.length) {

                    let matchingPrimaryCards = playerDecks[0].deck.filter((card) => {
                        return primaryDeck.indexOf(card.id) !== -1;
                    });

                    if (matchingPrimaryCards.length !== primaryDeck.length) {
                        throw 'Some of the selected primary cards cannot be found in player\'s deck';
                    }

                    col.update({ userId }, { $set: { primaryDeck } });
                    return playerDecks[0];
                } else {
                    return null;
                }

                connection.close();
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }
};

export default playerPrimaryDeckService;