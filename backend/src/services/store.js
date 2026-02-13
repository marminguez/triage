// In-memory storage abstraction
// WARNING: Data is lost when the process restarts (e.g., serverless cold start)
let cases = [];
let checkIns = [];

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

// Check-in methods
const addCheckIn = (checkIn) => {
    checkIns.push(checkIn);
    return checkIn;
};

const getCheckInsByCase = (caseId, limit = 10) => {
    return checkIns
        .filter(c => c.caseId === caseId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
};

module.exports = {
    getAll,
    getById,
    add,
    update,
    addCheckIn,
    getCheckInsByCase
};
