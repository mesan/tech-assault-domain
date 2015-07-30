import {ObjectID} from 'mongodb';
import pdb from '../../util/pdb';
import { DEFAULT_NUMBER_OF_RANKINGS } from '../highscoreConstants';

export default function getRankingsController(request, reply) {
    let userId = request.params.userId;

    pdb.connect(process.env.TECH_DOMAIN_MONGOLAB_URI, 'rankings')        
        .then(([db, collection]) => {
            let numberOfRankings = parseInt(request.params.numberOfRankings) || DEFAULT_NUMBER_OF_RANKINGS;

            return collection.find().sort({score: -1}).limit(numberOfRankings).toArray();
        })
        .then((rankings) => {
            for (let index = 0; index < rankings.length; index++) {
                rankings[index].rank = index + 1;
            };

            reply(rankings);
        })
        .catch((err) => {
            console.log(err);
            reply(err);
        });  
}