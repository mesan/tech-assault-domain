import playerDeckService from '../services/playerDeckService';
import playerPrimaryDeckService from '../services/playerPrimaryDeckService';

export default function getPlayerPrimaryDeckController(request, reply) {
    let userId = request.params.userId;

    playerPrimaryDeckService.getPlayerPrimaryDeck(userId)
        .then((playerPrimaryDeck) => {
            if (!playerPrimaryDeck) {
                return reply().code(404);
            }

            return reply(playerPrimaryDeck);
        })
        .catch((err) => {
            console.log(err.stack);
            reply({ error: err }).code(400);
        });
}