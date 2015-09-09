import pdb from '../../util/pdb';
import uuid from 'node-uuid';

import randomBaseCardService from '../../card/services/randomBaseCardService';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

const deckSizeLowerLimit = 5;

let playerDeckService = {

    getPlayerDeck(userId) {
        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
            .then(([db, collection]) => {
                return collection.pfind({ userId }, { _id: 0 }).limit(1).toArray();
            })
            .then((decks) => {
                console.log('decks');
                const hasDeck = decks.length > 0;

                if (!hasDeck) {
                    return randomBaseCardService.getRandomBaseCards(5)
                        .then(baseCards => playerDeckService.createPlayerDeck(userId, baseCards))
                        .then(() => playerDeckService.getPlayerDeck(userId));
                }

                const deckDoc = decks[0];
                const deck = deckDoc.deck;
                const deckSize = deck.length;

                if (deckSize < deckSizeLowerLimit) {
                    return randomBaseCardService.getRandomBaseCards(deckSizeLowerLimit - deckSize)
                        .then(baseCards => playerDeckService.updatePlayerDeck(userId, deckDoc, baseCards))
                        .then(() => playerDeckService.getPlayerDeck(userId));
                }


                const primaryDeck = deckDoc.primaryDeck;
                const primaryDeckSize = primaryDeck.length;

                if (primaryDeckSize < deckSizeLowerLimit) {
                    const cardIdsNotInPrimaryDeck = deck
                        .filter(card => primaryDeck.indexOf(card.id === -1))
                        .map(card => card.id);

                    const newPrimaryDeck = primaryDeck.slice();

                    while (newPrimaryDeck.length < deckSizeLowerLimit && cardIdsNotInPrimaryDeck.length > 0) {
                        const cardId = cardIdsNotInPrimaryDeck.pop();
                        if (newPrimaryDeck.indexOf(cardId) === -1) {
                            newPrimaryDeck.push(cardId);
                        }
                    }

                    const newDeck = { deck, primaryDeck: newPrimaryDeck, userId };

                    return playerDeckService.updatePlayerDeck(userId, newDeck, []);
                }

                return deckDoc;
            });
    },

    createPlayerDeck(userId, deck) {
        let deckWithIds = deck.map(card => {
            card.id = uuid.v4();
            return card;
        });

        let primaryDeck = deckWithIds.map(card => card.id);

        let playerDeckDoc;

        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
            .then(([db, collection]) => {
                playerDeckDoc = { userId, deck, primaryDeck };
                return collection.update({ userId }, playerDeckDoc, { upsert: true });
            })
            .then(() => playerDeckDoc);
    },

    updatePlayerDeck(userId, deck, newCards) {
        let newCardsWithIds = newCards.map(card => {
            card.id = uuid.v4();
            return card;
        });

        const newDeck = deck.deck.concat(newCardsWithIds);

        const newCardIds = newCardsWithIds.map(newCard => newCard.id);

        const newPrimaryDeck = deck.primaryDeck.concat(newCardIds);

        let deckDoc;

        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
            .then(([db, collection]) => {
                deckDoc = { userId, deck: newDeck, primaryDeck: newPrimaryDeck };
                return collection.update({ userId }, deckDoc, { upsert: true });
            })
            .then(() => deckDoc);
    }
};

export default playerDeckService;