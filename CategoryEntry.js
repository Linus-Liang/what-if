function CategoryEntry(category, gradedCategory) {
  const self = this;

  self.displayName = `${category.name} (${category.weight})`;
  self.earnedPoints = gradedCategory.earnedPoints;
  self.maxPoints = gradedCategory.maxPoints;
  self.earnedWeight = gradedCategory.average * gradedCategory.weight;
  self.weight = gradedCategory.weight;
  self.percentage = gradedCategory.average * 100;

  ['earnedWeight', 'weight', 'percentage', 'earnedPoints'].forEach(prop => self[prop] = self[prop].toFixed(2));
}
