import getRandomBoardController from './controllers/getRandomBoardController';

export default function boardEndpoints(server) {
    server.route({
        method: 'POST',
        path: '/boards',
        handler: getRandomBoardController
    });
}