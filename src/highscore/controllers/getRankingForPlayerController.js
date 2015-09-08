import {ObjectID} from 'mongodb';
import pdb from '../../util/pdb';
import highscoreService from './../services/highscoreService';

export default function getRankingForPlayerController(request, reply) {
    let userId = request.params.userId;

    highscoreService.fetchRankingForPlayer(userId)
        .then(reply)
        .catch(err => {
            console.error(err, err.stack);
            reply({error: err}).code(400);
        });
}