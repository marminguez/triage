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
const getRiskAssessment = async (caseData, previousPriority) => {
    try {
        console.log("Calling ML Service with:", JSON.stringify(caseData));
        // Use a short timeout to fail fast if ML is down
        const response = await axios.post(ML_SERVICE_URL, caseData, { timeout: 3000 });

        const mlResult = response.data;
        console.log("ML Service Response:", mlResult);

        const score = Math.round(mlResult.risk_score * 100);
        const priority = mlResult.risk_level;
        const explanationText = `[IA] Prioridad ${priority}: Riesgo detectado del ${score}%. Factores: ` + (mlResult.top_contributors.join(", ") || "Ninguno");

        return {
            score: score,
            priority: priority,
            priority_reason_codes: mlResult.top_contributors && mlResult.top_contributors.length > 0 ? mlResult.top_contributors : [],
            priority_explanation: explanationText
        };

    } catch (error) {
        console.warn("ML Service unavailable or error (falling back to rules):", error.message);
        return calculateRiskRuleBased(caseData, previousPriority);
    }
};

module.exports = {
    getRiskAssessment
};
