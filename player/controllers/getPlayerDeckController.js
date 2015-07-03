import playerDeckService from '../services/playerDeckService';
import randomBaseCardService from '../../card/services/randomBaseCardService';

export default function getPlayerDeckController(request, reply) {
    playerDeckService.getPlayerDeck(request.params.userId)
        .then((playerDeck) => {
            if (!playerDeck) {
                return reply();
            }

            if (!playerDeck.deck) {
                return randomBaseCardService.getRandomBaseCards(5)
                    .then((baseCards) => {
                        return playerDeckService.createPlayerDeck(request.params.userId, baseCards);
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