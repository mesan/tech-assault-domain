import Hapi from 'hapi';
import boardEndpoints from './board/boardEndpoints';
import cardEndpoints from './card/cardEndpoints';

let server = new Hapi.Server();

server.connection({ port: process.env.PORT || 3000 });

server.start(() => {
    console.log('Server running at:', server.info.uri);

    boardEndpoints(server);
    cardEndpoints(server);
});
