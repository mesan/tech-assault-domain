import matchService from '../services/matchService';

export default function postMatchController(request, reply) {
    const users = request.payload;

    matchService.createMatch(users)
        .then(reply)
        .catch(console.error)
        .catch(reply);
}