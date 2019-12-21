class StudentGradesViewModel {
    constructor() {
        this._gradingService = new GradingService(GradingSchemas.letter);

        this.student;
        this.categories        = [];
        this.assignments       = [];
        this.scoreCodes        = [];
        this.grades            = [];
        this.gradedAssignments = [];
        this.assignmentView    = ko.observableArray();
        this.categoriesView    = ko.observableArray();
        this.overallGrade      = ko.observable();

        this.isEditing         = ko.observable(false);
        this.btnEditText       = ko.pureComputed(() => this.isEditing() ? 'Stop Editing' : 'Start Editing');
    }

    toggleEditing() {
        this.isEditing(!this.isEditing());
    }

    updateAssignmentEntry(assignmentEntry) {
        const grade = this.grades.find(g => g.assignmentId === assignmentEntry.assignmentId);
        const assignment = this.assignments.find(a => a.id === grade.assignmentId);
        grade.grade = assignmentEntry.earnedScore(); // Update the score of the grade so it can be graded with the inputed score
        
        const currentGradedAssignment = this.gradedAssignments.find(ga => ga.assignmentId === assignmentEntry.assignmentId);
        const newGradedAssignment = this._gradingService.gradeAssignment(assignment, grade, this.scoreCodes);
        
        // Update the properties of the old assignment with the new recalculated assignment
        Object.assign(currentGradedAssignment, newGradedAssignment);
        
        assignmentEntry.update(currentGradedAssignment);
        this.updateSummery();
    }

    updateSummery() {
        const gradedCategories = this._gradingService.averageStudents(
            [this.student], // [this.student()] is done since the GradedService grades multiple students
            this.categories,
            this.gradedAssignments
        )[0].categories;
        
        const overall = this._gradingService.calculateStudentData(this.student, gradedCategories).percentage;
        
        this.categoriesView(gradedCategories);
        this.overallGrade(overall);
    }

    init(student, categories, assignments, grades, scoreCodes) {
        const newGrades = assignments.map(assignment => {
            const grade = grades.find(g => g.assignmentId === assignment.id);
            // This is done so assignments without a grade, can be edited
            return new Grade(grade || { assignmentId: assignment.id, userId: student.userId, grade: '' });
        });
        
        this.gradedAssignments = this._gradingService.gradeAssignments(assignments, newGrades, scoreCodes);
        
        const assignmentView = assignments.map(assignment => {
            const gradedAssignment = this.gradedAssignments.find(ga => assignment.id === ga.assignmentId);
            const assignmentCategory = categories.find(c => assignment.categoryId === c.id);
            return new AssignmentEntry(
                { ...assignmentCategory, ...assignment, categoryName: assignmentCategory.name },
                gradedAssignment, this
            );
        });

        this.student = student;
        this.categories = categories;
        this.assignments = assignments;
        this.scoreCodes = scoreCodes;
        this.grades = newGrades;
        
        this.assignmentView(assignmentView);
        this.updateSummery();
    }
}
