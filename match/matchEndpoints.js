import postMatchController from './controllers/postMatchController';
import postTurnController from './controllers/postTurnController';

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

}