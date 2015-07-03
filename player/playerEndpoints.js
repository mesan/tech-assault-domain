import getPlayerDeckController from './controllers/getPlayerDeckController';

export default function playerEndpoints(server) {
    server.route({
        method: 'GET',
        path: '/players/{userId}/deck',
        handler: getPlayerDeckController
    });
}