import matchService from '../services/matchService';

export default function postTurnTimeoutController(request, reply) {
    const { userId } = request.params;

    matchService.timeOutTurn(userId)
        .then(reply)
        .catch(err => {
            console.error(err.stack);
            reply({ error: err.message }).code(400);
        });
}