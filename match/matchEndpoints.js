import postMatchController from './controllers/postMatchController';
import postTurnController from './controllers/postTurnController';
import getActiveMatchController from './controllers/getActiveMatchController';

export default function matchEndpoints(server) {

    server.route({
        method: 'POST',
        path: '/matches',
        handler: postMatchController
    });

    server.route({
        method: 'POST',
        path: '/matches/turns/{userId}',
        handler: postTurnController
    });

    server.route({
        method: 'GET',
        path: '/matches/active/{userId}',
        handler: getActiveMatchController
    });

}