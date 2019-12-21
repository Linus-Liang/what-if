class CategoryEntry {
    constructor(gradedCategory) {
        this.name         = gradedCategory.name;
        this.weight       = gradedCategory.weight;
        this.earnedPoints = gradedCategory.earnedPoints;
        this.maxPoints    = gradedCategory.maxPoints;
        this.earnedWeight = gradedCategory.average * gradedCategory.weight;
        this.percentage   = gradedCategory.percentage;
        this.letterGrade  = gradedCategory.letterGrade;
    }
}

