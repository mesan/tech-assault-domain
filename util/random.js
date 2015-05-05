import {List} from './collections';

export function getRandomNumber(from, to) {
    return _getRandomNumber(from, to);
}

export function getRandomNumbers(from, to, count, unique) {
    let numbers = List();

    if (unique) {
        if (to - from < count) {
            return numbers;
        }

        while (numbers.size < count) {
            let randomNumber = _getRandomNumber(from, to);

            if (!numbers.contains(randomNumber)) {
                numbers = numbers.push(randomNumber);
            }
        }

        return numbers;
    } else {
        while (numbers.size < count) {
            numbers = numbers.push(_getRandomNumber(from, to));
        }

        return numbers;
    }
}

function _getRandomNumber(from, to) {
    return Math.floor((Math.random() * (to - from + 1)) + from);
}