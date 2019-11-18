Array.prototype.isEmpty = function () {
  return this.length === 0;
};

Array.prototype.add = function () {
  return this.reduce((left, right) => left + right);
}

class GradingService {
  constructor() {
    this.worthlessGrade = [0, 0];
  }

  normalizeGradeValue(gradeValue, scoreCodes) {
    const numericGrade = parseInt(gradeValue);
    if(isNaN(numericGrade)) {
      const scoreCode = scoreCodes.find(scoreCode => scoreCode.code === gradeValue);
      if (!scoreCode) {
        return 'unknown';
      }
      return scoreCode.percent;
    }
    return numericGrade;
  }

  gradeAssignments(assignments, grades, scoreCodes) {
    return grades.map(grade => {
      const assignment = assignments.find(item => item.id === grade.assignmentId);
      
      const normalizedGrade = this.normalizeGradeValue(grade.grade, scoreCodes);
      const unknownGrade = normalizedGrade === 'unknown';

      const score = unknownGrade ? 0 : normalizedGrade / assignment.maxScore;

      return {
        maxPoints: unknownGrade ? 0 : assignment.points,
        earnedPoints: score * assignment.points,
        grade: score,
        categoryId: assignment.categoryId,
        maxScore:assignment.maxScore,
        userId: grade.userId
      }
    });
  }

  calculateFinalGradeValues(grade) {
    if (grade.maxScore === 0) {
      return this.worthlessGrade;
    }
    return [grade.earnedPoints, grade.maxScore];
  }

  _averageCategory(category, gradedAssignments, student) {
    const grades = gradedAssignments
      .filter(grade => grade.categoryId === category.id && grade.userId === student.userId);
    
    if (grades.isEmpty()) {
      return 0;
    }

    const accGradeValues = grades.reduce((previousGradeValues, next) => {
      const nextGradeValues = this.calculateFinalGradeValues(next);

      previousGradeValues[0] += nextGradeValues[0];
      previousGradeValues[1] += nextGradeValues[1];
      return nextGradeValues;
    }, [0, 0]);

    const categoryAverage = accGradeValues[0] / accGradeValues[1];
    return categoryAverage;
  }

  averageCategories(students, categories, gradedAssignments) {
    return students.map(student => {
      return {
        userId: student.userId,
        categories: categories.map(category => {
          return {
            id: category.id,
            weight: category.weight,
            average: this._averageCategory(category, gradedAssignments, student)
          }
        })
      }
    });
  }

  studentAverage(targetStudent, allStudentsCategories) {
    const studentAverages = allStudentsCategories.find(student => student.userId === targetStudent.userId).categories;

    studentAverages[0] = studentAverages[0].average * studentAverages[0].weight;

    return studentAverages.reduce((left, right) => left + right.average * right.weight);
  }
}

const testGrader = new GradingService();

const testData = {
  students: [{ userId: 100 }],
  categories: [
    { name: "class one", weight: 100, id: 0, }, 
    { name: "class two", weight: 0, id: 1, }
  ],
  grades: [
    { id: 0, assignmentId: 0, userId: 100, grade: "100", }, 
    { id: 1, assignmentId: 1, userId: 100, grade: "b", }, 
    { id: 2, assignmentId: 2, userId: 100, grade: "100", }, 
    { id: 3, assignmentId: 3, userId: 100, grade: "100", }
  ], 
  assignments: [
    { id: 0, categoryId: 0, maxScore: 100, points: 10,  name: "assignment one", },
    { id: 1, categoryId: 0, maxScore: 100, points: 10,  name: "assign", }, 
    { id: 2, categoryId: 1, maxScore: 100, points: 10,  name: "one", }, 
    { id: 3, categoryId: 1, maxScore: 100, points: 10,  name: "two", }
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
console.log(gradedAssignments.map(s => s.earnedPoints));
const averagedCategories = testGrader.averageCategories(testData.students, testData.categories, gradedAssignments);
const studentZeroResults = testGrader.studentAverage(testData.students[0], averagedCategories)
