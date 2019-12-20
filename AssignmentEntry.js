function AssignmentEntry(staticData, gradedAssignment, notifyFunc) {
    const self = this;
    
    self.assignmentId = staticData.id;
    self.name         = staticData.name;
    self.maxScore     = staticData.maxScore;
    self.points       = staticData.points;
    self.categoryName = staticData.categoryName;

    self.earnedScore  = ko.observable();
    self.earnedPoints = ko.observable();
    self.percentage   = ko.observable();
    self.letterGrade  = ko.observable();
    
    self.update = function(gradedAssignment) {
        // When gradedAssignment is undefined (that happends when no grade is given to an assignment),
        // then there should be blank fields, so set the properties to blank strings

        self.earnedScore (gradedAssignment.exempt ? '' : gradedAssignment.earnedScore);
        self.earnedPoints(gradedAssignment.exempt ? '' : gradedAssignment.earnedPoints);
        self.percentage  (gradedAssignment.exempt ? '' : gradedAssignment.percentage);
        self.letterGrade (gradedAssignment.exempt ? '' : gradedAssignment.letterGrade);
    }

    self.update(gradedAssignment);
    self.earnedScore.subscribe(notifyFunc, self);
}
