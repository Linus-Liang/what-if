function Grade(g) {
    const self = this;
    self.assignmentId = g.assignmentId;

    self.grade = ko.observable(g.grade);
    self.grade.extend({ rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' } });

    self.exempt = g.exempt;
    self.id = g.id;
    self.userId = g.userId;
}

function AssignmentEntry(assignment, grade = {}, gradedAssignment = {}, category) {
    const self = this;
    self.assignmentId = assignment.id;
    self.name = assignment.name;
    self.categoryName = category.name;

    self.maxScore = assignment.maxScore;
    self.points = assignment.points;

    self.earnedScore = grade.grade || ' ';
    self.earnedPoints = gradedAssignment.earnedPoints || ' ';
    self.percentage = gradedAssignment.earnedPoints / gradedAssignment.maxPoints * 100 || ' ';
}

function viewModel(categories, assignments, grades, scoreCodes) {
    const self = this;

    const _gradingService = new GradingService();

    self.categories = ko.observableArray([]);
    self.assignments = ko.observableArray([]);
    self.grades = ko.observableArray([]);
    self.scoreCodes = ko.observableArray([]);

    self.gradedAssignments = ko.observable();
    self.assignmentView = ko.observable();

    self.autoCompute = ko.computed(() => {
        for(self.grades()) {
            
        }
    });

    self.update = function() {
        const grades = self.grades().map(g => {
            return {
                ...g,
                grade: g.grade(),
            }
        });

        self.gradedAssignments(_gradingService.gradeAssignments(self.assignments(), grades, self.scoreCodes()));
        self.assignmentView(self.assignments().map(a => {
            const gradedAssignment = self.gradedAssignments().find(ga => a.id === ga.assignmentId);
            const grade = self.grades().find(g => a.id === g.assignmentId);
            const assignmentCategory = self.categories().find(c => c.id === a.categoryId);
            return new AssignmentEntry(a, grade, gradedAssignment, assignmentCategory);
        }));
    }

    self.getGrade = function (assignmentId) {
        return self.grades().find(g => g.assignmentId == assignmentId);
        // return ko.pureComputed();
    }

    this.init = function() {
        self.categories(categories);
        self.assignments(assignments);
        self.scoreCodes(scoreCodes);
        self.grades(grades.map(g => new Grade(g)));
        self.update();
    }

    this.init();
}



const view = new viewModel(testData.categories, testData.assignments, testData.grades.filter(g => g.userId === 100), testData.scoreCodes);

ko.applyBindings(view);