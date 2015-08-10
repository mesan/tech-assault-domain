import matchService from '../services/matchService';

export default function postMatchController(request, reply) {
    const userIds = request.payload;

    matchService.createMatch(userIds)
        .then(reply)
        .catch(console.error)
        .catch(reply);
}