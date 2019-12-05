function GradeEntry(a, g, c) {
    const self = this;
    self.name = a.name;
    self.categoryName = c.name;

    self.maxScore = a.maxScore;
    self.points = a.points;

    self.earnedScore = ko.observable();

    // Use graderService
    self.earnedPoints = ko.pureComputed(function() {
        return self.earnedScore() / self.maxScore * self.points;
    });
    self.percentage = ko.pureComputed(() => self.earnedPoints() / self.points * 100);

    self.init = function() {
        const score = g.grade * g.maxScore;
        self.earnedScore(score);
    }
    self.init()
}

function CategoriesEntry(c) {
    const self = this;
    self.displayName = c.name + ' (' + c.weight + ')';
    self.weight = c.weight;

    self.average = ko.observable(c.average);
    self.earnedWeight = ko.pureComputed(() => self.average() * self.weight);

    self
}

function viewModel(targetstudentId, students, categories, assignments, grades, scoreCodes) {
    const self = this;
    
    const _gradingService = new GradingService();

    this.targetstudentId = ko.observable([]);
    this.students = ko.observableArray([]);
    this.categories = ko.observableArray([]);
    this.assignments = ko.observableArray([]);
    this.grades = ko.observableArray([]);
    this.scoreCodes = ko.observableArray([]);

    this.gradedAssignments = ko.observableArray([]);
    this.assignmentView = ko.observableArray([]);

    function generateAssignmentView(){
        return self.assignments().map(a => {
            const gradedAssignment = self.gradedAssignments().find(ga => a.id === ga.assignmentId);
            const assignmentCategory = self.categories().find(c => c.id === gradedAssignment.categoryId);
            return new GradeEntry(a, gradedAssignment, assignmentCategory);
        });
    }

    this.studentCollection = ko.observableArray([]);
    this.studentCategories = ko.pureComputed(() => self.studentCollection().find((sc) => sc.userId === self.targetstudentId()).categories);
    this.categoriesView = ko.pureComputed(() => {
        return self.categories().map(c => {
            const gradedCategory = self.studentCategories().find(gc => c.id === gc.categoryId); 
            return new CategoriesEntry(gradedCategory);
        });
    });

    this.studentSummary = ko.pureComputed(() => {
        return _gradingService.calculateStudentData(self.targetstudentId(), self.studentCollection())
    });
    
    // this.autoCompute = ko.pureComputed(() => {
    //     const grades = self.grades();
    //     if(self.assign .... self.isEditing()){
    //         self.gradedAssignments(_gradingService.gradeAssignments(self.assignments(), self.grades(), self.scoreCodes()));
    //         self.studentCollection(_gradingService.averageStudents(self.students(), self.categories(), self.gradedAssignments()));
    //     }
    
    
    // });
    
    // this.gradedStudents = ko.observableArray(averagedStudents.map(s => {
    //   return ko.observableArray(s.categories.map(ac => {
    //     ac.name = categories.find(c => ac.categoryId === c.id).name;
    //     return ac;
    //   }))
    // }));

    this.init = function() {
        self.targetstudentId(targetstudentId);
        self.students(students);
        self.categories(categories);
        self.assignments(assignments);
        self.scoreCodes(scoreCodes);
        self.grades(grades);
        self.gradedAssignments(_gradingService.gradeAssignments(self.assignments(), self.grades(), self.scoreCodes()));
        self.studentCollection(_gradingService.averageStudents(self.students(), self.categories(), self.gradedAssignments()));

        self.assignmentView(generateAssignmentView());
    }

    this.init();
}



const view = new viewModel(100, testData.students, testData.categories, testData.assignments, testData.grades, testData.scoreCodes);

ko.applyBindings(view);