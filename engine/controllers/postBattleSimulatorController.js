import engine from '../gameEngine';

export default function postBattleSimulatorController(request, reply) {
	let playerCard = request.payload.playerCard;
	let opponentCard = request.payload.opponentCard;

	let winner = engine(playerCard, opponentCard);

	return reply(winner);
}