import fs from 'fs';
import Hapi from 'hapi';
import boardEndpoints from './board/boardEndpoints';
import cardEndpoints from './card/cardEndpoints';
import playerEndpoints from './player/playerEndpoints';
import enlistmentEndpoints from './enlistment/enlistmentEndpoints';
import highscoreEndpoints from './highscore/highscoreEndpoints';

let server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3001
});

server.start(() => {
    console.log('Server running at:', server.info.uri);
    console.log('Configured MongoDb instance:', process.env.TECH_DOMAIN_MONGOLAB_URI);
    
    boardEndpoints(server);
    cardEndpoints(server);
    playerEndpoints(server);
    enlistmentEndpoints(server);
    highscoreEndpoints(server);


    server.route({
        method: ['GET'],
        path: '/',
        handler: function (request, reply) {
            return reply('hello');
        }
    });
});
