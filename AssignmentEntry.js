class AssignmentEntry {
    constructor(staticData, gradedAssignment, parent) {
        this.assignmentId = staticData.id;
        this.name         = staticData.name;
        this.maxScore     = staticData.maxScore;
        this.points       = staticData.points;
        this.categoryName = staticData.categoryName;
        this.maxinputLength = this.maxScore.toString().length
        this.earnedScore  = ko.observable();
        this.earnedPoints = ko.observable();
        this.percentage   = ko.observable();
        this.letterGrade  = ko.observable();

        this.update(gradedAssignment);
        this.earnedScore.subscribe(() => {
            parent.updateAssignmentEntry(this);
        });
        this.earnedScore.extend({
            rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' },
        });
    }

    update(gradedAssignment) {
        // When gradedAssignment is undefined (that happends when no grade is given to an assignment),
        // then there should be blank fields, so set the properties to blank strings
        if (!gradedAssignment.exempt) {
            this.earnedScore(gradedAssignment.earnedScore);
            this.earnedPoints(gradedAssignment.earnedPoints);
            this.percentage(gradedAssignment.percentage);
            this.letterGrade(gradedAssignment.letterGrade);
        }
        else {
            this.earnedScore('').earnedPoints('').percentage('').letterGrade('');
        }
    }
}
