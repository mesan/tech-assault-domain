import matchService from '../services/matchService';

export default function postTurnController(request, reply) {
    const { userId } = request.params;
    const turn = request.payload;

    matchService.performTurn(userId, turn)
        .then(reply)
        .catch(err => {
            console.error(err.stack);
            reply(err);
        });
}