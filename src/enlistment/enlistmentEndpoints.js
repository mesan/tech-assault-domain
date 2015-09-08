import postEnlistmentController from './controllers/postEnlistmentController';
import deleteEnlistmentController from './controllers/deleteEnlistmentController';
import getMatchesController from './controllers/getMatchesController';

export default function playerEndpoints(server) {
    server.route({
        method: 'POST',
        path: '/enlistments/{userId}/{userToken}',
        handler: postEnlistmentController
    });

    server.route({
        method: 'DELETE',
        path: '/enlistments/{userToken}',
        handler: deleteEnlistmentController
    });

    server.route({
        method: 'GET',
        path: '/matches',
        handler: getMatchesController
    });
}