import playerDeckService from '../services/playerDeckService';
import playerPrimaryDeckService from '../services/playerPrimaryDeckService';
import randomBaseCardService from '../../card/services/randomBaseCardService';

export default function getPlayerPrimaryDeckController(request, reply) {
    let userId = request.params.userId;

    playerPrimaryDeckService.getPlayerPrimaryDeck(userId)
        .then((playerPrimaryDeck) => {
            if (!playerPrimaryDeck) {
                return reply().code(404);
            }

            if (playerPrimaryDeck.deck.length === 0) {
                return randomBaseCardService.getRandomBaseCards(5)
                    .then((baseCards) => {
                        return playerDeckService.createPlayerDeck(userId, baseCards);
                    })
                    .then((playerDeck) => {
                        return playerPrimaryDeckService.getPlayerPrimaryDeck(userId);
                    })
                    .then((playerPrimaryDeck) => {
                        return reply(playerPrimaryDeck);
                    })
                    .catch((err) => {
                        console.log(err.stack);
                        reply(err);
                    });
            }

            return reply(playerPrimaryDeck);
        })
        .catch((err) => {
            console.log(err.stack);
            reply(err);
        });
}