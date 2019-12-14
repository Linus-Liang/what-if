const view = new ViewModel();

function applyData(data) {
    let selection = 0;
    const selectedData = data.result[selection];

    const student = selectedData.students[0];
    view.init(
        { userId: student.id }, 
        selectedData.categories.map(c => {
            return { id: c.id, weight: c.weight, name: c.name }
        }),
        selectedData.items.map(i => {
            return {
                id: i.id,
                categoryId: i.categoryId,
                maxScore: i.maxScore,
                extraCredit: i.isExtraCredit,
                points: i.points,
                name: i.name
            }
        }),
        student.gradedEntries.map(g => {
            return {
                id: 0,
                assignmentId: g.itemId,
                userId: g.userId,
                grade: g.rawScore
            }
        }),
        selectedData.scoreCodes
    );

    ko.applyBindings(view, document.querySelector('#tables'));
}

async function loadServerData(url) {
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

loadServerData('data.json').then(applyData);
