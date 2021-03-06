import playerPrimaryDeckService from '../services/playerPrimaryDeckService';

export default function putPlayerPrimaryDeckController(request, reply) {
    let userId = request.params.userId;
    let primaryDeck = request.payload;

    playerPrimaryDeckService.updatePrimaryDeck(userId, primaryDeck)
        .then((playerDeck) => {
            if (!playerDeck) {
                return reply().code(404);
            }

            reply(playerDeck);
        })
        .catch((err) => {
            console.log(err.stack);
            reply({ error: err }).code(400);
        });
}