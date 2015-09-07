import {
    CARD_VALUE_MIN, 
    CARD_VALUE_MAX,
    CARD_TYPES
} from './cardConstants';

function validatePower(power) {
    return power >= CARD_VALUE_MIN && power <= CARD_VALUE_MAX;
}

function validateType(type) {
    let cardTypeKeys = Object.keys(CARD_TYPES);

    for (let cardTypeKey of cardTypeKeys) {
        if (CARD_TYPES[cardTypeKey] === type) {
            return true;
        }
    }

    return false;
}

function validatePhysicalDefense(physicalDefense) {
    return physicalDefense >= CARD_VALUE_MIN && physicalDefense <= CARD_VALUE_MAX;
}

function validateMagicalDefense(magicalDefense) {
    return magicalDefense >= CARD_VALUE_MIN && magicalDefense <= CARD_VALUE_MAX;
}

export default {
    validatePower,
    validateType,
    validatePhysicalDefense,
    validateMagicalDefense
};