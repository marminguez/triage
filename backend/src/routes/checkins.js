const express = require('express');
const router = express.Router();
const store = require('../services/store');
const severityDetectionService = require('../services/severityDetectionService');
const riskService = require('../services/riskService');

// Helper to generate ID
const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * POST /api/case/:id/checkin
 * Submit a daily check-in for a case
 */
router.post('/:id/checkin', async (req, res) => {
    const caseId = req.params.id;
    const { freeText } = req.body;

    // Validate input
    if (!freeText || typeof freeText !== 'string' || freeText.trim().length === 0) {
        return res.status(400).json({ error: 'freeText is required and must be a non-empty string' });
    }

    // Check if case exists
    const existingCase = store.getById(caseId);
    if (!existingCase) {
        return res.status(404).json({ error: 'Case not found' });
    }

    // Detect severity
    const { severity, redFlags, actionSuggested } = severityDetectionService.detectSeverity(freeText);

    // Create check-in record
    const checkIn = {
        id: generateId(),
        caseId,
        createdAt: new Date().toISOString(),
        moodLevel: null, // Optional, for future UI
        freeText: freeText.trim(),
        redFlags,
        severity,
        actionSuggested
    };

    // Save check-in
    store.addCheckIn(checkIn);

    // Update case with check-in info
    const lastCheckInSummary = freeText.trim().substring(0, 100);
    const caseUpdates = {
        lastCheckInAt: checkIn.createdAt,
        lastSeverity: severity,
        lastCheckInSummary
    };

    // Merge updates into case data for recalculation
    const updatedCaseData = { ...existingCase, ...caseUpdates };

    // Recalculate vulnerability score with check-in boost
    const vulnerabilityAnalysis = await riskService.getRiskAssessment(updatedCaseData, existingCase.priority);

    // Apply all updates including new score/priority
    const finalUpdates = {
        ...caseUpdates,
        score: vulnerabilityAnalysis.score,
        priority: vulnerabilityAnalysis.priority,
        priority_reason_codes: vulnerabilityAnalysis.priority_reason_codes,
        priority_explanation: vulnerabilityAnalysis.priority_explanation,
        risk_factors: vulnerabilityAnalysis.risk_factors,
        previous_priority: existingCase.priority,
        updatedAt: new Date().toISOString()
    };

    const updatedCase = store.update(caseId, finalUpdates);

    // Return response
    res.status(201).json({
        checkIn: {
            id: checkIn.id,
            severity: checkIn.severity,
            redFlags: checkIn.redFlags,
            actionSuggested: checkIn.actionSuggested,
            createdAt: checkIn.createdAt
        },
        updatedCase: {
            id: updatedCase.id,
            score: updatedCase.score,
            priority: updatedCase.priority,
            lastCheckInAt: updatedCase.lastCheckInAt,
            lastSeverity: updatedCase.lastSeverity,
            lastCheckInSummary: updatedCase.lastCheckInSummary
        }
    });
});

/**
 * GET /api/case/:id/checkins
 * Get check-in history for a case
 */
router.get('/:id/checkins', (req, res) => {
    const caseId = req.params.id;

    // Check if case exists
    const existingCase = store.getById(caseId);
    if (!existingCase) {
        return res.status(404).json({ error: 'Case not found' });
    }

    // Get check-ins (last 10)
    const checkIns = store.getCheckInsByCase(caseId, 10);

    res.json({
        checkIns
    });
});

module.exports = router;
