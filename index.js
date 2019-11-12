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

  average(assignments) {
    console.log(assignments.filter((assignment) => assignment.categoryId = this.id));
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

let gradeData = new XMLHttpRequest();
gradeData.open('GET', 'gradebook-160.json');
gradeData.send();
gradeData.onreadystatechange = () => {
  if (gradeData.readyState === XMLHttpRequest.DONE && gradeData.status === 200) {
    gradeData = JSON.parse(gradeData.response);
    let currentSection = new Section(gradeData);
    const Categories = gradeData.categories.map((category) => new Category(category));
    const Assignments = gradeData.assignments.map((assignment) => new Assignment(assignment));
    console.log(Categories, Assignments);
    console.log(Categories[0].average(Assignments));
    
  }
}
