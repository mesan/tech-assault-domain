import postRandomBoardController from './controllers/postRandomBoardController';

export default function boardEndpoints(server) {
    server.route({
        method: 'POST',
        path: '/boards',
        handler: postRandomBoardController
    });
}