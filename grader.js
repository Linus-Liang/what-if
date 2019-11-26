class GradingService {
    constructor() {
        // grades that cannot be calculated for: having an invaild grade, or having a max score of 0
        this.unGraded = [];
    }

    // 
    gradeAssignments(assignments, grades, scoreCodes) {
        const gradedAssignments = [];
        for (const grade of grades) {
            const assignment = assignments.find(item => item.id === grade.assignmentId);
            const gradedAssignment = {
                categoryId: assignment.categoryId,
                assignmentId: assignment.id,
                userId: grade.userId,
                extraCredit: assignment.extraCredit,
                exempt: grade.exempt,
            };

            const numericGrade = parseInt(grade.grade);
            if (isNaN(numericGrade)) {
                const scoreCode = scoreCodes.find(scoreCode => scoreCode.code === grade.grade);
                if (scoreCode) {
                    numericGrade = scoreCode.percent;
                    gradedAssignment.exempt = scoreCode.exempt;
                } else {
                    this.unGraded.push(gradedAssignment);
                    console.warn('Ungraded assignment, cause: scoreCode does not exist or grade is not a number', gradedAssignment, assignment.name);
                    continue;
                }
            }

            if (assignment.maxScore === 0) {
                this.unGraded.push(gradedAssignment);
                console.warn('Ungraded assignment, cause: a maxScore of 0', gradedAssignment, assignment.name);
                continue;
            }

            const score = numericGrade / assignment.maxScore;
            gradedAssignment.maxPoints    = assignment.points;
            gradedAssignment.maxScore     = assignment.maxScore;
            gradedAssignment.grade        = score;
            gradedAssignment.earnedPoints = score * assignment.points;

            gradedAssignments.push(gradedAssignment);
        }
        return gradedAssignments;
    }

    averageCategories(students, categories, gradedAssignments) {
        const studentCollection = [];
        for (const student of students) {
            const grades           = gradedAssignments.filter(g => g.userId === student.userId);
            const gradedCategories = categories.map(category => {
                const assignments  = grades.filter(g => g.categoryId === category.id);
                const earnedPoints = assignments.isEmpty() ? 0 : assignments.sum(a => a.exempt ? 0 : a.earnedPoints);
                const maxPoints    = assignments.isEmpty() ? 0 : assignments.sum(a => a.extraCredit || a.exempt ? 0 : a.maxPoints);                
                return {
                    userId: student.userId,
                    categoryId: category.id,
                    weight: category.weight,
                    earnedPoints: earnedPoints,
                    maxPoints: maxPoints,
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

        const earnedAverage = studentCategories.sum(cat => cat.average * cat.weight);
        const totalWeight   = studentCategories.sum(cat => cat.maxPoints === 0 ? 0 : cat.weight);
        const percent       = earnedAverage / totalWeight;

        const studentInfo = {
            ...student,
            percent: percent,
            percentage: percent * 100,
            earnedPoints: earnedAverage,
            maxWeight: totalWeight,
            categories: studentCategories,
        };
        if (totalWeight === 0) {
            console.warn(`Student ${student.name} (id: ${student.userId}) has no assignments`);
        }
        return studentInfo;
    }
}
