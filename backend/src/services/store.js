// In-memory storage abstraction
// WARNING: Data is lost when the process restarts (e.g., serverless cold start)
let cases = [];

const getAll = () => cases;

const getById = (id) => cases.find(c => c.id === id);

const add = (caseItem) => {
    cases.push(caseItem);
    return caseItem;
};

const update = (id, updates) => {
    const index = cases.findIndex(c => c.id === id);
    if (index === -1) return null;

    cases[index] = { ...cases[index], ...updates };
    return cases[index];
};

module.exports = {
    getAll,
    getById,
    add,
    update
};
