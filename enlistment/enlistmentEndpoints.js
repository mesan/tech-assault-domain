import postEnlistmentController from './controllers/postEnlistmentController';
import getMatchesController from './controllers/getMatchesController';

export default function playerEndpoints(server) {
    server.route({
        method: 'POST',
        path: '/enlistments/{userToken}',
        handler: postEnlistmentController
    });

    server.route({
        method: 'GET',
        path: '/matches',
        handler: getMatchesController
    });
}