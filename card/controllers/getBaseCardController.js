import Card from '../domain/Card';

export default function getBaseCardController(request, reply) {
    let card = new Card({ power: 3 });
    return reply(card);
}