import pdb from '../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

let playerPrimaryDeckService = {

    getPlayerPrimaryDeck(userId) {
        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
            .then(([db, collection]) => {
                return collection.pfind({ userId }, { _id: 0}).limit(1).toArray();
            })
            .then((playerDeckDocs) => {
                if (!playerDeckDocs.length) {
                    return null;
                }

                let playerDeck = playerDeckDocs[0];

                if (typeof playerDeck.deck === 'undefined') {
                    playerDeck.deck = [];
                }

                if (typeof playerDeck.primaryDeck === 'undefined') {
                    playerDeck.primaryDeck = [];
                }

                let playerDeckById = playerDeck.deck.reduce((playerDeckById, card) => {
                    playerDeckById[card.id] = card;
                    return playerDeckById;
                }, {});

                let primaryDeck = playerDeck.primaryDeck.map((cardId) => {
                    return playerDeckById[cardId];
                });

                return {
                    userId: playerDeck.userId,
                    primaryDeck,
                    deck: playerDeck.deck
                };
            });
    },

    updatePrimaryDeck(userId, primaryDeck) {
        if (primaryDeck.length > 5) {
            throw 'No more than five primary cards';
        }

        let col;

        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
            .then(([db, collection]) => {
                col = collection;
                return collection.pfind({ userId }, { _id: 0 }).limit(1).toArray();
            })
            .then((playerDecks) => {
                if (!playerDecks.length) {
                    return null;
                }

                let matchingPrimaryCards = playerDecks[0].deck.filter((card) => {
                    return primaryDeck.indexOf(card.id) !== -1;
                });

                if (matchingPrimaryCards.length !== primaryDeck.length) {
                    throw 'Some of the selected primary cards cannot be found in player\'s deck';
                }

                col.update({ userId }, { $set: { primaryDeck } });

                playerDecks[0].primaryDeck = primaryDeck;

                return playerDecks[0];
            });
    }
};

export default playerPrimaryDeckService;