export default function postRandomCardController(request, reply) {
    return reply(JSON.parse(request.payload));
}