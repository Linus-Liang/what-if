class GradingService {
  constructor() {}

  normalizeGradeValue(gradeValue, scoreCodes) {
    if(isNaN(parseInt(gradeValue))) {
      const scoreCode = scoreCodes.filter(item => item.code === gradeValue);
      return scoreCode.percent;
    } else {
      return parseInt(gradeValue);
    }
  }

  gradeAssignments(assignments, grades, scoreCodes) {
    return grades.map(grade => {
      const assignment = assignments.filter(item => item.id === grade.assignmentId);
      
      const percent = this.normalizeGradeValue(grade.grade, scoreCodes) / assignment.maxScore;

      return {
        maxPoints: assignment.points,
        earnedPoints: percent * assignments.points,
        grade: percent,
        categoryId: assignment.categoryId,
        maxScore: assignment.maxScore,
        studentId: grade.studentId
      }
    });
  }

  
}
