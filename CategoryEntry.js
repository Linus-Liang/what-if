function CategoryEntry(gradedCategory) {
  const self = this;

  self.displayName = `${gradedCategory.name} (${gradedCategory.weight})`;
  self.earnedPoints = (gradedCategory.earnedPoints).toFixed(2);
  self.maxPoints = gradedCategory.maxPoints;
  self.earnedWeight = (gradedCategory.average * gradedCategory.weight).toFixed(2);
  self.weight     = gradedCategory.weight.toFixed(2);
  self.percentage = gradedCategory.percentage.toFixed(2);
  self.letterGrade = gradedCategory.letterGrade;
}
