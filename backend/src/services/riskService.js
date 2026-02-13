const axios = require('axios');

// Environment variables or defaults
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001/ml_score';

/**
 * Calculates risk based on static rules (Fallback logic)
 */
const calculateRiskRuleBased = (caseData, previousPriority = null) => {
    let score = 0;
    let reasons = [];
    let reasonCodes = [];

    const {
        unanswered_messages_hours = 0,
        last_contact_at,
        incidents_last_7d = 0,
        incidents_severity_max_7d, // 'leve', 'moderada', 'grave'
        routine_breaks_last_7d = 0,
        lives_alone = false,
        mobility_limitations = false,
        cognitive_difficulty_flag = false
    } = caseData;

    // A) Falta de respuesta / contacto
    if (unanswered_messages_hours >= 48) {
        score += 20;
        reasons.push({ code: "NO_RESPONSE_48H", score: 20, desc: "Sin respuesta > 48h" });
        reasonCodes.push("NO_RESPONSE_48H");
    } else if (unanswered_messages_hours >= 24) {
        score += 12;
        reasons.push({ code: "NO_RESPONSE_24H", score: 12, desc: "Sin respuesta > 24h" });
        reasonCodes.push("NO_RESPONSE_24H");
    } else if (unanswered_messages_hours >= 12) {
        score += 6;
        reasons.push({ code: "NO_RESPONSE_12H", score: 6, desc: "Sin respuesta > 12h" });
        reasonCodes.push("NO_RESPONSE_12H");
    }

    if (last_contact_at && (new Date() - new Date(last_contact_at) > 7 * 24 * 60 * 60 * 1000)) {
        score += 10;
        reasons.push({ code: "NO_CONTACT_7D", score: 10, desc: "Sin contacto > 7 días" });
        reasonCodes.push("NO_CONTACT_7D");
    }

    // B) Incidencias recientes (volumen + gravedad)
    if (incidents_last_7d >= 3) {
        score += 18;
        reasons.push({ code: "INCIDENTS_MANY", score: 18, desc: "Múltiples incidencias recientes" });
        reasonCodes.push("INCIDENTS_MANY");
    } else if (incidents_last_7d === 2) {
        score += 12;
        reasons.push({ code: "INCIDENTS_TWO", score: 12, desc: "2 incidencias recientes" });
        reasonCodes.push("INCIDENTS_TWO");
    } else if (incidents_last_7d === 1) {
        score += 6;
        reasons.push({ code: "INCIDENTS_ONE", score: 6, desc: "1 incidencia reciente" });
        reasonCodes.push("INCIDENTS_ONE");
    }

    // Sumamos severidad maxima
    if (incidents_severity_max_7d === 'grave') {
        score += 22;
        reasons.push({ code: "INCIDENT_SEVERE", score: 22, desc: "Incidencia grave reciente" });
        reasonCodes.push("INCIDENT_SEVERE");
    } else if (incidents_severity_max_7d === 'moderada') {
        score += 12;
        reasons.push({ code: "INCIDENT_MODERATE", score: 12, desc: "Incidencia moderada reciente" });
        reasonCodes.push("INCIDENT_MODERATE");
    } else if (incidents_severity_max_7d === 'leve') {
        score += 6;
        reasons.push({ code: "INCIDENT_MILD", score: 6, desc: "Incidencia leve reciente" });
        reasonCodes.push("INCIDENT_MILD");
    }

    // C) Ruptura de rutina
    if (routine_breaks_last_7d >= 3) {
        score += 15;
        reasons.push({ code: "ROUTINE_BREAK_MANY", score: 15, desc: "Múltiples rupturas de rutina" });
        reasonCodes.push("ROUTINE_BREAK_MANY");
    } else if (routine_breaks_last_7d === 2) {
        score += 10;
        reasons.push({ code: "ROUTINE_BREAK_TWO", score: 10, desc: "2 rupturas de rutina" });
        reasonCodes.push("ROUTINE_BREAK_TWO");
    } else if (routine_breaks_last_7d === 1) {
        score += 5;
        reasons.push({ code: "ROUTINE_BREAK_ONE", score: 5, desc: "1 ruptura de rutina" });
        reasonCodes.push("ROUTINE_BREAK_ONE");
    }

    // D) Factores de vulnerabilidad social/funcional
    if (lives_alone) {
        score += 8;
        reasons.push({ code: "LIVES_ALONE", score: 8, desc: "Vive solo" });
        reasonCodes.push("LIVES_ALONE");
    }
    if (mobility_limitations) {
        score += 6;
        reasons.push({ code: "MOBILITY_LIMIT", score: 6, desc: "Movilidad reducida" });
        reasonCodes.push("MOBILITY_LIMIT");
    }
    if (cognitive_difficulty_flag) {
        score += 6;
        reasons.push({ code: "COGNITIVE_DIFF", score: 6, desc: "Dificultad cognitiva" });
        reasonCodes.push("COGNITIVE_DIFF");
    }

    // E) Tendencia (comparativa simplificada)
    let currentPriority = 'BAJA';
    if (score >= 60) currentPriority = 'ALTA';
    else if (score >= 30) currentPriority = 'MEDIA';

    if (previousPriority === 'MEDIA' && currentPriority === 'ALTA') {
        score += 5;
        reasons.push({ code: "TREND_WORSENING", score: 5, desc: "Empeoramiento de prioridad" });
        reasonCodes.push("TREND_WORSENING");
    }

    // Limits
    score = Math.min(100, Math.max(0, score));

    // Final Priority Calculation
    let priority = 'BAJA';
    if (score >= 60) priority = 'ALTA';
    else if (score >= 30) priority = 'MEDIA';

    // Generate Explanation
    reasons.sort((a, b) => b.score - a.score);
    const topReasons = reasons.slice(0, 3);
    const explanationText = `[Reglas] Prioridad ${priority}: ` + (topReasons.length > 0 ? topReasons.map(r => r.desc).join(", ") : "Sin factores de riesgo detectados");

    return {
        score,
        priority,
        priority_reason_codes: reasonCodes,
        priority_explanation: explanationText
    };
};

