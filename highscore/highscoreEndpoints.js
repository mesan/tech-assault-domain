import getRankingsController from './controllers/getRankingsController';

export default function highscoreEndpoints(server) {

    server.route({
        method: 'GET',
        path: '/rankings/{numberOfRankings}',
        handler: getRankingsController
    });

}