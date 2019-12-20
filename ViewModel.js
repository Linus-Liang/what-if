function Grade(grade) {
    const self = this;
    self.assignmentId = grade.assignmentId;
    self.grade = grade.grade;
    self.userId = grade.userId;
}

function ViewModel() {
    const self = this;

    const _gradingService = new GradingService(GradingSchemas.letter);

    self.assignmentView   = ko.observableArray();
    self.categoriesView   = ko.observableArray();
    self.overallGrade     = ko.observable();

    self.updateAssignmentEntry = function(newGrade) {
        // this = an AssignmentEntry from self.assignmentView
        const grade  = self.grades.find(g => g.assignmentId === this.assignmentId);
        const assignment = self.assignments.find(a => a.id === grade.assignmentId);
        grade.grade = newGrade; // Update the score of the grade so it can be graded with the inputed score

        const currentGradedAssignment = gradedAssignments.find(ga => ga.assignmentId === this.assignmentId); 
        const newGradedAssignment = _gradingService.gradeAssignment(assignment, grade, self.scoreCodes);

        // Update the properties of the old assignment with the new recalculated assignment
        Object.assign(currentGradedAssignment, newGradedAssignment);

        this.update(currentGradedAssignment);
        self.updateSummery();
    }

    self.updateSummery = function() {
        const gradedCategories = _gradingService.averageStudents(
            [self.student], // [self.student()] is done since the GradedService grades multiple students
            self.categories,
            gradedAssignments
        )[0].categories;
        const overall = _gradingService.calculateStudentData(self.student, gradedCategories).percentage;

        self.categoriesView(gradedCategories);
        self.overallGrade(overall);
    }

    self.isEditing = ko.observable(false);
    self.btnEditText = ko.pureComputed(() => self.isEditing() ? 'Stop Editing' : 'Start Editing');
    self.toggleEditing = () => self.isEditing(!self.isEditing());

    self.init = function (student, categories, assignments, grades, scoreCodes) {
        const newGrades = assignments.map(assignment => {
            const grade = grades.find(g => g.assignmentId === assignment.id);
            // This is done so assignments without a grade, can be edited
            return new Grade(grade || { assignmentId: assignment.id, userId: student.userId, grade: '' });
        });

        gradedAssignments = _gradingService.gradeAssignments(assignments, newGrades, scoreCodes);

        const assignmentView = assignments.map(assignment => {
            const gradedAssignment   = gradedAssignments.find(ga => assignment.id === ga.assignmentId);
            const assignmentCategory = categories.find(c => assignment.categoryId === c.id);
            return new AssignmentEntry(
                { ...assignmentCategory, ...assignment, categoryName: assignmentCategory.name },
                gradedAssignment,
                self.updateAssignmentEntry
            );
        });

        self.student = student;
        self.categories = categories;
        self.assignments = assignments;
        self.scoreCodes = scoreCodes;
        self.grades = newGrades;
        self.assignmentView(assignmentView);

        self.updateSummery();
    }
}
