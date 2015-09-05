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

    // Lookup object with cards indexed by cardId
    let cardsLookup = {};
    cards.forEach(function (card){
        cardsLookup[card.id] = card;
    });

    return {
        updateOwnerOnCard(cardId, newOwner) {
            cardsLookup[cardId].owner = newOwner;
        },

        *findConnectedCards (cardIndexOnBoard) {
            let cardId = board[cardIndexOnBoard];
            let card = cardsLookup[cardId];
            let arrowPositions = this.readArrowPositionsOnCard(card);
            let arrowCounter = 0;

            for (;arrowCounter < arrowPositions.length; arrowCounter++) {
                let arrowIndex = arrowPositions[arrowCounter];
                let coords = this.coordinateArrowIsPointingTo(cardIndexOnBoard, arrowIndex);

                let indexToCheck = toIndex([coords[0], coords[1]]);

                if (this.isArrowPointingToEnemyCard(card.owner, indexToCheck)) {
                    yield {
                        gameBoardIndex: indexToCheck,
                        playerCardArrowIndex: arrowIndex,
                        card: cardsLookup[board[indexToCheck]]
                    };
                }
            }
        },

        findOpposingCardsPointedToBy (cardPosition, pointsToPlayerName) {
            let cardId = board[cardPosition];
            let card = cardsLookup[cardId];
            let arrowPositions = this.readArrowPositionsOnCard(card);
            let arrowCounter = 0;

            let connectedCards = [];

            for (;arrowCounter < arrowPositions.length; arrowCounter++) {
                let arrowIndex = arrowPositions[arrowCounter];
                let coords = this.coordinateArrowIsPointingTo(cardPosition, arrowIndex);

                let indexToCheck = toIndex([coords[0], coords[1]]);

                if (this.isArrowPointingToCardOwnedBy(pointsToPlayerName, indexToCheck)) {
                    console.log(cardsLookup[board[indexToCheck]]);

                    connectedCards.push({
                        boardIndex: indexToCheck,
                        arrowIndex: arrowIndex,
                        card: cardsLookup[board[indexToCheck]]
                    });
                }
            }

            return connectedCards;
        },

        isArrowPointingToCardOwnedBy(owner, index) {
            if (typeof index === 'undefined' || typeof board[index] !== 'string') {
                return false;
            }

            let card = cardsLookup[board[index]];

            return owner === card.owner ? true : false;
        },

        isArrowPointingToEnemyCard(player, index) {
            if (typeof index === 'undefined' || typeof board[index] !== 'string') {
                return false;
            }

            let card = cardsLookup[board[index]];

            return player === card.owner ? false : true;
        },

        coordinateArrowIsPointingTo(cardIndex, arrowIndex) {
            let coords = toCoords(cardIndex);

            let x = coords[0] + NEIGHBORS[arrowIndex].x;
            let y = coords[1] + NEIGHBORS[arrowIndex].y;

            return [x, y];
        },

        readArrowPositionsOnCard (card) {
            let arrowPositions = [];
            let arrowIndexPosition = 0;

            for (;arrowIndexPosition < card.arrows.length; arrowIndexPosition++) {
                if (card.arrows[arrowIndexPosition] === 1) {
                    arrowPositions.push(arrowIndexPosition);
                }
            }

            return arrowPositions;
        },
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

    function toCoords (index) {
        if (index < 0 || index >= TILES_ON_BOARD) {
            return undefined;
        }

        let x = index % BOARD_SIZE;
        let y = Math.floor(index / BOARD_SIZE);

        return [x, y];
    }

}

