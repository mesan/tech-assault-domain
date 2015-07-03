import playerDeckService from '../services/playerDeckService';
import randomBaseCardService from '../../card/services/randomBaseCardService';
import uuid from 'node-uuid';

export default function getPlayerDeckController(request, reply) {
    playerDeckService.getPlayerDeck(request.params.userId)
        .then((playerDeck) => {
            if (!playerDeck) {
                return reply();
            }

            if (!playerDeck.deck) {
                return randomBaseCardService.getRandomBaseCards(5)
                    .then((baseCards) => {
                        let basePrimaryCards = baseCards.map((baseCard) => {
                            baseCard.primary = true;
                            baseCard.id = uuid.v4();
                            return baseCard;
                        });

                        return playerDeckService.createPlayerDeck(request.params.userId, basePrimaryCards);
                    })
                    .then((playerDeck) => {
                        reply(playerDeck);
                    })
                    .catch((err) => {
                        console.log(err.stack);
                        reply(err);
                    });
            } else {
                reply(playerDeck);
            }
        })
        .catch((err) => {
            console.log(err.stack);
            reply(err);
        });
}