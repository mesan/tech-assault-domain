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

        updateOwnerOnCard(cardId, newOwner) {
            console.log("CardId: " + cardId);

            let a = cardsLookup[cardId];
            a.owner = newOwner;
            cardsLookup[cardId] = a;

            console.log("Oppdaterer kort " + a.name);
        },

        find (index) {
            let cardId = board[index];
            let card = cardsLookup[cardId];
            let arrowPositions = this.readArrowPositionsOnCard(card);
            let arrowCounter = 0;

            for (;arrowCounter < arrowPositions.length; arrowCounter++) {
                let arrowIndex = arrowPositions[arrowCounter];
                let coords = this.coordinateForTileArrowIsPointingTo(index, arrowIndex);

                let indexToCheck = toIndex([coords[0], coords[1]]);

                if (this.isArrowPointingToEnemyCard(card.owner, indexToCheck)) {
                    return {
                        boardIndex: indexToCheck,
                        arrowIndex: arrowIndex,
                        card: cardsLookup[board[indexToCheck]]
                    };
                }
            }

            return true;

           /* return {
                next: function () {

                }
            }*/

        },

        isArrowPointingToEnemyCard(player, index) {
            if (typeof index === 'undefined' || typeof board[index] !== 'string') {
                return false;
            }

            let card = cardsLookup[board[index]];

            return player === card.owner ? false : true;
        },

        coordinateForTileArrowIsPointingTo(cardIndex, arrowIndex) {
            let coords = this.toCoords(cardIndex);

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

        findOpposingCardsPointedToBy (playerCardIndex) {
            let cardId = board[playerCardIndex];
            let card = cardsLookup[cardId];

            console.log("0000000000000000000000000000000");
            console.log(card);
            console.log("0000000000000000000000000000000");

            let arrowPositions = this.readArrowPositionsOnCard(card);
            let arrowCounter = 0;

            let lala = [];
            for (;arrowCounter < arrowPositions.length; arrowCounter++) {
                let arrowIndex = arrowPositions[arrowCounter];
                let coords = this.coordinateForTileArrowIsPointingTo(playerCardIndex, arrowIndex);

                console.log("111111111111111111111111111");
                console.log(coords);
                console.log("111111111111111111111111111");

                let indexToCheck = toIndex([coords[0], coords[1]]);

                if (this.isArrowPointingToEnemyCard(card.owner, indexToCheck)) {
                    console.log(cardsLookup[board[indexToCheck]]);

                    lala.push({
                        boardIndex: indexToCheck,
                        arrowIndex: arrowIndex,
                        card: cardsLookup[board[indexToCheck]]
                    });
                }
            }

            return lala;

/*



            let arrowLength = playerCard.arrows.length;
            let arrowIndexPosition = 0;
            let arrowPositions = [];
            let arrows = playerCard.arrows;
            let coords = this.toCoords(index);

            for (;arrowIndexPosition < arrowLength; arrowIndexPosition++) {
                if (arrows[arrowIndexPosition] === 1) {
                    arrowPositions.push(arrowIndexPosition);
                }
            }

            let lala = [];
            for (let l = 0; l < arrowPositions.length; l++) {
                let pos = arrowPositions[l];
                let x = coords[0] + NEIGHBORS[pos].x;
                let y = coords[1] + NEIGHBORS[pos].y;

                let index = toIndex([x, y]);
                if (typeof index !== 'undefined' && typeof board[index] === 'string') {
                    let card = cardsLookup[board[index]];

                    if (playerCard.owner !== card.owner) {
                        cards.push({
                            boardIndex: index,
                            arrowIndex: pos,
                            card: card
                        });
                    }
                }
            }

            return lala;*/
        },

     /*   findBattlingCards (playerCard, index) {

            let res = this.findOpposingCardsPointedToBy(playerCard, index);
            this.updateOwnerOnCard("0afb4577-15b8-427d-b9de-1383389d1212", playerCard.owner);


            while (res.next().value) {
                console.log("Found connected card!");
            }


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

            return neighbouringCards;
        }
*/
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
}

