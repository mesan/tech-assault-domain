import pdb from '../../util/pdb';
import uuid from 'node-uuid';

import randomBaseCardService from '../../card/services/randomBaseCardService';

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
                if (playerDecks.length === 0) {
                    return randomBaseCardService.getRandomBaseCards(5)
                        .then(baseCards => playerDeckService.createPlayerDeck(userId, baseCards))
                        .then(() => playerDeckService.getPlayerDeck(userId));
                }

                return playerDecks[0];
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
    }
};

export default playerDeckService;