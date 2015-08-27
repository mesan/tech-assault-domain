import playerDeckService from '../services/playerDeckService';
import randomBaseCardService from '../../card/services/randomBaseCardService';

export default function getPlayerDeckController(request, reply) {
    let userId = request.params.userId;

    playerDeckService.getPlayerDeck(userId)
        .then((playerDeck) => {
            if (!playerDeck) {
                return randomBaseCardService.getRandomBaseCards(5)
                    .then((baseCards) => {
                        return playerDeckService.createPlayerDeck(userId, baseCards);
                    })
                    .then(reply)
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