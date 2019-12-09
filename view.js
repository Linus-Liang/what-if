function Grade(g) {
    const self = this;
    self.assignmentId = g.assignmentId;
    self.grade = ko.observable(g.grade);
    self.exempt = g.exempt;
    self.id = g.id;
    self.userId = g.userId;
}

function GradeEntry(a, g, ga, c) {
    const self = this;
    self.assignmentId = a.id;
    self.name = a.name;
    self.categoryName = c.name;

    self.maxScore = a.maxScore;
    self.points = a.points;

    if (ga) {
        self.earnedScore = g.grade;
        self.earnedPoints = ga.earnedPoints;
        self.percentage = ga.earnedPoints / ga.maxPoints * 100;
    }
}


function viewModel(categories, assignments, grades, scoreCodes) {
    const self = this;
    
    const _gradingService = new GradingService();

    self.categories = ko.observableArray([]);
    self.assignments = ko.observableArray([]);
    self.grades = ko.observableArray([]);
    self.scoreCodes = ko.observableArray([]);

    self.update = function() {
        
    }
    self.gradedAssignments = ko.pureComputed(() => _gradingService.gradeAssignments(self.assignments(), self.grades().map(g => {
        g.grade.subscribe((a) => console.log(a, g));
        g.grade = g.grade();
        return g;
    }), self.scoreCodes()));
    self.assignmentView = ko.pureComputed(() => self.assignments().map(a => {
        const gradedAssignment = self.gradedAssignments().find(ga => a.id === ga.assignmentId);
        const grade = self.grades().find(g => a.id === g.assignmentId);
        const assignmentCategory = self.categories().find(c => c.id === a.categoryId);
        return new GradeEntry(a, grade, gradedAssignment, assignmentCategory);
    }));

    self.getGrade = function (assignmentId) {
        return self.grades().find(g => g.assignmentId == assignmentId);
        // return ko.pureComputed();
    }

    this.init = function() {
        self.categories(categories);
        self.assignments(assignments);
        self.scoreCodes(scoreCodes);
        self.grades(grades.map(g => new Grade(g)));
        update();
    }

    this.init();
}



const view = new viewModel(testData.categories, testData.assignments, testData.grades.filter(g => g.userId === 100), testData.scoreCodes);

ko.applyBindings(view);