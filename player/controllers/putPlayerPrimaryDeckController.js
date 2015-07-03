import playerPrimaryDeckService from '../services/playerPrimaryDeckService';

export default function putPlayerPrimaryDeckController(request, reply) {
    playerPrimaryDeckService.updatePrimaryDeck(request.params.userId, JSON.parse(request.payload))
        .then((playerDeck) => {
            if (!playerDeck) {
                return reply();
            }

            reply(playerDeck);
        })
        .catch((err) => {
            console.log(err.stack);
            reply(err);
        });
}