Array.prototype.isEmpty = function () {
  return this.length === 0;
};

Array.prototype.add = function () {
  // if (arguments.length === 1) {
  //   return reduce((left, right) => left + right);
  // }
  if (this.isEmpty()) {
      return 0;
  }
  return this.reduce((left, right) => left + right);
}

Array.prototype.mapAndApply = function (prop, isOnPrototype, func) {
  const mapped = this.map(item => item[prop]);
  if (isOnPrototype) {
    return mapped[func]();
  }
  return Function.call(mapped)
}