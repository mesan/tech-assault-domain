import pdb from '../../util/pdb';
import playerDeckService from './playerDeckService';
import randomBaseCardService from '../../card/services/randomBaseCardService';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

const deckSizeLowerLimit = 5;

const playerPrimaryDeckService = {

    getPlayerPrimaryDeck(userId) {
        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
            .then(([db, collection]) => {
                return collection.pfind({ userId }, { _id: 0}).limit(1).toArray();
            })
            .then((decks) => {
                const hasDeck = decks.length > 0;

                if (!hasDeck) {
                    return randomBaseCardService.getRandomBaseCards(deckSizeLowerLimit)
                        .then((baseCards) => playerDeckService.createPlayerDeck(userId, baseCards))
                        .then(() => playerPrimaryDeckService.getPlayerPrimaryDeck(userId));
                }

                const deck = decks[0];
                const deckSize = deck.deck.length;

                if (deckSize < deckSizeLowerLimit) {
                    return randomBaseCardService.getRandomBaseCards(deckSizeLowerLimit - deckSize)
                        .then((baseCards) => playerDeckService.updatePlayerDeck(userId, deck, baseCards))
                        .then(() => playerPrimaryDeckService.getPlayerPrimaryDeck(userId));
                }

                if (typeof deck.deck === 'undefined') {
                    deck.deck = [];
                }

                if (typeof deck.primaryDeck === 'undefined') {
                    deck.primaryDeck = [];
                }

                let playerDeckById = deck.deck.reduce((playerDeckById, card) => {
                    playerDeckById[card.id] = card;
                    return playerDeckById;
                }, {});

                let primaryDeck = deck.primaryDeck.map((cardId) => {
                    return playerDeckById[cardId];
                });

                return {
                    userId: deck.userId,
                    primaryDeck,
                    deck: deck.deck
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