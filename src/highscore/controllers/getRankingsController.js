import {ObjectID} from 'mongodb';
import pdb from '../../util/pdb';
import highscoreService from './../services/highscoreService';

export default function getRankingsController(request, reply) {
    highscoreService.fetchRankings(10).then((rankings) => {
        reply(rankings);
    });
}