import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Case } from '../types';
import { Send, AlertTriangle } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isEmergency?: boolean;
    showEmojiButtons?: boolean;
}

export default function Companion() {
    const [searchParams] = useSearchParams();
    const caseId = searchParams.get('caseId');

    const [caseData, setCaseData] = useState<Case | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [hasCompletedDailyCheckIn, setHasCompletedDailyCheckIn] = useState(false);
    const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

                // Daily check-in prompt
                const checkInPrompt: Message = {
                    id: (Date.now() + 1).toString(),
                    text: 'Antes de nada: ¿cómo te encuentras hoy?',
                    sender: 'bot',
                    timestamp: new Date(),
                    showEmojiButtons: true
                };

                setMessages([greeting, checkInPrompt]);
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

    const addMessage = (text: string, sender: 'user' | 'bot', isEmergency = false, showEmojiButtons = false) => {
        const newMessage: Message = {
            id: Date.now().toString() + Math.random(),
            text,
            sender,
            timestamp: new Date(),
            isEmergency,
            showEmojiButtons
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleEmojiCheckIn = async (emoji: string, statusText: string) => {
        if (!caseId) return;

        // Add user message
        addMessage(`${emoji} ${statusText}`, 'user');
        setHasCompletedDailyCheckIn(true);
        setShowQuickActions(false);

        await handleCheckIn(`Hoy estoy ${statusText.toLowerCase()}`);
    };

    const handleCheckIn = async (statusText: string) => {
        if (!caseId || !statusText.trim()) return;

        setSubmittingCheckIn(true);

        try {
            const response = await api.submitCheckIn(caseId, statusText);
            const { checkIn, updatedCase } = response;

            // Check if this is a fall-related incident
            const hasFall = checkIn.redFlags?.includes('fall');

            // Generate bot response based on severity
            let botResponses: string[] = [];

            switch (checkIn.severity) {
                case 'critical':
                    // Two separate messages for CRITICAL
                    botResponses.push('Si necesitas ayuda inmediata, llama al 112 ahora mismo.');
                    botResponses.push('He registrado esto como URGENTE y he enviado un aviso a tu asistente social.');

                    // Add fall-specific warning if applicable
                    if (hasFall) {
                        botResponses.push('Si estás en el suelo o te has golpeado, no intentes levantarte rápido. Busca apoyo y pide ayuda.');
                    }
                    break;

                case 'high':
                    botResponses.push('Lo siento. Lo he registrado y voy a enviar un aviso a tu asistente social para que te contacten lo antes posible.\n\nSi te sientes insegura o necesitas ayuda ya, llama al 112 o pide ayuda a alguien cercano.');

                    // Add fall-specific warning if applicable
                    if (hasFall) {
                        botResponses.push('Si estás en el suelo o te has golpeado, no intentes levantarte rápido. Busca apoyo y pide ayuda.');
                    }
                    break;

                case 'medium':
                    botResponses.push('Gracias por contármelo. Lo he registrado.\n\n¿Quieres decirme qué es lo que más te preocupa ahora?');
                    break;

                case 'low':
                    botResponses.push('Gracias por decírmelo 😊 Me alegro. Si necesitas algo, escríbeme.');
                    break;
            }

            // Add all bot responses
            for (const response of botResponses) {
                const isEmergency = checkIn.severity === 'critical';
                addMessage(response, 'bot', isEmergency);
                // Small delay between messages for readability
                if (botResponses.length > 1) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }

            // Add confirmation message
            const now = new Date();
            const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
            const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            const severityLabel = checkIn.severity === 'critical' ? 'CRÍTICA' :
                checkIn.severity === 'high' ? 'ALTA' :
                    checkIn.severity === 'medium' ? 'MEDIA' : 'BAJA';

            const confirmationMsg = `Registro guardado: ${dateStr} ${timeStr} – Severidad: ${severityLabel}`;
            addMessage(confirmationMsg, 'bot');

            // Update case data with new score/priority
            setCaseData(prev => prev ? { ...prev, ...updatedCase } : null);

        } catch (err) {
            console.error('Error submitting check-in:', err);
            addMessage('Lo siento, hubo un error al registrar tu estado. Por favor, intenta de nuevo.', 'bot');
        } finally {
            setSubmittingCheckIn(false);
        }
    };

    const isStatusMessage = (text: string): boolean => {
        const lowerText = text.toLowerCase().trim();
        return lowerText.startsWith('hoy:') ||
            lowerText.startsWith('hoy ') ||
            lowerText.startsWith('me encuentro') ||
            lowerText.startsWith('estoy ');
    };

    // Check if message contains concerning keywords that should trigger monitoring
    const containsConcerningKeywords = (text: string): boolean => {
        const lowerText = text.toLowerCase();
        const concerningWords = [
            'mal', 'dolor', 'caí', 'caída', 'mareo', 'mareado', 'confuso',
            'no puedo', 'ayuda', 'urgente', 'sangre', 'pecho', 'respirar',
            'desmayo', 'golpe', 'triste', 'ansioso', 'miedo', 'solo',
            'medicación', 'olvidé', 'no he comido', 'no he bebido'
        ];
        return concerningWords.some(word => lowerText.includes(word));
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
        return 'Entiendo. ¿En qué más puedo ayudarte? Puedes preguntarme sobre tu medicación, citas o contarme cómo te encuentras.';
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userText = inputValue;

        // Add user message
        addMessage(userText, 'user');
        setShowQuickActions(false);
        setInputValue('');

        // ALWAYS check if message contains concerning keywords or is a status message
        // This allows continuous monitoring throughout the conversation
        if (isStatusMessage(userText) || containsConcerningKeywords(userText)) {
            // Submit as check-in to track and monitor
            await handleCheckIn(userText);
            return;
        }

        // Generate and add bot response for non-concerning messages
        setTimeout(() => {
            const response = generateBotResponse(userText);
            addMessage(response, 'bot');
        }, 500);
    };

    const handleQuickAction = (action: string) => {
        addMessage(action, 'user');
        setShowQuickActions(false);

        setTimeout(() => {
            const response = generateBotResponse(action);
            addMessage(response, 'bot');
        }, 500);
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
                    <div key={message.id}>
                        <div
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm ${message.isEmergency
                                    ? 'bg-red-100 border-2 border-red-500 text-gray-900'
                                    : message.sender === 'user'
                                        ? 'bg-[#dcf8c6] text-gray-800'
                                        : 'bg-white text-gray-800'
                                    }`}
                            >
                                {message.isEmergency && (
                                    <div className="flex items-center gap-2 mb-2 text-red-600">
                                        <AlertTriangle size={20} />
                                        <span className="font-bold text-sm">EMERGENCIA</span>
                                    </div>
                                )}
                                <p className="text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
                                <p className="text-xs text-gray-500 mt-1 text-right">
                                    {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        {/* Emoji Check-In Buttons */}
                        {message.showEmojiButtons && !hasCompletedDailyCheckIn && (
                            <div className="flex justify-start mt-3">
                                <div className="grid grid-cols-2 gap-2 max-w-[75%]">
                                    <button
                                        onClick={() => handleEmojiCheckIn('🙂', 'Bien')}
                                        className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-all text-left font-medium flex items-center gap-2 hover:bg-green-50"
                                        disabled={submittingCheckIn}
                                    >
                                        <span className="text-2xl">🙂</span>
                                        <span>Bien</span>
                                    </button>
                                    <button
                                        onClick={() => handleEmojiCheckIn('😐', 'Regular')}
                                        className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-all text-left font-medium flex items-center gap-2 hover:bg-yellow-50"
                                        disabled={submittingCheckIn}
                                    >
                                        <span className="text-2xl">😐</span>
                                        <span>Regular</span>
                                    </button>
                                    <button
                                        onClick={() => handleEmojiCheckIn('🙁', 'Mal')}
                                        className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-all text-left font-medium flex items-center gap-2 hover:bg-orange-50"
                                        disabled={submittingCheckIn}
                                    >
                                        <span className="text-2xl">🙁</span>
                                        <span>Mal</span>
                                    </button>
                                    <button
                                        onClick={() => handleEmojiCheckIn('🆘', 'Muy mal')}
                                        className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-all text-left font-medium flex items-center gap-2 hover:bg-red-50"
                                        disabled={submittingCheckIn}
                                    >
                                        <span className="text-2xl">🆘</span>
                                        <span>Muy mal</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Quick Action Buttons */}
                {showQuickActions && messages.length === 2 && !hasCompletedDailyCheckIn && (
                    <div className="flex flex-col gap-2 mt-4">
                        <p className="text-sm text-gray-600 text-center mb-2">O pregúntame sobre:</p>
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

                {/* Loading indicator for check-in submission */}
                {submittingCheckIn && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#25d366]"></div>
                                <p className="text-sm text-gray-600">Registrando tu estado...</p>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
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
                        disabled={submittingCheckIn}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || submittingCheckIn}
                        className="text-[#25d366] disabled:text-gray-300 hover:text-[#128c7e] transition-colors"
                    >
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
