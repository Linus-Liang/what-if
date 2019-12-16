function AssignmentEntry(assignment, gradedAssignment = {}, category) {
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

    self.update = function(gradedAssignment = {}) {        
        const earnedScore = gradedAssignment.earnedScore;
        const earnedPoints = gradedAssignment.earnedPoints;
        const percentage = gradedAssignment.earnedPoints / gradedAssignment.maxPoints * 100;

        // When gradedAssignment is undefined (that happends when no grade is given to an assignment),
        // then there should be blank fields, so set the properties to blank strings
        self.earnedScore(earnedScore || earnedScore === 0 ? earnedScore.toFixed(0) : '');
        self.earnedPoints(earnedPoints || earnedPoints === 0 ? earnedPoints.toFixed(2) : '');
        self.percentage(percentage ? percentage.toFixed(1) : '');
        
        self.letterGrade(gradedAssignment.letterGrade);
    }

    self.update(gradedAssignment);
}
