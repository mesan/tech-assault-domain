export default function tap(func, returnValue) {
    return function () {
        func(...arguments);

        if (returnValue) {
            return returnValue;
        }

        return arguments[0];
    }
}