import randomBaseCardService from '../services/randomBaseCardService';

export default function getRandomBaseCardController(request, reply) {
    let randomCount = parseInt(request.params.randomCount, 10);

    randomBaseCardService.getRandomBaseCards(randomCount)
        .then((baseCards) => {
            reply(baseCards);
        })
        .catch((err) => {
            console.log(err);
            reply(err);
        });
}