import fs from 'fs';
import Hapi from 'hapi';
import boardEndpoints from './board/boardEndpoints';
import playerEndpoints from './player/playerEndpoints';
import enlistmentEndpoints from './enlistment/enlistmentEndpoints';
import highscoreEndpoints from './highscore/highscoreEndpoints';
import matchEndpoints from './match/matchEndpoints';
import battleSimulatorEndpoints from './engine/battleSimulatorEndpoints';

require("console-stamp")(console, { pattern: 'yymmdd/HHMMss.L'});
require('./polyfills/Array.findIndex');
import 'babel-polyfill';

const envVars = [
    'TECH_DOMAIN_MONGOLAB_URI'
];

let undefinedEnvVars = [];

for (let envVar of envVars) {
    if (typeof process.env[envVar] === 'undefined') {
        undefinedEnvVars.push(envVar);
    }
}

if (undefinedEnvVars.length > 0) {
    console.error(`You need to define the following environment variable(s): ${undefinedEnvVars.join(', ')}`);
    process.exit(1);
}

var options = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        events: { log: '*', request: '*', response: '*' }
    }]
};

let server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost'
});

server.register({
    register: require('good'),
    options: options
}, function (err) {

    if (err) {
        console.error(err);
    }
    else {
        server.start(() => {
            console.log('Server running at:', server.info.uri);
            console.log('Configured MongoDb instance:', process.env.TECH_DOMAIN_MONGOLAB_URI);

            boardEndpoints(server);
            playerEndpoints(server);
            enlistmentEndpoints(server);
            highscoreEndpoints(server);
            matchEndpoints(server);
            battleSimulatorEndpoints(server);

            server.route({
                method: ['GET'],
                path: '/',
                handler: function (request, reply) {
                    return reply('hello');
                }
            });
        });
    }
});