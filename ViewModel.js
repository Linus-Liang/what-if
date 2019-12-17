function Grade(grade, score) {
    const self = this;
    self.assignmentId = grade.assignmentId;
    self.grade = score;
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
        if (newGradedAssignment) {
            Object.assign(currentGradedAssignment, newGradedAssignment); // Update the properties of the old assignment with the new recalculated assignment
        } else {
            for (const key of Object.keys(currentGradedAssignment)) {
                if (key == 'assignmentId') {
                    continue;
                }
                currentGradedAssignment[key] = '';
            } // When 
        }

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

        self.categoriesView(self.categories().map(c => {
            const gradedCategory = self.gradedCategories().find(gc => gc.categoryId === c.id);
            return new CategoryEntry(c, gradedCategory);
        }));

        self.overallGrade(_gradingService.calculateStudentData(
            self.student(),
            self.gradedCategories()
        ).percentage.toFixed(2));
    }

    self.isEditing = ko.observable(false);
    self.btnEditText = ko.pureComputed(() => self.isEditing() ? 'Stop Editing' : 'Start Editing');
    self.toggleEditing = function () {
        self.isEditing(!self.isEditing());
    }

    this.init = function (student, categories, assignments, grades, scoreCodes) {
        self.student(student);
        self.categories(categories);
        self.assignments(assignments);
        self.scoreCodes(scoreCodes);

        const newGrades = assignments.map(a => {
            /* This is done so assignments without a grade, can be edited */
            const grade = grades.find(g => g.assignmentId == a.id);
            if(!grade) {
                return new Grade({ assignmentId: a.id, userId: student.userId }, '');
            }
            // Regular: assignments with a grade
            return new Grade(grade, grade.grade);
        });
        self.grades(newGrades);

        self.gradedAssignments(_gradingService.gradeAssignments(
            self.assignments(),
            self.grades(),
            self.scoreCodes()
        ));
        for(const grade of self.grades()) {
            /* When their is no grade for an assignment, the grader refuses to grade is, */
            const possibleGradedAssignment = self.gradedAssignments().find(ga => ga.assignmentId === grade.assignmentId);
            if(!possibleGradedAssignment) {
                self.gradedAssignments.push({});
            }
        }

        self.assignmentView(self.assignments().map(a => {
            /* Creating the AssignmentView */

            const gradedAssignment = self.gradedAssignments().find(ga => a.id === ga.assignmentId);
            const assignmentCategory = self.categories().find(c => c.id === a.categoryId);
            return new AssignmentEntry(a, gradedAssignment, assignmentCategory);
        }));

        for (const assignmentEntry of self.assignmentView()) {            
            assignmentEntry.earnedScore.subscribe(self.updateAssignmentEntry, assignmentEntry);
            assignmentEntry.earnedScore.extend({ rateLimit: { timeout: 300, method: 'notifyWhenChangesStop' } });
        }

        self.updateSummery()
    }
}
