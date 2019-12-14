function AssignmentEntry(assignment, gradedAssignment = {}, letterGrade, category) {
    const self = this;
    
    self.assignmentId = assignment.id;
    self.name = assignment.name;
    self.categoryName = category.name;

    self.maxScore = assignment.maxScore;
    self.points = assignment.points;

    self.earnedScore = ko.observable();
    self.earnedPoints = ko.observable();
    self.percentage = ko.observable();
    self.letterGrade = ko.observable();

    self.update = function(gradedAssignment = {}, letterGrade) {
        
        const earnedScore = gradedAssignment.earnedScore;
        const earnedPoints = gradedAssignment.earnedPoints;
        const percentage = gradedAssignment.earnedPoints / gradedAssignment.maxPoints * 100;

        self.earnedScore(earnedScore ? earnedScore.toFixed(0) : '');
        self.earnedPoints(earnedPoints ? earnedPoints.toFixed(2) : '');
        self.percentage(percentage ? percentage.toFixed(1) : '');
        
        self.letterGrade(letterGrade);

        // manyApply((val) => val(val().tofixed(2)), self.earnedScore)
    }

    self.update(gradedAssignment, letterGrade);
}
