import { useState } from 'react';
import type { Property } from '../types/property';

interface LeadFormProps {
  property: Property;
  onSubmit: () => void;
  onClose: () => void;
}

export default function LeadForm({ property, onSubmit, onClose }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre es obligatorio';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'Email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitStatus('success');
    onSubmit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  if (submitStatus === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="success-title">
        <div className="relative w-full max-w-md mx-6 animate-scale-in">
          <div className="panel-glass rounded-2xl p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 id="success-title" className="font-display text-2xl md:text-3xl font-medium mb-3">Gracias.</h3>
            <p className="text-white/70 leading-relaxed mb-8">
              La inmobiliaria se pondrá en contacto con vos para coordinar la visita.
            </p>
            <a
              href={`https://wa.me/${property.assistantKnowledge.contact.whatsapp.replace(/\D/g, '')}?text=Hola, me interesa ${property.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-3 px-8 py-3"
            >
              <span>CONTACTAR POR WHATSAPP</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414zM12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.166.689-.223.689-.495 0-.237-.013-1.024-.013-1.988-2.782.586-3.369-1.165-3.369-1.165-.454-1.152-1.11-1.456-1.11-1.456-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.647.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.98 1.029-2.68-.103-.253-.446-1.27.098-2.64 0 0 .84-.269 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.37.203 2.388.1 2.64.64.7 1.028 1.59 1.028 2.68 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .272.18.662.688.493C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="lead-form-title">
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-60 w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur rounded-full border border-white/10 hover:bg-white/10 transition-all"
        aria-label="Cerrar formulario"
      >
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative w-full max-w-md mx-6 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="panel-glass rounded-2xl p-8 md:p-10">
          <div className="mb-8">
            <h2 id="lead-form-title" className="font-display text-2xl md:text-3xl font-medium mb-2">
              ME INTERESA ESTA PROPIEDAD
            </h2>
            <p className="text-white/60 text-sm">
              {property.name} · {property.location}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="name" className="block font-mono text-xs uppercase tracking-widest text-white/40 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-all ${
                  errors.name ? 'border-red-500/50' : 'border-white/10'
                }`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.name && <p id="name-error" className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="whatsapp" className="block font-mono text-xs uppercase tracking-widest text-white/40 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+54 9 388 123 4567"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-all ${
                  errors.whatsapp ? 'border-red-500/50' : 'border-white/10'
                }`}
                aria-invalid={!!errors.whatsapp}
                aria-describedby={errors.whatsapp ? 'whatsapp-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.whatsapp && <p id="whatsapp-error" className="mt-1 text-sm text-red-400">{errors.whatsapp}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-white/40 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-all ${
                  errors.email ? 'border-red-500/50' : 'border-white/10'
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.email && <p id="email-error" className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block font-mono text-xs uppercase tracking-widest text-white/40 mb-2">
                Consulta (opcional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="¿Cuándo te gustaría visitarla? ¿Tenés alguna duda?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-all resize-none"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 justify-center"
            >
              <span>{isSubmitting ? 'ENVIANDO...' : 'SOLICITAR VISITA'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}