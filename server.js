import fs from 'fs';
import Hapi from 'hapi';
import boardEndpoints from './board/boardEndpoints';
import cardEndpoints from './card/cardEndpoints';
import playerEndpoints from './player/playerEndpoints';
import enlistmentEndpoints from './enlistment/enlistmentEndpoints';

let server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3001
});

server.start(() => {
    console.log('Server running at:', server.info.uri);

    boardEndpoints(server);
    cardEndpoints(server);
    playerEndpoints(server);
    enlistmentEndpoints(server);

    server.route({
        method: ['GET'],
        path: '/',
        handler: function (request, reply) {
            return reply('hello');
        }
    });
});
