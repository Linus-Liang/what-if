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
    if(isNaN(parseInt(gradeValue))) {
      const [scoreCode] = scoreCodes.filter(scoreCode => scoreCode.code === gradeValue);
      return scoreCode.percent;
    } else {
      return parseInt(gradeValue);
    }
  }

  gradeAssignments(assignments, grades, scoreCodes) {
    return grades.map(grade => {
      const [assignment] = assignments.filter(item => item.id === grade.assignmentId);
      
      const score = this.normalizeGradeValue(grade.grade, scoreCodes) / assignment.maxScore;

      return {
        maxPoints: assignment.points,
        earnedPoints: score * assignment.points,
        grade: score,
        categoryId: assignment.categoryId,
        maxScore: assignment.maxScore,
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

  gradeStudentsCategories(students, categories, gradedAssignments) {
    return students.map(student => {
      return categories.map(category => {
        const grades = gradedAssignments.filter(grade => grade.categoryId === category.id && grade.userId === student.userId);
        
        if (grades.isEmpty()) {
          return 0;
        }

        grades[0] = this.calculateFinalGradeValues(grades[0]);

        const accGradeValues = grades.reduce((previousGradeValues, next) => {
          const nextGradeValues = this.calculateFinalGradeValues(next);

          previousGradeValues[0] += nextGradeValues[0];
          previousGradeValues[1] += nextGradeValues[1];
          return nextGradeValues;
        });

        const categoryAverage = accGradeValues[0] / accGradeValues[1];
        return categoryAverage;
      });
    });
  }
}
