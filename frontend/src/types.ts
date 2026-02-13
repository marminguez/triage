export interface Case {
    id: string;
    fullName: string;
    age: number;
    status: 'new' | 'under_review' | 'in_progress' | 'resolved';

    // Legacy / Compat fields
    socialIsolation: number;
    incidentFrequency: number;
    functionalDifficulties: number;

    // New Metrics (Scoring Inputs)
    last_contact_at: string;
    unanswered_messages_hours: number;
    incidents_last_7d: number;
    incidents_severity_max_7d?: 'leve' | 'moderada' | 'grave' | null;
    routine_breaks_last_7d: number;
    lives_alone: boolean;
    mobility_limitations: boolean;
    cognitive_difficulty_flag: boolean;
    risk_notes?: string;
    whatsapp_chatbot_enabled?: boolean;

    // Scoring Outputs
    score: number;
    priority: 'ALTA' | 'MEDIA' | 'BAJA';
    priority_reason_codes: string[];
    priority_explanation: string;
    risk_factors?: {
        aislamiento: number;
        incidencias: number;
        funcional: number;
        adherencia: number;
    };
    previous_priority?: 'ALTA' | 'MEDIA' | 'BAJA' | null;

    agreed_guidelines?: string;
    next_appointment?: string;

    // Check-in fields
    lastCheckInAt?: string;
    lastSeverity?: 'low' | 'medium' | 'high' | 'critical';
    lastCheckInSummary?: string;
    manualPriorityOverride?: boolean;

    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface DailyCheckIn {
    id: string;
    caseId: string;
    createdAt: string;
    moodLevel?: number;
    freeText: string;
    redFlags: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    actionSuggested: string;
}

export type CaseInput = Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'score' | 'priority' | 'priority_reason_codes' | 'priority_explanation' | 'previous_priority'> & {
    status?: string;
};
