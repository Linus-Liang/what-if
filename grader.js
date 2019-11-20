Array.prototype.isEmpty = function () {
  return this.length === 0;
};

Array.prototype.add = function () {
  if (this.isEmpty()) {
    return 0;
  }
  return this.reduce((left, right) => left + right);
}

class GradingService {
  constructor() {
    this.unGraded = [];
  }

  gradeAssignments(assignments, grades, scoreCodes) {
    const gradedAssignments = [];
    for (const grade of grades) {
      const assignment = assignments.find(item => item.id === grade.assignmentId);

      const numericGrade = parseInt(grade.grade);

      const gradedAssignment = {
        maxPoints: 0,
        categoryId: assignment.categoryId,
        earnedPoints: 0,
        grade: 0,
        maxScore: 0,
        userId: grade.userId
      };

      if(isNaN(numericGrade)) {
        const scoreCode = scoreCodes.find(scoreCode => scoreCode.code === grade.grade);
        if (scoreCode) {
          numericGrade = scoreCode.percent;
        } else {
          this.unGraded.push(gradedAssignment);
          continue;
        }
      }

      gradedAssignment.maxPoints = assignment.points;
      gradedAssignment.maxScore = assignment.maxScore;

      const score = numericGrade / assignment.maxScore;
      gradedAssignment.earnedPoints = score * assignment.points;
      gradedAssignment.grade = score;

      gradedAssignments.push(gradedAssignment);
    }
    return gradedAssignments;
  }

  averageCategories(students, categories, gradedAssignments) {
    const studentCollection = [];
    for (const student of students) {
      const grades = gradedAssignments.filter(g => g.userId === student.userId);
      const categoryCollection = {
        student: student.userId,
        categories: categories.map(category => {
          const assignments = grades.filter(g => g.categoryId === category.id);
          const earnedPoints = assignments.map(a => a.earnedPoints).add();
          const maxPoints = assignments.map(a => a.maxPoints).add();
          return {
            userId: student.userId,
            categoryId: category.id,
            earnedPoints: earnedPoints,
            maxPoints: maxPoints,
            average: maxPoints !== 0 ? earnedPoints / maxPoints : 1,
            weight: category.weight,
          }
        }),
      }
      studentCollection.push(categoryCollection);
    }
    return studentCollection;
  }

  studentAverage(id, studentAverages) {
    studentAverages = studentAverages.
    return studentAverages.reduce((left, right) => {
      if (typeof(left) === 'object') {
        left = left.average * left.weight;
      }
      return left + right.average * right.weight;
    });
  }
}

const testGrader = new GradingService();

const testData = {
  students: [{ userId: 100 }, { userId: 101 }],
  categories: [
    { weight: 20, id: 0, name: "Homework" },
    { weight: 50, id: 1, name: "Quiz" },
    { weight: 30, id: 3, name: "Classwork" },
  ],
  assignments: [
    { id: 0, categoryId: 0, maxScore: 100, points: 5,   name: "Homework #1" },
    { id: 1, categoryId: 0, maxScore: 100, points: 5,   name: "Homework #2" },
    { id: 2, categoryId: 1, maxScore: 100, points: 200, name: "Quiz Lesson 1" },
    { id: 3, categoryId: 1, maxScore: 100, points: 200, name: "Quiz Lesson 3" },
    { id: 4, categoryId: 2, maxScore: 5,   points: 1,   name: "Warm up Day 0x00" },
    { id: 5, categoryId: 2, maxScore: 5,   points: 1,   name: "Warm up Day 0x01" },
    { id: 6, categoryId: 2, maxScore: 5,   points: 1,   name: "Warm up Day 0x02" },
    { id: 7, categoryId: 2, maxScore: 5,   points: 1,   name: "Warm up Day 0x03" },
  ],
  grades: [
    { id: 0, assignmentId: 0, userId: 100, grade: "00" },//
    { id: 1, assignmentId: 1, userId: 100, grade: "100" },//
    { id: 2, assignmentId: 2, userId: 100, grade: "100" },//
    { id: 3, assignmentId: 3, userId: 100, grade: "100" },//
    { id: 4, assignmentId: 4, userId: 100, grade: "100" },//
    { id: 5, assignmentId: 5, userId: 100, grade: "100" },//
    { id: 6, assignmentId: 6, userId: 100, grade: "100" },//
  ],
  scoreCodes: [{
    "id": 1345,
    "shortcut": "e",
    "code": "abe",
    "description": "Absent - Excused",
    "percent": 0,
    "exempt": true,
    "sectionId": 160
  }, {
    "id": 1346,
    "shortcut": "a",
    "code": "abu",
    "description": "Absent - Unexcused",
    "percent": 0,
    "exempt": false,
    "sectionId": 160
  }, {
    "id": 1347,
    "shortcut": "m",
    "code": "mi",
    "description": "Missing",
    "percent": 0,
    "exempt": false,
    "sectionId": 160
  }, {
    "id": 1348,
    "shortcut": "d",
    "code": "dr",
    "description": "Dropped",
    "percent": 0,
    "exempt": true,
    "sectionId": 160
  }, {
    "id": 1349,
    "shortcut": "c",
    "code": "ch",
    "description": "Check",
    "percent": 75,
    "exempt": false,
    "sectionId": 160
  }, {
    "id": 1350,
    "shortcut": "p",
    "code": "chp",
    "description": "Check Plus",
    "percent": 100,
    "exempt": false,
    "sectionId": 160
  }, {
    "id": 1351,
    "shortcut": "n",
    "code": "chm",
    "description": "Check Minus",
    "percent": 55,
    "exempt": false,
    "sectionId": 160
  }, {
    "id": 1352,
    "shortcut": "i",
    "code": "inc",
    "description": "Incomplete",
    "percent": 55,
    "exempt": false,
    "sectionId": 160
  }]
}

const gradedAssignments = testGrader.gradeAssignments(testData.assignments, testData.grades, testData.scoreCodes);
console.log(gradedAssignments.map(s => s.earnedPoints), gradedAssignments.map(s => s.maxPoints));
const averagedCategories = testGrader.averageCategories(testData.students, testData.categories, gradedAssignments);
console.log(averagedCategories);
const studentZeroResults = testGrader.studentAverage(averagedCategories)
console.log(studentZeroResults);
