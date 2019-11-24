class GradingService {
  constructor() {
    this.unGraded = [];
  }

  gradeAssignments(assignments, grades, scoreCodes) {
    const gradedAssignments = [];
    for (const grade of grades) {
      const assignment = assignments.find(item => item.id === grade.assignmentId);
      const gradedAssignment = {
        categoryId: assignment.categoryId,
        assignmentId: assignment.id,
        userId: grade.userId,
      };

      const numericGrade = parseInt(grade.grade);
      if(isNaN(numericGrade)) {
        const scoreCode = scoreCodes.find(scoreCode => scoreCode.code === grade.grade);
        if (scoreCode) {
          numericGrade = scoreCode.percent;
        } else {
          this.unGraded.push(gradedAssignment);
          console.warn('Ungraded assignment', gradeAssignment, assignment.name);
          continue;
        }
      }

      gradedAssignment.maxPoints = assignment.points;
      gradedAssignment.maxScore = assignment.maxScore;
      const score = numericGrade / assignment.maxScore;
      gradedAssignment.grade = score;

      gradedAssignment.earnedPoints = score * assignment.points;

      gradedAssignments.push(gradedAssignment);
    }
    return gradedAssignments;
  }

  averageCategories(students, categories, gradedAssignments) {
    const studentCollection = [];
    for (const student of students) {
      const grades = gradedAssignments.filter(g => g.userId === student.userId);
      const gradedCategories = categories.map(category => {
        const assignments = grades.filter(g => g.categoryId === category.id);
        const earnedPoints = assignments.map(a => a.earnedPoints).add();
        const maxPoints = assignments.map(a => a.maxPoints).add();
        return {
          userId: student.userId,
          categoryId: category.id,
          weight: category.weight,
          earnedPoints: earnedPoints,
          maxPoints: maxPoints,
          zeroAssignments: assignments.isEmpty(),
          average: maxPoints !== 0 ? earnedPoints / maxPoints : 0,
        };
      });
      studentCollection.push({
        userId: student.userId,
        categories: gradedCategories,
      });
    }
    return studentCollection;
  }

  calculateStudentData(student, allStudentsCategories) {
    const studentCategories = allStudentsCategories.find((sa) => sa.userId === student.userId).categories;

    const earnedAverage = studentCategories.map((cat) => cat.average * cat.weight).add();
    const totalWeight = studentCategories.map((cat) => cat.zeroAssignments ? 0 : cat.weight).add();

    const percent = earnedAverage / totalWeight;
    const studentInfo = {
      ...student,
      percent: percent,
      percentage: percent * 100,
      earnedPoints: earnedAverage,
      maxWeight: totalWeight,
      categories: studentCategories,
    };
    return studentInfo;
  }
}
