import getBaseCardController from './controllers/getBaseCardController';
import postRandomCardController from './controllers/postRandomCardController';

export default function boardEndpoints(server) {
    server.route({
        method: 'GET',
        path: '/base-cards/{baseCardId}',
        handler: getBaseCardController
    });

    server.route({
        method: 'POST',
        path: '/cards',
        handler: postRandomCardController
    });
}