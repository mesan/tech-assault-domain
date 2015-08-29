import pdb from '../../util/pdb';
import playerDeckService from './playerDeckService';
import randomBaseCardService from '../../card/services/randomBaseCardService';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

const playerPrimaryDeckService = {

    getPlayerPrimaryDeck(userId) {
        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
            .then(([db, collection]) => {
                return collection.pfind({ userId }, { _id: 0}).limit(1).toArray();
            })
            .then((playerPrimaryDecks) => {
                if (playerPrimaryDecks.length === 0) {
                    return randomBaseCardService.getRandomBaseCards(5)
                        .then((baseCards) => playerDeckService.createPlayerDeck(userId, baseCards))
                        .then(() => playerPrimaryDeckService.getPlayerPrimaryDeck(userId));
                }

                const playerPrimaryDeck = playerPrimaryDecks[0];

                if (typeof playerPrimaryDeck.deck === 'undefined') {
                    playerPrimaryDeck.deck = [];
                }

                if (typeof playerPrimaryDeck.primaryDeck === 'undefined') {
                    playerPrimaryDeck.primaryDeck = [];
                }

                let playerDeckById = playerPrimaryDeck.deck.reduce((playerDeckById, card) => {
                    playerDeckById[card.id] = card;
                    return playerDeckById;
                }, {});

                let primaryDeck = playerPrimaryDeck.primaryDeck.map((cardId) => {
                    return playerDeckById[cardId];
                });

                return {
                    userId: playerPrimaryDeck.userId,
                    primaryDeck,
                    deck: playerPrimaryDeck.deck
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