import getPlayerDeckController from './controllers/getPlayerDeckController';
import getPlayerPrimaryDeckController from './controllers/getPlayerPrimaryDeckController';
import putPlayerPrimaryDeckController from './controllers/putPlayerPrimaryDeckController';

export default function playerEndpoints(server) {
    server.route({
        method: 'GET',
        path: '/players/{userId}/deck',
        handler: getPlayerDeckController
    });

    server.route({
        method: 'GET',
        path: '/players/{userId}/deck/primary',
        handler: getPlayerPrimaryDeckController
    });

    server.route({
        method: 'PUT',
        path: '/players/{userId}/deck/primary',
        handler: putPlayerPrimaryDeckController
    });
}