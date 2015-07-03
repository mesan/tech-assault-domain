import {getRandomBaseCards} from '../services/randomBaseCardService';

export default function getRandomBaseCardController(request, reply) {
    let randomCount = parseInt(request.params.randomCount, 10);

    getRandomBaseCards(randomCount)
        .then((baseCards) => {
            reply(baseCards);
        })
        .catch((err) => {
            console.log(err);
            reply(err);
        });
}