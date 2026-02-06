const express = require('express');
const router = express.Router();
const store = require('../services/store');
const riskService = require('../services/riskService');

// Helper to generate ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// GET /cases - List all cases
router.get('/', (req, res) => {
    res.json(store.getAll());
});

// GET /cases/:id - Get single case
router.get('/:id', (req, res) => {
    const caseItem = store.getById(req.params.id);
    if (!caseItem) return res.status(404).json({ error: 'Case not found' });
    res.json(caseItem);
});

// POST /cases - Create new case
router.post('/', async (req, res) => {
    // Basic validation
    if (!req.body.fullName || req.body.age === undefined || req.body.age === null) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const inputData = { ...req.body };

    // Calculate Score & Priority (Async via Service)
    const vulnerabilityAnalysis = await riskService.getRiskAssessment(inputData, null);

    const newCase = {
        id: generateId(),
        fullName: inputData.fullName,
        age: parseInt(inputData.age),
        status: inputData.status || 'new',

        // New Metric Fields
        last_contact_at: inputData.last_contact_at || new Date().toISOString(),
        unanswered_messages_hours: parseInt(inputData.unanswered_messages_hours) || 0,
        incidents_last_7d: parseInt(inputData.incidents_last_7d) || 0,
        incidents_severity_max_7d: inputData.incidents_severity_max_7d || null,
        routine_breaks_last_7d: parseInt(inputData.routine_breaks_last_7d) || 0,
        lives_alone: !!inputData.lives_alone,
        mobility_limitations: !!inputData.mobility_limitations,
        cognitive_difficulty_flag: !!inputData.cognitive_difficulty_flag,
        whatsapp_chatbot_enabled: !!inputData.whatsapp_chatbot_enabled,
        risk_notes: inputData.risk_notes || '',

        // Legacy Fields (kept for compatibility if needed, or mapped)
        socialIsolation: inputData.lives_alone ? 1 : 0, // approximate mapping
        incidentFrequency: parseInt(inputData.incidents_last_7d) || 0,
        functionalDifficulties: (inputData.mobility_limitations || inputData.cognitive_difficulty_flag) ? 1 : 0,

        notes: inputData.notes || '',

        // Computed Fields
        score: vulnerabilityAnalysis.score,
        priority: vulnerabilityAnalysis.priority,
        priority_reason_codes: vulnerabilityAnalysis.priority_reason_codes,
        priority_explanation: vulnerabilityAnalysis.priority_explanation,
        previous_priority: null, // Initial creation has no previous priority

        createdAt: new Date().toISOString()
    };

    const savedCase = store.add(newCase);
    res.status(201).json(savedCase);
});

// PUT /cases/:id - Update case
router.put('/:id', async (req, res) => {
    const existingCase = store.getById(req.params.id);
    if (!existingCase) return res.status(404).json({ error: 'Case not found' });

    const inputData = { ...existingCase, ...req.body }; // Merge existing with updates

    // Recalculate Score & Priority with previous priority context
    const vulnerabilityAnalysis = await riskService.getRiskAssessment(inputData, existingCase.priority);

    // Prepare updates
    const updates = {
        ...req.body,
        // Ensure numeric/boolean types for new fields if they are being updated
        unanswered_messages_hours: inputData.unanswered_messages_hours !== undefined ? parseInt(inputData.unanswered_messages_hours) : existingCase.unanswered_messages_hours,
        incidents_last_7d: inputData.incidents_last_7d !== undefined ? parseInt(inputData.incidents_last_7d) : existingCase.incidents_last_7d,
        routine_breaks_last_7d: inputData.routine_breaks_last_7d !== undefined ? parseInt(inputData.routine_breaks_last_7d) : existingCase.routine_breaks_last_7d,
        lives_alone: inputData.lives_alone !== undefined ? !!inputData.lives_alone : existingCase.lives_alone,
        mobility_limitations: inputData.mobility_limitations !== undefined ? !!inputData.mobility_limitations : existingCase.mobility_limitations,
        cognitive_difficulty_flag: inputData.cognitive_difficulty_flag !== undefined ? !!inputData.cognitive_difficulty_flag : existingCase.cognitive_difficulty_flag,
        whatsapp_chatbot_enabled: inputData.whatsapp_chatbot_enabled !== undefined ? !!inputData.whatsapp_chatbot_enabled : existingCase.whatsapp_chatbot_enabled,

        // Update Calculated Fields
        score: vulnerabilityAnalysis.score,
        priority: vulnerabilityAnalysis.priority,
        priority_reason_codes: vulnerabilityAnalysis.priority_reason_codes,
        priority_explanation: vulnerabilityAnalysis.priority_explanation,
        previous_priority: existingCase.priority, // Store what it was before this update

        updatedAt: new Date().toISOString()
    };

    const updatedCase = store.update(req.params.id, updates);
    res.json(updatedCase);
});

module.exports = router;

