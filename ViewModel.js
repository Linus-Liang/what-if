function Grade(grade, score) {
    const self = this;
    self.assignmentId = grade.assignmentId;
    self.grade = score;
    self.userId = grade.userId;
}

function ViewModel() {
    const self = this;

    const _gradingService = new GradingService();

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

    self.update = function(assignmentEntry) {
        const grade = self.grades().find(g => g.assignmentId === assignmentEntry.assignmentId);
        grade.grade = assignmentEntry.earnedScore();

        const assignment = self.assignments().find(a => a.id === grade.assignmentId);

        const currentGradedAssignments = self.gradedAssignments().find(ga => ga.assignmentId === assignmentEntry.assignmentId);
        const newGradedAssignment = _gradingService.gradeAssignment(assignment, grade, self.scoreCodes());
        Object.assign(currentGradedAssignments, newGradedAssignment);

        const letterGrade = self.getLetterGrade(newGradedAssignment);
        
        assignmentEntry.update(newGradedAssignment, letterGrade);
        self.assignmentView.notifySubscribers();
        
        self.updateSummery();
    }

    self.updateSummery = function() {
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

    self.getLetterGrade = function (gradedAssignment) {
        let letterGrade = { letterGrade: '' };
        // When and assignment has no grade don't calculate a letter
        if(gradedAssignment) {
            letterGrade = _gradingService.getLetterGrade(_gradingService.schemas['letter'], gradedAssignment.earnedScore);
        }

        return letterGrade;
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
        self.grades(grades.map(g => new Grade(g, g.grade)));

        self.gradedAssignments(_gradingService.gradeAssignments(
            self.assignments(),
            self.grades(), 
            self.scoreCodes()
        ));

        self.assignmentView(self.assignments().map(a => {
            /* This is done so assignments without a grade, can be edited */
            const grade = self.grades().find(g => g.assignmentId === a.id);
            if(!grade) {
                const fillingGrade = new Grade({ assignmentId: a.id, userId: a.userId }, 0);
                self.grades.push(fillingGrade);
                self.gradedAssignments.push(_gradingService.gradeAssignment(a, fillingGrade, self.scoreCodes()));
            }

            /* Creating the AssignmentView */
            const gradedAssignment = self.gradedAssignments().find(ga => a.id === ga.assignmentId);
            const assignmentCategory = self.categories().find(c => c.id === a.categoryId);
            const letterGrade = self.getLetterGrade(gradedAssignment);
            return new AssignmentEntry(a, gradedAssignment, letterGrade, assignmentCategory);
        }));

        for (const assignmentEntry of self.assignmentView()) {            
            assignmentEntry.earnedScore.subscribe(() => self.update(assignmentEntry));
        }

        self.updateSummery()
    }
}