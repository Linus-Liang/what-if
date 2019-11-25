Array.prototype.isEmpty = function () {
    return this.length === 0;
};

Array.prototype.add = function () {
    return this.reduce((left, right) => left + right);
}

Array.prototype.sum = function (funcOrProp) {
    if (typeof(funcOrProp) === 'function') {
        return this.map(funcOrProp).add();
    }
    return this.map(item => item[funcOrProp]).add();
}
