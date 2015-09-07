import playerDeckService from '../services/playerDeckService';
import randomBaseCardService from '../../card/services/randomBaseCardService';

export default function getPlayerDeckController(request, reply) {
    let userId = request.params.userId;

    playerDeckService.getPlayerDeck(userId)
        .then((playerDeck) => {
            if (!playerDeck) {
                reply().code(404);
            } else {
                reply(playerDeck);
            }
        })
        .catch((err) => {
            console.log(err.stack);
            reply({ error: err }).code(400);
        });
}