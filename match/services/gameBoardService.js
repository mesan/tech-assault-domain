const NEIGHBORS = [
    {x:  0 , y: -1},    // North
    {x:  1 , y: -1},    // Northeast
    {x:  1 , y:  0},    // East
    {x:  1 , y:  1},    // Southeast
    {x:  0 , y:  1},    // South
    {x: -1 , y:  1},    // Southwest
    {x: -1 , y:  0},    // West
    {x: -1 , y: -1}     // Northwest
];

export default function gameBoard (board, cards) {
    const TILES_ON_BOARD = board.length;
    const BOARD_SIZE = Math.sqrt(board.length);

    let cardsLookup = {};
    cards.forEach(function (card){
        cardsLookup[card.id] = card;
    });

    return {
        toCoords (index) {
            if (index < 0 || index >= TILES_ON_BOARD) {
                return undefined;
            }

            let x = index % BOARD_SIZE;
            let y = Math.floor(index / BOARD_SIZE);

            return [x, y];
        },

        findBattlingCards (playerCard, index) {
            this.playerCard = playerCard;
            let arrows = playerCard.arrows;
            let arrowLength = playerCard.arrows.length;
            let arrowIndexPosition = 0;
            let coords = this.toCoords(index);

            let arrowPositions = [];

            for (;arrowIndexPosition < arrowLength; arrowIndexPosition++) {
                if (arrows[arrowIndexPosition] === 1) {
                    arrowPositions.push(arrowIndexPosition);
                }
            }

            let neighbouringCards = [];
            arrowPositions.forEach(function(value) {
                let x = coords[0] + NEIGHBORS[value].x;
                let y = coords[1] + NEIGHBORS[value].y;

                let index = toIndex([x, y]);

                if (typeof index !== 'undefined' && typeof board[index] === 'string') {
                    neighbouringCards.push({
                        boardIndex: index,
                        arrowIndex: value,
                        card: cardsLookup[board[index]]
                    });
                }
            });

            neighbouringCards = neighbouringCards.filter(removeCardsOwnedByPlayer, this);

            console.log(neighbouringCards);

            return neighbouringCards;
        }

    }

    function toIndex (coords) {
        if (!isCoordinateOnGameBoard(coords)) {
            return undefined;
        }

        let index = coords[0] + (coords[1] * BOARD_SIZE);

        return index;
    }

    function isCoordinateOnGameBoard(coords) {
        let valid = true;
        let x = coords[0];
        let y = coords[1];
        let maxValue = BOARD_SIZE - 1;

        if (x < 0 || y < 0) {
            valid = false;
        }

        if (x > maxValue || y > maxValue) {
            valid = false;
        }

        return valid;
    }

    function removeCardsOwnedByPlayer(neighbouringCard) {
        if (neighbouringCard.card.owner === this.playerCard.owner) {
            return false;
        }

        return true;
    }
}

