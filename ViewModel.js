// assignmentId, userId, score
function Grade(grade) {
    const self = this;
    self.assignmentId = grade.assignmentId;
    self.grade = grade.grade;
    self.userId = grade.userId;
}

function ViewModel() {
    const self = this;

    const _gradingService = new GradingService(GradingSchemas.letter);

    self.student = ko.observable();

    self.categories = ko.observableArray();
    self.gradedCategories = ko.observableArray();

    self.assignments = ko.observableArray();
    self.grades = ko.observableArray();
    self.scoreCodes = ko.observableArray();
    self.gradedAssignments = ko.observableArray();

    self.assignmentView = ko.observableArray();
    self.categoriesView = ko.observableArray();

    self.overallGrade = ko.observable();

    self.updateAssignmentEntry = function(newGrade) {
        // this = an AssignmentEntry form self.assignmentView
        const grade = self.grades().find(g => g.assignmentId === this.assignmentId);
        const assignment = self.assignments().find(a => a.id === grade.assignmentId);
        
        grade.grade = newGrade; // Update the score of the grade so it can be graded properly by the grader service

        let currentGradedAssignment = self.gradedAssignments().find(ga => ga.assignmentId === this.assignmentId); 
        const newGradedAssignment = _gradingService.gradeAssignment(assignment, grade, self.scoreCodes());

        Object.assign(currentGradedAssignment, newGradedAssignment); // Update the properties of the old assignment with the new recalculated assignment

        this.update(currentGradedAssignment);
        self.assignmentView.notifySubscribers(); // Update the UI
        
        self.updateSummery();
    }

    self.updateSummery = function() {
        // [self.student()] is done to conform the the grader service's assumption that thier is muliple students being graded
        self.gradedCategories(_gradingService.averageStudents(
            [self.student()],
            self.categories(),
            self.gradedAssignments()
        )[0].categories);

        self.categoriesView(self.gradedCategories().map(gradedCategory => new CategoryEntry(gradedCategory)));

        const overall = _gradingService.calculateStudentData(
            self.student(),
            self.gradedCategories()
        ).percentage.toFixed(2);
        
        self.overallGrade(overall);
    }

    self.isEditing = ko.observable(false);
    self.btnEditText = ko.pureComputed(() => self.isEditing() ? 'Stop Editing' : 'Start Editing');
    self.toggleEditing = () => {
        self.isEditing(!self.isEditing());
    }

    this.init = function (student, categories, assignments, grades, scoreCodes) {
        self.student(student);
        self.categories(categories);
        self.assignments(assignments);
        self.scoreCodes(scoreCodes);

        const newGrades = assignments.map(assignment => {
            /* This is done so assignments without a grade, can be edited */
            const grade = grades.find(g => g.assignmentId == assignment.id);
            return new Grade(grade || { assignmentId: assignment.id, userId: student.userId, gradel: '' });
        });
        self.grades(newGrades);

        self.gradedAssignments(_gradingService.gradeAssignments(
            self.assignments(),
            self.grades(),
            self.scoreCodes()
        ));

        self.assignmentView(self.assignments().map(assignment => {
            /* Creating the AssignmentView from the gradedAssignments */
            const gradedAssignment = self.gradedAssignments().find(ga => assignment.id === ga.assignmentId);
            const assignmentCategory = self.categories().find(c => c.id === assignment.categoryId);
            return new AssignmentEntry(assignment, gradedAssignment, assignmentCategory);
        }));

        //is it possible to remove this?
        for (const assignmentEntry of self.assignmentView()) {
            assignmentEntry.earnedScore.subscribe(self.updateAssignmentEntry, assignmentEntry);
            assignmentEntry.earnedScore.extend({ rateLimit: { timeout: 300, method: 'notifyWhenChangesStop' } });
        }

        self.updateSummery()
    }
}
