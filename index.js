class Student {
  constructor(data) {
    this.userId = data.userId;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }
}

class Section {
  constructor(data) {
    this.isWeighted = data.isWeighted;
    this.title = data.title;
    this.teacherId = data.teacherId;
    this.students = data.students;
    this.categories = data.categories;
    this.grades = data.grades;
    this.assignments = data.assignments;
    this.scoreCodes = data.scoreCodes;
    this.terms = data.terms;
  }
}

class Category {
  constructor(data) {
    this.name = data.name;
    this.weight = data.weight;
    this.dateCreated = data.dateCreated;
    this.dateModifed = data.dateModifed;
    this.id = data.id;
  }
}

class Assignment {
  constructor(data) {
    this.id = data.id;
    this.categoryId = data.categoryId;
    this.maxScore = data.maxScore;
    this.points = data.points;
    this.name = data.name;
    this.dateCreated = data.dateCreated;
    this.dateModified = data.dateModified;
    this.dueDate = data.dueDate;
    this.isExtraCredit = data.isExtraCredit;
    this.description = data.description;
    this.standards = data.standards;
  }
}

class Grade {
  constructor(data) {
    this.id = data.id;
    this.assignmentId = data.assignmentId;
    this.userId = data.userId;
    this.grade = data.grade;
    this.feedback = data.feedback;
  }
}

class ScoreCode {
  constructor(data) {
    this.id = data.id;
    this.shortcut = data.shortcut;
    this.code = data.code;
    this.description = data.description;
    this.percent = data.percent;
    this.exempt = data.exempt;
    this.sectionId = data.sectionId;
  }
}
