export function getRandomNumber(from, to) {
    return _getRandomNumber(from, to);
}

export function getRandomNumbers(from, to, count, unique = false) {
    let numbers = [];

    if (unique) {
        if (to - from < count - 1) {
            return numbers;
        }

        while (numbers.length < count) {
            let randomNumber = _getRandomNumber(from, to);

            if (numbers.indexOf(randomNumber) === -1) {
                numbers.push(randomNumber);
            }
        }

        return numbers;
    } else {
        while (numbers.length < count) {
            numbers.push(_getRandomNumber(from, to));
        }

        return numbers;
    }
}

function _getRandomNumber(from, to) {
    return Math.floor((Math.random() * (to - from + 1)) + from);
}