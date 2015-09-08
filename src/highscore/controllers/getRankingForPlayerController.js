import {ObjectID} from 'mongodb';
import pdb from '../../util/pdb';
import highscoreService from './../services/highscoreService';

export default function getRankingForPlayerController(request, reply) {
    let userId = request.params.userId;

    highscoreService.fetchRankingForPlayer(userId).then((rank) => {
        reply(rank);
    });

/*
    pdb.connect(process.env.TECH_DOMAIN_MONGOLAB_URI, 'rankings')        
        .then(([db, collection]) => {
            var player = collection.findOne( { userId : userId }, { _id: 0 });

            var rank = player.then((p) => {
                return collection.find({ score: { $gt: p.score } }).count();
            });

            return Promise.all([player, rank]);
        })
        .then(([player, rank] ) => {
            player.rank = rank + 1;
            reply(player);
        })
        .catch((err) => {
            console.log(err);
            reply(err);
        });*/
}