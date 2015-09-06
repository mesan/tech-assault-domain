import postMatchController from './controllers/postMatchController';
import postTurnController from './controllers/postTurnController';
import getActiveMatchController from './controllers/getActiveMatchController';
import postLootCardController from './controllers/postLootCardController';
import postTurnTimeoutController from './controllers/postTurnTimeoutController';
import postLootTimeoutController from './controllers/postLootTimeoutController';

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
        method: 'POST',
        path: '/matches/turn-timeouts/{userId}',
        handler: postTurnTimeoutController
    });

    server.route({
        method: 'POST',
        path: '/matches/loot-timeouts/{userId}',
        handler: postLootTimeoutController
    });

    server.route({
        method: 'GET',
        path: '/matches/active/{userId}',
        handler: getActiveMatchController
    });

    server.route({
        method: 'POST',
        path: '/matches/loot/{userId}',
        handler: postLootCardController
    });

}