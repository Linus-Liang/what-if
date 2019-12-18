const Util = {
    add: (array) => array.reduce((left, right) => left + right),
    sum: (array, funcOrProp) => {
        if (!array || array.length === 0) {
            return 0;
        }
        if (typeof(funcOrProp) === 'function') {
            return Util.add(array.map(funcOrProp));
        }
        return Util.add(array.map(item => item[funcOrProp]));
    },
}

Util.sum(null)
