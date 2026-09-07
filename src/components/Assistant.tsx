import { useRef, useState, useEffect } from 'react';
import type { AssistantKnowledge, FAQItem } from '../types/property';

interface AssistantProps {
  knowledge: AssistantKnowledge;
  onClose: () => void;
}

const randomTypingDelay = () => 800 + Math.random() * 600;

const PREDEFINED_QUESTIONS = [
  '¿Cuántos dormitorios tiene?',
  '¿Tiene cochera?',
  '¿Cuánto cuesta?',
  '¿Tiene patio?',
  '¿Acepta mascotas?',
  '¿Dónde está ubicada?',
  '¿Cuántos metros cuadrados tiene?',
  '¿Tiene baño privado?',
  '¿Puedo visitarla?',
];

function findAnswer(question: string, knowledge: AssistantKnowledge): string {
  const normalizedQuestion = question.toLowerCase().trim();

  const faqMatch = knowledge.faq.find((item: FAQItem) =>
    item.question.toLowerCase().includes(normalizedQuestion) ||
    normalizedQuestion.includes(item.question.toLowerCase())
  );

  if (faqMatch) return faqMatch.answer;

  if (normalizedQuestion.includes('dormitor') || normalizedQuestion.includes('habitacion')) {
    return `La propiedad tiene ${knowledge.features.find(f => f.includes('dormitorio')) || '3 dormitorios'}.`;
  }

  if (normalizedQuestion.includes('cochera') || normalizedQuestion.includes('garage') || normalizedQuestion.includes('estacionamiento')) {
    return knowledge.features.find(f => f.includes('cochera')) || 'Sí, tiene cochera doble cubierta con cargador para vehículo eléctrico.';
  }

  if (normalizedQuestion.includes('precio') || normalizedQuestion.includes('cuesta') || normalizedQuestion.includes('valor')) {
    return `El precio es ${knowledge.price}.`;
  }

  if (normalizedQuestion.includes('patio') || normalizedQuestion.includes('jardín') || normalizedQuestion.includes('exterior')) {
    return knowledge.features.find(f => f.includes('patio') || f.includes('jardín')) || 'Sí, tiene patio con deck, pérgola bioclimática y parrilla.';
  }

  if (normalizedQuestion.includes('mascota') || normalizedQuestion.includes('perro') || normalizedQuestion.includes('gato')) {
    return knowledge.rules.find(r => r.includes('mascota')) || 'Se aceptan mascotas bajo condiciones a convenir. Consultar con la inmobiliaria.';
  }

  if (normalizedQuestion.includes('ubic') || normalizedQuestion.includes('dónde') || normalizedQuestion.includes('dirección')) {
    return knowledge.location;
  }

  if (normalizedQuestion.includes('metro') || normalizedQuestion.includes('m²') || normalizedQuestion.includes('superficie')) {
    return `La propiedad tiene ${knowledge.features.find(f => f.includes('m²')) || '180m² cubiertos y 420m² de terreno'}.`;
  }

  if (normalizedQuestion.includes('baño') && normalizedQuestion.includes('privad')) {
    return 'El dormitorio principal tiene baño en suite privado con doble bacha, ducha y bañera exenta.';
  }

  if (normalizedQuestion.includes('visit') || normalizedQuestion.includes('verla') || normalizedQuestion.includes('conocer')) {
    return 'Sí, puedes coordinar una visita completando el formulario "SOLICITAR VISITA" o contactando por WhatsApp.';
  }

  return 'No tengo esa información disponible. Podés consultar directamente con la inmobiliaria.';
}

export default function Assistant({ knowledge, onClose }: AssistantProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (question?: string) => {
    const userQuestion = question || inputValue.trim();
    if (!userQuestion) return;

    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = findAnswer(userQuestion, knowledge);
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      setIsTyping(false);
    }, randomTypingDelay());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-title"
    >
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-60 w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur rounded-full border border-white/10 hover:bg-white/10 transition-all"
        aria-label="Cerrar asistente"
      >
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative w-full max-w-md mx-4 mb-4 md:mb-10 animate-scale-in" style={{ maxHeight: '80vh' }}>
        <div className="panel-glass rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: '80vh' }}>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 id="assistant-title" className="font-display text-lg font-medium text-white">
                  ASISTENTE IA
                </h3>
                <p className="font-mono text-xs uppercase tracking-widest text-white/40">
                  {knowledge.contact.agency}
                </p>
              </div>
            </div>

            <p className="text-white/60 text-sm leading-relaxed">
              ¿Querés saber algo sobre esta propiedad? Preguntame.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ minHeight: '200px' }}>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2" role="list" aria-label="Preguntas sugeridas">
                {PREDEFINED_QUESTIONS.slice(0, 6).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                    role="listitem"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-white/10 border border-white/10 rounded-br-none'
                      : 'bg-white/5 border border-white/10 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed {msg.role === 'user' ? 'text-white' : 'text-white/80'}">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-white/10">
            <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribí tu pregunta..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-all"
                aria-label="Tu pregunta"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Enviar pregunta"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}