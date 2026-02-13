/**
 * Severity Detection Service
 * Analyzes user's free-text input to detect severity level based on keywords
 */

const KEYWORDS = {
    critical: [
        'no puedo respirar', 'me he caído y no puedo levantarme', 'me desmayo',
        'sangrado', 'dolor fuerte en el pecho', 'suicidio', 'me quiero morir',
        'dolor de pecho', 'desmayo', 'no respiro', 'sangre', 'pecho'
    ],
    high: [
        'caí', 'me caí', 'mareo', 'confusión', 'no he comido', 'no he bebido',
        'no puedo caminar', 'estoy solo', 'me da miedo', 'he olvidado la medicación',
        'no tengo medicación', 'no tengo dinero', 'no tengo comida', 'caída', 'mareado',
        'confuso', 'olvide', 'olvidé'
    ],
    medium: [
        'triste', 'ansioso', 'me duele', 'me encuentro mal', 'no dormí', 'me siento solo',
        'me cuesta', 'dolor', 'ansiedad', 'preocupado', 'mal', 'cansado', 'débil'
    ],
    low: [
        'bien', 'mejor', 'ok', 'tranquilo', 'sin problemas', 'estoy bien',
        'me siento bien', 'normal', 'perfecto', 'genial'
    ]
};

const ESCALATION_KEYWORDS = ['estoy muy mal', 'urgente', 'emergencia', 'ayuda'];

const ACTION_SUGGESTIONS = {
    critical: '⚠️ EMERGENCIA: Contactar inmediatamente con servicios de emergencia (112)',
    high: 'Avisar a trabajador social en las próximas 2 horas',
    medium: 'Seguimiento en las próximas 24 horas',
    low: 'Continuar seguimiento rutinario'
};

/**
 * Detect severity level from free text
 * @param {string} freeText - User's input text
 * @returns {Object} - { severity, redFlags, actionSuggested }
 */
function detectSeverity(freeText) {
    if (!freeText || typeof freeText !== 'string') {
        return {
            severity: 'low',
            redFlags: [],
            actionSuggested: ACTION_SUGGESTIONS.low
        };
    }

    const lowerText = freeText.toLowerCase().trim();
    const redFlags = [];
    let severity = 'low';

    // Check for critical keywords
    for (const keyword of KEYWORDS.critical) {
        if (lowerText.includes(keyword)) {
            redFlags.push(keyword);
            severity = 'critical';
        }
    }

    // If not critical, check for high severity
    if (severity !== 'critical') {
        for (const keyword of KEYWORDS.high) {
            if (lowerText.includes(keyword)) {
                redFlags.push(keyword);
                severity = 'high';
            }
        }
    }

    // If not critical or high, check for medium
    if (severity !== 'critical' && severity !== 'high') {
        for (const keyword of KEYWORDS.medium) {
            if (lowerText.includes(keyword)) {
                redFlags.push(keyword);
                severity = 'medium';
            }
        }
    }

    // Check for low (positive) keywords
    if (severity === 'low') {
        for (const keyword of KEYWORDS.low) {
            if (lowerText.includes(keyword)) {
                redFlags.push(keyword);
                break; // Just mark that positive keywords were found
            }
        }
    }

    // Check for escalation keywords
    for (const keyword of ESCALATION_KEYWORDS) {
        if (lowerText.includes(keyword)) {
            // Escalate severity by one level
            if (severity === 'low') severity = 'medium';
            else if (severity === 'medium') severity = 'high';
            else if (severity === 'high') severity = 'critical';

            if (!redFlags.includes(keyword)) {
                redFlags.push(keyword);
            }
        }
    }

    // Special rule: Fall + Dizziness = CRITICAL
    const hasFall = lowerText.includes('caí') || lowerText.includes('me he caído') ||
        lowerText.includes('caída') || lowerText.includes('me caí');
    const hasDizziness = lowerText.includes('mareo') || lowerText.includes('mareado') ||
        lowerText.includes('mareada');
    const cantGetUp = lowerText.includes('no puedo levantarme');

    if ((hasFall && hasDizziness) || cantGetUp) {
        severity = 'critical';
        if (!redFlags.includes('fall')) redFlags.push('fall');
        if (hasDizziness && !redFlags.includes('mareo')) redFlags.push('mareo');
    } else if (hasFall) {
        // Mark fall incidents for special messaging
        if (!redFlags.includes('fall')) redFlags.push('fall');
    }

    return {
        severity,
        redFlags: [...new Set(redFlags)], // Remove duplicates
        actionSuggested: ACTION_SUGGESTIONS[severity]
    };
}

module.exports = {
    detectSeverity
};
