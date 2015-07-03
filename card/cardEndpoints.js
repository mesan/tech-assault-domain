import getBaseCardController from './controllers/getBaseCardController';
import getRandomBaseCardController from './controllers/getRandomBaseCardController';
import postRandomCardController from './controllers/postRandomCardController';

export default function boardEndpoints(server) {

    server.route({
        method: 'GET',
        path: '/base-cards/random/{randomCount}',
        handler: getRandomBaseCardController
    });

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