/**
 * Main risk assessment function. Tries ML first, falls back to rules.
 */
/**
 * Calculate Vulnerability Score based on specific weighted formula:
 * Score = (Aislamiento * 0.3 + Incidencias * 0.3 + Funcional * 0.2 + Adherencia * 0.2) * 25
 * All factors are 0-3.
 */
const calculateVulnerabilityScore = (caseData) => {
    // 1. Aislamiento Social (0-3)
    // Map from existing fields or simulate
    let aislamiento = 0;
    if (caseData.lives_alone) aislamiento += 2;
    if (caseData.unanswered_messages_hours > 24) aislamiento += 1;
    aislamiento = Math.min(3, aislamiento);

    // 2. Incidencias Recientes (0-3)
    let incidencias = 0;
    if (caseData.incidents_last_7d >= 3) incidencias = 3;
    else if (caseData.incidents_last_7d === 2) incidencias = 2;
    else if (caseData.incidents_last_7d === 1) incidencias = 1;

    // Boost if severe
    if (caseData.incidents_severity_max_7d === 'grave' && incidencias < 3) incidencias += 1;
    incidencias = Math.min(3, incidencias);

    // 3. Dificultad Funcional (0-3)
    let funcional = 0;
    if (caseData.mobility_limitations) funcional += 1;
    if (caseData.cognitive_difficulty_flag) funcional += 2;
    funcional = Math.min(3, funcional);

    // 4. Falta de Adherencia (0-3)
    // New field, if not present we simulate or map from routine breaks
    let adherencia = 0;
    if (caseData.adherence_level !== undefined) {
        // Inverse mapping if stored as "adherence level" (high adherence = low risk)
        // Assuming input might be 0-3 risk directly or we map logic.
        // Let's assume input 'adherence_risk' 0-3 exists, or map from routine breaks
        adherencia = caseData.adherence_risk || 0;
    } else {
        // Map from routine breaks as proxy for adherence/behavioral issues
        if (caseData.routine_breaks_last_7d >= 3) adherencia = 3;
        else if (caseData.routine_breaks_last_7d >= 1) adherencia = 1;
    }
    adherencia = Math.min(3, adherencia);

    // FORMULA
    const rawScore = (aislamiento * 0.3 + incidencias * 0.3 + funcional * 0.2 + adherencia * 0.2) * 25;
    const score = Math.round(rawScore);

    // Detección de factores clave para explicabilidad
    const factors = [];
    if (aislamiento >= 2) factors.push("Aislamiento elevado");
    if (incidencias >= 2) factors.push("Incidencias recientes");
    if (funcional >= 2) factors.push("Dificultad funcional significativa");
    if (adherencia >= 2) factors.push("Falta de adherencia");

    let priority = 'BAJA';
    if (score >= 70) priority = 'ALTA';
    else if (score >= 40) priority = 'MEDIA';

    // Texto automático explicativo
    let explanationText = `Prioridad ${priority.toLowerCase()}`;
    if (factors.length > 0) {
        explanationText += ` debido a ${factors.join(" e ").toLowerCase()}`;
    } else {
        explanationText += " - Sin factores de riesgo críticos detectados";
    }

    return {
        score,
        priority, // ALTA, MEDIA, BAJA (mapped from Red, Yellow, Green)
        factors: {
            aislamiento,
            incidencias,
            funcional,
            adherencia
        },
        priority_explanation: explanationText,
        priority_reason_codes: factors // Mapping for UI compatibility
    };
};

/**
 * Main risk assessment function. 
 * Replaces ML for now to strictly follow the requested formula logic.
 */
const getRiskAssessment = async (caseData, previousPriority) => {
    // We prioritize the deterministic rule-based model as requested by the user
    // to ensure the specific Vulnerability Score formula is used.

    // Check if we already have the raw factors in input (from an edit) or need to calc them
    // For now, calculateVulnerabilityScore handles the mapping from raw data to 0-3 factors.

    const assessment = calculateVulnerabilityScore(caseData);

    return {
        score: assessment.score,
        priority: assessment.priority,
        priority_reason_codes: assessment.priority_reason_codes,
        priority_explanation: assessment.priority_explanation,
        // Return detailed factors for the UI if needed
        risk_factors: assessment.factors
    };
};

module.exports = {
    getRiskAssessment
};
