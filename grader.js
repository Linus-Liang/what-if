const GradingSchemas = {
    letter: {
        name: '',
        ranges: [
            { letterGrade: 'A', minGrade: 90, maxGrade: 100, color: 'green'},
            { letterGrade: 'B', minGrade: 80, maxGrade: 89, color: 'blue'},
            { letterGrade: 'C', minGrade: 70, maxGrade: 79, color: 'yellow'},
            { letterGrade: 'F', minGrade:  0, maxGrade: 69, color: 'red'}
        ]
    }
};

class GradingService {
    constructor(schema) {
        this.schema = schema; // used when calculating the letter grade
    }

    getLetterGrade(schema, number) {
        const ranges = schema.ranges;
        for (const range of ranges) {
            if (number >= range.minGrade) {
                return range;
            }
        }
    }

    gradeAssignment(assignment, grade, scoreCodes) {
        // gradeAssignments takes in 2 arrays and returns an array; structuring into array then destructuring
        const [graded] = this.gradeAssignments([assignment], [grade], scoreCodes);
        return graded;
    }

    //
    gradeAssignments(assignments, grades, scoreCodes) {
        const gradedAssignments = [];
        for (const grade of grades) {
            const assignment = assignments.find(item => item.id === grade.assignmentId);

            const [numericGrade, exempt]= (() => {
                const possibleNumericGrade = parseInt(grade.grade);
                if (isNaN(possibleNumericGrade)) {
                    const scoreCode = scoreCodes.find(scoreCode => scoreCode.code === grade.grade);
                    if (scoreCode && !scoreCode.exempt) {
                        return [scoreCode.percent / 100 * assignment.maxScore, false];
                    } else {
                        console.warn('Ungraded assignment, cause: scoreCode does not exist or grade is not a number');
                        return [NaN, true]
                    }
                } else {
                    return [possibleNumericGrade, false];
                }
            })();

            const gradedAssignment = {
                id: grade.id,
                categoryId: assignment.categoryId,
                assignmentId: assignment.id,
                userId: grade.userId,
                extraCredit: assignment.extraCredit,
                exempt: exempt,
                maxScore: assignment.maxScore,
                maxPoints: assignment.points,
                earnedScore: numericGrade,
                grade: null,
                earnedPoints: undefined,
                percentage: NaN,
                letterGrade: undefined,
            };
    
            if (!gradedAssignment.exempt) {
                gradedAssignment.grade        = gradedAssignment.earnedScore / gradedAssignment.maxScore;
                gradedAssignment.earnedPoints = gradedAssignment.grade * gradedAssignment.maxPoints;
                gradedAssignment.percentage   = gradedAssignment.grade * 100;
                gradedAssignment.letterGrade  = this.getLetterGrade(this.schema, gradedAssignment.percentage);
            }

            if (gradedAssignment.maxScore <= 0 && gradedAssignment.grade < 0) {
                gradsedAssignment.exempt = true;
            }

            gradedAssignments.push(gradedAssignment);
        }
        return gradedAssignments;
    }

    averageStudents(students, categories, gradedAssignments) {
        const studentCollection = [];
        for (const student of students) {
            const grades = gradedAssignments.filter(g => g.userId === student.userId);
            const gradedCategories = categories.map(category => {
                const assignments = grades.filter(g => g.categoryId === category.id).reduce( (a, b => a + b));
                const earnedPoints = Util.sum(assignments, a => a.exempt ? 0 : a.earnedPoints);
                const maxPoints = Util.sum(assignments, a => (a.extraCredit || a.exempt) ? 0 : a.maxPoints);
                const average = earnedPoints / maxPoints;
                const percentage = average * 100;
                return {
                    ...category,
                    userId: student.userId,
                    earnedPoints: earnedPoints,
                    maxPoints: maxPoints,
                    average: average,
                    percentage: percentage,
                    earnedAverage: average * category.weight,
                    letterGrade: this.getLetterGrade(this.schema, percentage),
                };
            });
            studentCollection.push({
                userId: student.userId,
                categories: gradedCategories,
            });
        }
        return studentCollection;
    }

    calculateStudentData(student, studentCategories) {
        const earnedAverage = Util.sum(studentCategories, c => isNaN(c.earnedAverage) ? 0 : c.earnedAverage);
        const totalWeight   = Util.sum(studentCategories, c => c.maxPoints === 0      ? 0 : c.weight);
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
            console.warn(`Student ${student.name} (id: ${student.userId}) has no gradable assignments`);
        }
        return studentInfo;
    }
}
