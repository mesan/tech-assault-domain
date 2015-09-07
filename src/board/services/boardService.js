import {getRandomNumber, getRandomNumbers} from '../../util/random';
import {columnCount, rowCount, tileBlock, tileEmpty} from '../boardConstants';

export default {

    createBoard() {
        const board = getEmptyBoard();

        const blockCount = getRandomNumber(0, 6);

        const blockIndices = getRandomNumbers(0, columnCount * rowCount, blockCount, true);

        for (let blockIndex of blockIndices) {
            board[blockIndex] = tileBlock;
        }

        return board;
    }

};

function getEmptyBoard() {
    const board = [];

    for (let x = 0; x < columnCount; x++) {
        for (let y = 0; y < rowCount; y++) {
            board.push(tileEmpty);
        }
    }

    return board;
}