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

Object.prototype.map = function (func) {
    const collection = [];
    for (const prop in this) {
        collection.push(func(this[prop], prop));
    }
    return collection;
}

function getLetterGrade(schema, number) {
    const ranges = schema.ranges;
    for (const range of ranges) {
        if (number >= range.minGrade) {
            return range;
        }
    }
} 

// getLetterGrade(10, schema).letterGrade === "A";