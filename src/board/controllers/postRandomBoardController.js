import {getEmptyBoard} from '../services/boardService';
import {getRandomNumber, getRandomNumbers} from '../../util/random';
import {COLUMN_COUNT, ROW_COUNT, TILE_BLOCK} from '../boardConstants';

export default function getRandomBoardController(request, reply) {
    let board = getEmptyBoard(); 

    let blockCount = getRandomNumber(0, 6);

    let blockIndices = getRandomNumbers(0, COLUMN_COUNT * ROW_COUNT, blockCount, true);

    for (let blockIndex of blockIndices) {
        board = board.set(blockIndex, TILE_BLOCK);
    }

    return reply(board);
}