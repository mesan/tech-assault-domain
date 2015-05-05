import {List} from '../../util/collections';

import {
    COLUMN_COUNT,
    ROW_COUNT,
    TILE_EMPTY
} from '../boardConstants';

export function getEmptyBoard() {
    let board = [];
    
    for (let x = 0; x < COLUMN_COUNT; x++) {
        for (let y = 0; y < ROW_COUNT; y++) {
            board.push(TILE_EMPTY);
        }
    }

    return List(board);
}