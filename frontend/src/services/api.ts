import type { Case, CaseInput } from '../types';

// Use environment variable or default to relative path (handled by proxy/rewrites)
const API_URL = import.meta.env.VITE_API_URL || '/api/cases';

export const api = {
    getCases: async (): Promise<Case[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch cases');
        return res.json();
    },

    getCase: async (id: string): Promise<Case> => {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Case not found');
        return res.json();
    },

    createCase: async (data: CaseInput): Promise<Case> => {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({}));
            throw new Error(errorBody.error || 'Failed to create case');
        }
        return res.json();
    },

    updateCase: async (id: string, data: Partial<Case>): Promise<Case> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update case');
        return res.json();
    }
};
