import matchService from '../services/matchService';

export default function postMatchController(request, reply) {
    const users = request.payload;

    matchService.createMatch(users)
        .then(reply)
        .catch(err => {
            console.error(err.stack);
            reply({ error: err }).code(400);
        });
}