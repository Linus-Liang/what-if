function GradeEntry(a, g, c) {
    const self = this;
    self.name = a.name;
    self.categoryName = c.name;

    self.maxScore = a.maxScore;
    self.points = a.points;

    if (g) {
        self.earnedScore = g.earnedScore;
        self.earnedPoints = g.earnedPoints;
        self.percentage = g.earnedPoints / g.maxPoints * 100;
    }
}

// function CategoriesEntry(c) {
//     const self = this;
//     self.displayName = c.name + ' (' + c.weight + ')';
//     self.weight = c.weight;

//     self.average = ko.observable(c.average);
//     self.earnedWeight = ko.pureComputed(() => self.average() * self.weight);

//     self
// }

function viewModel(categories, assignments, grades, scoreCodes) {
    const self = this;
    
    const _gradingService = new GradingService();

    self.categories = ko.observableArray([]);
    self.assignments = ko.observableArray([]);
    self.grades = ko.observableArray([]);
    self.scoreCodes = ko.observableArray([]);

    self.forceRecompute = ko.observable();

    self.gradedAssignments = ko.pureComputed(() => {
        self.forceRecompute();
        const graded = _gradingService.gradeAssignments(self.assignments(), self.grades(), self.scoreCodes());
        for (const ga of graded) {
            ga.earnedScore = ko.observable(ga.earnedScore);
            /// Continue From Here
            ga.earnedScore.subscribe(// set something in self.assignments and then recompute (run this function/ update self.gradedAssignments))
        }
        return graded;
    });
    self.assignmentView = ko.pureComputed(() => self.assignments().map(a => {
        const gradedAssignment = self.gradedAssignments().find(ga => a.id === ga.assignmentId);        
        const assignmentCategory = self.categories().find(c => c.id === a.categoryId);
        return new GradeEntry(a, gradedAssignment, assignmentCategory);
    }));

    // this.studentCollection = ko.observableArray([]);
    // this.studentCategories = ko.pureComputed(() => self.studentCollection().find((sc) => sc.userId === self.targetstudentId()).categories);
    // this.categoriesView = ko.pureComputed(() => {
    //     return self.categories().map(c => {
    //         const gradedCategory = self.studentCategories().find(gc => c.id === gc.categoryId); 
    //         return new CategoriesEntry(gradedCategory);
    //     });
    // });

    // this.studentSummary = ko.pureComputed(() => {
    //     return _gradingService.calculateStudentData(self.targetstudentId(), self.studentCollection())
    // });
    
    // asdf
    // // this.autoCompute = ko.pureComputed(() => {
    // //     const grades = self.grades();
    // //     if(self.assign .... self.isEditing()){
    // //         self.gradedAssignments(_gradingService.gradeAssignments(self.assignments(), self.grades(), self.scoreCodes()));
    // //         self.studentCollection(_gradingService.averageStudents(self.students(), self.categories(), self.gradedAssignments()));
    // //     }
    
    
    // // });
    
    // // this.gradedStudents = ko.observableArray(averagedStudents.map(s => {
    // //   return ko.observableArray(s.categories.map(ac => {
    // //     ac.name = categories.find(c => ac.categoryId === c.id).name;
    // //     return ac;
    // //   }))
    // // }));

    this.init = function() {
        self.categories(categories);
        self.assignments(assignments);
        self.scoreCodes(scoreCodes);
        self.grades(grades);
        // self.studentCollection(_gradingService.averageStudents([], self.categories(), self.gradedAssignments()));
    }

    this.init();
}



const view = new viewModel(testData.categories, testData.assignments, testData.grades.filter(g => g.userId === 100), testData.scoreCodes);

ko.applyBindings(view);