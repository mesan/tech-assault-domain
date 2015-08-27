import engine from '../../engine/gameEngine';
import gameBoard from './gameBoardService';

export default {
    performBattles(board, cards, placedCard, cardPosition) {
        let gameboard = gameBoard(board);

        if (typeof gameboard.toCoords(16    ) === 'undefined') {
            console.log("coords is out of bounds!");
        }
        if (typeof gameboard.toIndex([5,3]) === "undefined") {
            console.log("index is out of bounds");
        }

        return {
            events: []
        };
    }
}
