import postEnlistmentController from './controllers/postEnlistmentController';

export default function playerEndpoints(server) {
    server.route({
        method: 'POST',
        path: '/enlistments/{userId}',
        handler: postEnlistmentController
    });
}