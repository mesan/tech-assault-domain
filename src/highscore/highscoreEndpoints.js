import getRankingsController from './controllers/getRankingsController';
import getRankingForPlayerController from './controllers/getRankingForPlayerController'

export default function highscoreEndpoints(server) {

    server.route({
        method: 'GET',
        path: '/rankings/{numberOfRankings}',
        handler: getRankingsController
    });

    server.route({
        method: 'GET',
        path: '/rankings/player/{userId}',
        handler: getRankingForPlayerController
    });
}