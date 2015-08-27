export default function gameBoard (board) {
    let tilesOnBoard = board.length;
    let boardSize = Math.sqrt(board.length);

    return {
        toCoords (index) {
            if (index < 0 || index >= tilesOnBoard) {
                return undefined;
            }

            let x = index % boardSize;
            let y = Math.floor(index / boardSize);

            console.log("Index: " + index + " = X: " + x + " Y: " + y);

            return [x, y];
        },

        toIndex (coords) {
            if (!isValidCoordinates(boardSize, coords)) {
                return undefined;
            }

            let index = coords[0] + (coords[1] * boardSize);

            console.log("X: " + coords[0] + " - Y: " + coords[1] + " = Index: " +  index);

            return index;
        }
    }

    function isValidCoordinates(boardSize, coords) {
        let valid = true;
        let x = coords[0];
        let y = coords[1];
        let maxValue = boardSize - 1;

        if (x < 0 || y < 0) {
            valid = false;
        }

        if (x > maxValue || y > maxValue) {
            valid = false;
        }

        return valid;
    }
}

