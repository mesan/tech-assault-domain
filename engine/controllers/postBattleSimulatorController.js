import engine from '../gameEngine';
import battleService from '../../match/services/battleService';

export default function postBattleSimulatorController(request, reply) {
	let playerCard = request.payload.playerCard;
	let opponentCard = request.payload.opponentCard;
	let board = request.payload.board;

	battleService.performBattles(board, [playerCard, opponentCard], playerCard, 1);

	let winner = engine(playerCard, opponentCard);

	return reply(winner);
}