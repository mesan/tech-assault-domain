import fs from 'fs';
import Hapi from 'hapi';
import boardEndpoints from './board/boardEndpoints';
import cardEndpoints from './card/cardEndpoints';

let server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3001,
    tls: {
        key: fs.readFileSync('./ssl/server.key'),
        cert: fs.readFileSync('./ssl/server.crt'),
        ca: fs.readFileSync('./ssl/ca.crt'),
        requestCert: true,
        rejectUnauthorized: false
    }
});

server.start(() => {
    console.log('Server running at:', server.info.uri);

    boardEndpoints(server);
    cardEndpoints(server);

    server.route({
        method: ['GET'],
        path: '/',
        handler: function (request, reply) {
            return reply('hello');
        }
    });
});
