function Grade(g) {
    const self = this;
    self.assignmentId = g.assignmentId;
    self.grade = g.grade;
    self.userId = g.userId;
}

function AssignmentEntry(assignment, score, gradedAssignment = {}, category) {
    const self = this;
    self.assignmentId = assignment.id;
    self.name = assignment.name;
    self.categoryName = category.name;

    self.maxScore = assignment.maxScore;
    self.points = assignment.points;
    
    self.earnedScore = ko.observable(score);
    self.earnedPoints = gradedAssignment.earnedPoints;
    // test if max points is ZERO
    self.percentage = gradedAssignment.earnedPoints / gradedAssignment.maxPoints * 100;

    //  schemas[name of schema]
    // refactor out the schema out of VIew Model
    self.letterGrade = getLetterGrade({
        name: '',
        ranges: [
            { letterGrade: 'A', minGrade: 90, maxGrade: 100 },
            { letterGrade: 'B', minGrade: 80, maxGrade: 89 },
            { letterGrade: 'C', minGrade: 70, maxGrade: 79 },
            { letterGrade: 'F', minGrade:  0, maxGrade: 69 }
        ]
    }, self.percentage);

    // explain with whats happenning here
    if(!self.percentage && !(self.percentage === 0)) {
        self.percentage = '';
    }

    // this will be replaced with a custom binding
    ['earnedPoints', 'percentage'].forEach(prop => {
        if (typeof(self[prop]) === 'number') {
            self[prop] = self[prop].toFixed(2);
        }
    });
}

function CategoryEntry(category, gradedCategory) {
    const self = this;

    self.displayName = `${category.name} (${category.weight})`;
    self.earnedPoints = gradedCategory.earnedPoints;
    self.maxPoints = gradedCategory.maxPoints;
    self.earnedWeight = gradedCategory.average * gradedCategory.weight;
    self.weight = gradedCategory.weight;
    self.percentage = gradedCategory.average * 100;

    ['earnedWeight', 'weight', 'percentage', 'earnedPoints'].forEach(prop => self[prop] = self[prop].toFixed(2));
}

function viewModel() {
    const self = this;

    const _gradingService = new GradingService();

    self.student = ko.observable();
    self.categories = ko.observableArray();
    self.assignments = ko.observableArray();
    self.grades = ko.observableArray();
    self.scoreCodes = ko.observableArray();

    self.gradedAssignments = ko.observableArray();
    self.assignmentView = ko.observableArray();
    self.gradedCategories = ko.observableArray();
    self.categoriesView = ko.observableArray();

    self.overallGrade = ko.observable();

    self.update = function() {
        const grades = self.grades().map(g => {
            const viewedAssignment = self.assignmentView().find(av => av.assignmentId === g.assignmentId);
            const a = viewedAssignment ? viewedAssignment.earnedScore() : g.grade;

            return {
                ...g,
                grade: a
            }
        });

        self.gradedAssignments(_gradingService.gradeAssignments(self.assignments(), grades, self.scoreCodes()));
        self.assignmentView(self.assignments().map(a => {
            const gradedAssignment = self.gradedAssignments().find(ga => a.id === ga.assignmentId);
            // let grade = self.grades().find(g => a.id === g.assignmentId) || {};
            const assignmentCategory = self.categories().find(c => c.id === a.categoryId);
            return new AssignmentEntry(a, gradedAssignment.earnedScore, gradedAssignment, assignmentCategory);
        }));
        
        self.gradedCategories(_gradingService.averageStudents([self.student()], self.categories(), self.gradedAssignments())[0].categories);
        self.categoriesView(self.categories().map(c => {
            const gradedCategory = self.gradedCategories().find(gc => gc.categoryId === c.id);
            return new CategoryEntry(c, gradedCategory);
        }));
        
        self.overallGrade(_gradingService.calculateStudentData(self.student(), self.gradedCategories()).percentage.toFixed(2));
    }

    self.getGrade = function (assignmentId) {
        return self.grades().find(g => g.assignmentId == assignmentId);
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
        self.grades(grades.map(g => new Grade(g)));
        self.update();
    }
}

const view = new viewModel();

async function loadData() {
    const response = await fetch('data.json');
    const data = await response.json();
    
    let selection = 0;
    const selectedData = data.result[selection];

    const student = selectedData.students[0];
    view.init(
        { userId: student.id }, 
        selectedData.categories.map(c => {
            return { id: c.id, weight: c.weight, name: c.name }
        }),
        selectedData.items.map(i => {
            return {
                id: i.id,
                categoryId: i.categoryId,
                maxScore: i.maxScore,
                extraCredit: i.isExtraCredit,
                points: i.points,
                name: i.name
            }
        }),
        student.gradedEntries.map(g => {
            return {
                id: 0,
                assignmentId: g.itemId,
                userId: g.userId,
                grade: g.rawScore
            }
        }),
        selectedData.scoreCodes
    )

    return data;
}

const data = loadData();

// const view = new viewModel(testData.students[0], testData.categories, testData.assignments, testData.grades.filter(g => g.userId === 100), testData.scoreCodes);
ko.applyBindings(view);