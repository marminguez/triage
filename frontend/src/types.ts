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
    previous_priority?: 'ALTA' | 'MEDIA' | 'BAJA' | null;

    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

export type CaseInput = Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'score' | 'priority' | 'priority_reason_codes' | 'priority_explanation' | 'previous_priority'> & {
    status?: string;
};
