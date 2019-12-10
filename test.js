const testData = {
  students: [{ userId: 100, name: "Sunil Cram" }, 
  // { userId: 101, name: "Compter Comp" }
],
  categories: [
    { weight: 20, id: 0, name: "Homework" },
    { weight: 50, id: 1, name: "Quiz" },
    { weight: 30, id: 2, name: "Classwork" },
  ],
  assignments: [
    { id: 0, categoryId: 0, maxScore: 100, extraCredit: false, points: 5,   name: "Homework #1" },
    { id: 1, categoryId: 0, maxScore: 100, extraCredit: false, points: 5,   name: "Homework #2" },
    { id: 2, categoryId: 1, maxScore: 100, extraCredit: false, points: 200, name: "Quiz Lesson 1" },
    { id: 3, categoryId: 1, maxScore: 100, extraCredit: false, points: 200, name: "Quiz Lesson 3" },
    { id: 4, categoryId: 2, maxScore: 5,   extraCredit: false, points: 1,   name: "Warm up Day 0x00" },
    { id: 5, categoryId: 2, maxScore: 5,   extraCredit: false, points: 1,   name: "Warm up Day 0x01" },
    { id: 6, categoryId: 2, maxScore: 5,   extraCredit: false, points: 1,   name: "Warm up Day 0x02" },
    { id: 7, categoryId: 2, maxScore: 5,   extraCredit: true,  points: 1,   name: "Warm up Day 0x03" },
  ],
  grades: [
    { id: 0, assignmentId: 0, userId: 100, grade: "100" },
    { id: 1, assignmentId: 1, userId: 100, grade: "100" },
    { id: 2, assignmentId: 2, userId: 100, grade: "100" },
    { id: 3, assignmentId: 3, userId: 100, grade: "100" },
    { id: 4, assignmentId: 4, userId: 100, grade: "5" },
    { id: 4, assignmentId: 5, userId: 100, grade: "5" },
    { id: 4, assignmentId: 6, userId: 101, grade: "5" },
    { id: 6, assignmentId: 7, userId: 101, grade: "5" },
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
