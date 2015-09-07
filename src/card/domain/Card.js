import {
    validatePower,
    validateType,
    validatePhysicalDefense,
    validateMagicalDefense
} from './cardValidator';

import {
    CARD_VALUE_MIN,
    CARD_TYPES
} from './cardConstants';

import { List } from '../../util/collections';

export default class Card {
    constructor(attributes) {
        attributes = attributes || {};

        this.power = validatePower(attributes.power)
            ? attributes.power : CARD_VALUE_MIN;

        this.type = validateType(attributes.type)
            ? attributes.type : CARD_TYPES.PHYSICAL;

        this.physicalDefense = validatePower(attributes.physicalDefense)
            ? attributes.physicalDefense : CARD_VALUE_MIN;

        this.magicalDefense = validatePower(attributes.magicalDefense)
            ? attributes.magicalDefense : CARD_VALUE_MIN;

        var defaultArrows = List.of(false, false, false, false, false, false, false, false);

        var booleanArrows = attributes.arrows ? attributes.arrows.map((arrow) => !!arrow) : [];

        this.arrows = defaultArrows.merge(booleanArrows);
    }
}