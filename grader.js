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

            const gradedAssignment = {
                id: grade.id,
                categoryId: assignment.categoryId,
                assignmentId: assignment.id,
                userId: grade.userId,
                extraCredit: assignment.extraCredit,
                exempt: false,
                maxScore: assignment.maxScore,
                maxPoints: assignment.points,
                isGraded: true,
                earnedScore: NaN,
                grade: NaN,
                earnedPoints: NaN,
                percentage: NaN,
                letterGrade: undefined,
            };
    
            let numericGrade = parseInt(grade.grade);
            if (isNaN(numericGrade)) {
                const scoreCode = scoreCodes.find(scoreCode => scoreCode.code === grade.grade);
                if (scoreCode) {
                    numericGrade = scoreCode.percent / 100 * gradedAssignment.maxScore;
                    gradedAssignment.exempt = scoreCode.exempt;
                } else {
                    console.warn('Ungraded assignment, cause: scoreCode does not exist or grade is not a number', gradedAssignment, assignment.name);
                    gradedAssignment.isGraded = false;
                }
            }
    
            gradedAssignment.earnedScore  = numericGrade;
            gradedAssignment.grade        = gradedAssignment.earnedScore / gradedAssignment.maxScore;
    
            gradedAssignment.earnedPoints = gradedAssignment.grade * gradedAssignment.maxPoints;
            gradedAssignment.percentage = gradedAssignment.grade * 100;

            gradedAssignment.letterGrade = this.getLetterGrade(this.schema, gradedAssignment.percentage);
    
            if (assignment.maxScore === 0) {
                console.warn('Ungraded assignment, cause: a maxScore of 0', gradedAssignment, assignment.name);
                gradedAssignment.isGraded = false;
            }
    
            if (gradedAssignment.maxPoints < 0 && gradedAssignment.maxScore     < 0 &&
                gradedAssignment.grade     < 0 && gradedAssignment.earnedPoints < 0) {
                console.warn('Ungraded assignment, cause: negative value(s)', gradedAssignment, assignment.name);
                gradedAssignment.isGraded = false;
            }

            gradedAssignments.push(gradedAssignment);
        }
        return gradedAssignments;
    }

    averageStudents(students, categories, gradedAssignments) {
        const studentCollection = [];
        for (const student of students) {
            const grades           = gradedAssignments.filter(g => g.userId === student.userId);
            const gradedCategories = categories.map(category => {
                const assignments  = grades.filter(g => (g.categoryId === category.id) && g.isGraded);
                const earnedPoints = Util.sum(assignments, a => a.exempt ? 0 : a.earnedPoints);
                const maxPoints    = Util.sum(assignments, a => a.extraCredit || a.exempt ? 0 : a.maxPoints);
                const average = maxPoints !== 0 ? earnedPoints / maxPoints : 0;
                const percentage = average * 100;
                return {
                    ...category,
                    userId: student.userId,
                    earnedPoints: earnedPoints,
                    maxPoints: maxPoints,
                    average: average,
                    percentage: percentage,
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
        const earnedAverage = Util.sum(studentCategories, cat => cat.average * cat.weight);
        const totalWeight   = Util.sum(studentCategories, cat => cat.maxPoints === 0 ? 0 : cat.weight);
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
