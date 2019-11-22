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
      const categoryCollection = {
        userId: student.userId,
        categories: categories.map(category => {
          const assignments = grades.filter(g => g.categoryId === category.id);
          const earnedPoints = assignments.map(a => a.earnedPoints).add();
          const maxPoints = assignments.map(a => a.maxPoints).add();
          return {
            userId: student.userId,
            categoryId: category.id,
            earnedPoints: earnedPoints,
            maxPoints: maxPoints,
            zeroAssignments: assignments.length === 0,
            average: maxPoints !== 0 ? earnedPoints / maxPoints : 0,
            weight: category.weight,
          };
        }),
      };
      studentCollection.push(categoryCollection);
    }
    return studentCollection;
  }

  studentCategoryScores(studentCategories) {
    let accumulatedAverage = studentCategories.map((cat) => cat.average * cat.weight).add();
    let totalWeight = studentCategories.map((cat) => cat.zeroAssignments ? 0 : cat.weight).add();
    return [accumulatedAverage, totalWeight];
  }

  updateStudent(student, allStudentsCategories) {
    const studentCategories = allStudentsCategories.find((sa) => sa.userId === student.userId).categories;
    const [earnedPoints, maxWeight] = this.studentCategoryScores(studentCategories);
    const percent = earnedPoints / maxWeight;
    return {
      ...student,
      percent: percent,
      percentage: percent * 100,
      earnedPoints: earnedPoints,
      maxWeight: maxWeight,
      categories: studentCategories,
    }
  }
}
