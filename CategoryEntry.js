function CategoryEntry(gradedCategory) {
  const self = this;

  self.name         = gradedCategory.name;
  self.weight       = gradedCategory.weight;
  self.earnedPoints = gradedCategory.earnedPoints;
  self.maxPoints    = gradedCategory.maxPoints;
  self.earnedWeight = gradedCategory.average * gradedCategory.weight;
  self.percentage   = gradedCategory.percentage;
  self.letterGrade  = gradedCategory.letterGrade;
}
