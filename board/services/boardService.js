import {List} from '../../util/collections';

import boardConfig from '../boardConfig';

export function getEmptyBoard() {
    let board = [];
    
    for (let x = 0; x < boardConfig.COLUMN_COUNT; x++) {
        for (let y = 0; y < boardConfig.ROW_COUNT; y++) {
            board.push(boardConfig.TILE_EMPTY);
        }
    }

    return List(board);
}