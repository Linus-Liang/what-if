Array.prototype.isEmpty = function () {
  return this.length === 0;
};

Array.prototype.add = function () {
  if (this.isEmpty()) {
    return 0;
  }
  return this.reduce((left, right) => left + right);
}
