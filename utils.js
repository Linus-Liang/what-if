const Util = {
    isEmpty: array => array.length === 0,
    add: (array) => array.reduce((left, right) => left + right),
    sum: (array, funcOrProp) => {
        if (typeof(funcOrProp) === 'function') {
            return Util.add(array.map(funcOrProp));
        }
        return Util.add(array.map(item => item[funcOrProp]));
    },
}
