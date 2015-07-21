import playerPrimaryDeckService from '../services/playerPrimaryDeckService';

export default function putPlayerPrimaryDeckController(request, reply) {
    let userId = request.params.userId;
    let primaryDeck = JSON.parse(request.payload);

    playerPrimaryDeckService.updatePrimaryDeck(userId, primaryDeck)
        .then((playerDeck) => {
            if (!playerDeck) {
                return reply().code(404);
            }

            reply(playerDeck);
        })
        .catch((err) => {
            console.log(err.stack);
            reply(err);
        });
}