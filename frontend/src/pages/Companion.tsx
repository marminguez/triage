import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Case } from '../types';
import { Send } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function Companion() {
    const [searchParams] = useSearchParams();
    const caseId = searchParams.get('caseId');

    const [caseData, setCaseData] = useState<Case | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [showQuickActions, setShowQuickActions] = useState(true);

    useEffect(() => {
        if (!caseId) {
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const data = await api.getCase(caseId);
                setCaseData(data);

                // Initial greeting message
                const greeting: Message = {
                    id: Date.now().toString(),
                    text: `Hola ${data.fullName}. Soy TRIAGE Companion. Estoy aquí para recordarte tus pautas y ayudarte con cualquier duda.`,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages([greeting]);
            } catch (err) {
                console.error('Error loading case:', err);
                const errorMsg: Message = {
                    id: Date.now().toString(),
                    text: 'Lo siento, no pude cargar tu información. Por favor, intenta de nuevo más tarde.',
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages([errorMsg]);
            } finally {
                setLoading(false);
            }
        })();
    }, [caseId]);

    const addMessage = (text: string, sender: 'user' | 'bot') => {
        const newMessage: Message = {
            id: Date.now().toString() + Math.random(),
            text,
            sender,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const generateBotResponse = (userMessage: string): string => {
        const lowerMsg = userMessage.toLowerCase();

        // Intent: Medicación
        if (lowerMsg.includes('medicación') || lowerMsg.includes('medicacion') || lowerMsg.includes('medicina')) {
            if (caseData?.agreed_guidelines) {
                return `📋 Tus pautas acordadas son:\n\n${caseData.agreed_guidelines}`;
            }
            return 'No tengo información sobre tus pautas de medicación. Por favor, consulta con tu profesional sanitario.';
        }

        // Intent: Cita
        if (lowerMsg.includes('cita')) {
            if (caseData?.next_appointment) {
                return `📅 Tu próxima cita es:\n\n${caseData.next_appointment}`;
            }
            return 'No tengo información sobre tu próxima cita. Por favor, contacta con tu centro de salud.';
        }

        // Intent: Explícame
        if (lowerMsg.includes('explícame') || lowerMsg.includes('explicame') || lowerMsg.includes('explica')) {
            if (caseData?.agreed_guidelines) {
                const steps = caseData.agreed_guidelines.split(/[.\n]/).filter(s => s.trim()).slice(0, 3);
                return `✨ Aquí tienes un resumen en 3 pasos simples:\n\n1️⃣ ${steps[0] || 'Sigue las indicaciones de tu médico'}\n\n2️⃣ ${steps[1] || 'Toma tu medicación a la hora indicada'}\n\n3️⃣ ${steps[2] || 'Contacta si tienes dudas'}`;
            }
            return '✨ Recuerda:\n\n1️⃣ Sigue las indicaciones de tu médico\n\n2️⃣ Toma tu medicación a la hora indicada\n\n3️⃣ Contacta si tienes dudas';
        }

        // Intent: Recuérdame
        if (lowerMsg.includes('recuérdame') || lowerMsg.includes('recuerdame') || lowerMsg.includes('recordar')) {
            return '✅ De acuerdo. Te lo recordaré.';
        }

        // Default response
        return 'Entiendo. ¿En qué más puedo ayudarte? Puedes preguntarme sobre tu medicación, citas o pedirme que te explique tus pautas.';
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        // Add user message
        addMessage(inputValue, 'user');
        setShowQuickActions(false);

        // Generate and add bot response
        setTimeout(() => {
            const response = generateBotResponse(inputValue);
            addMessage(response, 'bot');
        }, 500);

        setInputValue('');
    };

    const handleQuickAction = (action: string) => {
        setInputValue(action);
        handleSendMessage();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#e5ddd5]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#25d366] mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!caseId) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#e5ddd5]">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                    <p className="text-gray-800 text-lg">⚠️ No se proporcionó un ID de caso</p>
                    <p className="text-gray-600 mt-2">Por favor, accede desde un enlace válido.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#e5ddd5]">
            {/* Header */}
            <div className="bg-[#075e54] text-white px-4 py-3 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center text-white font-bold text-lg">
                        {caseData?.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="font-semibold text-lg">TRIAGE Companion</h1>
                        <p className="text-xs text-[#d9fdd3]">Asistente de acompañamiento</p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm ${message.sender === 'user'
                                    ? 'bg-[#dcf8c6] text-gray-800'
                                    : 'bg-white text-gray-800'
                                }`}
                        >
                            <p className="text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
                            <p className="text-xs text-gray-500 mt-1 text-right">
                                {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Quick Action Buttons */}
                {showQuickActions && messages.length === 1 && (
                    <div className="flex flex-col gap-2 mt-4">
                        <button
                            onClick={() => handleQuickAction('¿Qué tengo que hacer hoy?')}
                            className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left font-medium"
                        >
                            ¿Qué tengo que hacer hoy?
                        </button>
                        <button
                            onClick={() => handleQuickAction('Recuérdame la medicación')}
                            className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left font-medium"
                        >
                            Recuérdame la medicación
                        </button>
                        <button
                            onClick={() => handleQuickAction('¿Cuándo es mi cita?')}
                            className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left font-medium"
                        >
                            ¿Cuándo es mi cita?
                        </button>
                    </div>
                )}
            </div>

            {/* Disclaimer */}
            <div className="bg-[#fff3cd] border-t border-[#ffc107] px-4 py-2 text-center">
                <p className="text-xs text-[#856404]">
                    ⚠️ TRIAGE Companion no sustituye a un profesional sanitario.
                </p>
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f0f0] px-4 py-3 border-t border-gray-300">
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 outline-none text-base bg-transparent"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="text-[#25d366] disabled:text-gray-300 hover:text-[#128c7e] transition-colors"
                    >
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
