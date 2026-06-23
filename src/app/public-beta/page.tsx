"use client";

import React, { useState } from 'react';
import { DakoLogo } from '@/components/dako-logo';

export default function DakoBetaFeedbackPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleText = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        console.error('Submission failed');
        // We'll still show submitted for now so users aren't stuck, or you can handle errors.
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = Math.round((step / 6) * 100) + '%';

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-[#161618] rounded-2xl overflow-hidden border border-[#2C2C30] relative shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-[320px] bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(193,39,45,0.13)_0%,transparent_70%)] pointer-events-none" />
          <div className="p-12 text-center relative z-10">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="font-display font-extrabold text-3xl tracking-tight text-[#FAF8F4] mb-3">
              Feedback<br /><span className="text-primary">received.</span>
            </h2>
            <p className="text-[#8E8E92] text-sm max-w-[340px] mx-auto mb-6 leading-relaxed">
              We read every response. If you left your number and something you said raises a question, we'll reach out on WhatsApp.
            </p>
            <p className="font-mono text-[11px] text-[#8E8E92] tracking-[0.08em]">dako.studio</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#161618] rounded-2xl overflow-hidden border border-[#2C2C30] relative shadow-2xl">
        {/* Glow */}
        <div className="absolute top-0 left-0 right-0 h-[320px] bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(193,39,45,0.13)_0%,transparent_70%)] pointer-events-none" />

        {/* Header */}
        <div className="p-10 pb-7 border-b border-[#2C2C30] relative z-10">
          <div className="flex items-center justify-between mb-6">
            <DakoLogo size={26} className="dark" />
            <span className="bg-primary/10 text-primary font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-primary/30">
              beta feedback
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight text-[#FAF8F4] mb-2 leading-[1.1]">
            We're building<br /><span className="text-primary">in public.</span>
          </h1>
          <p className="text-[#8E8E92] text-sm mb-6">Takes 2 minutes. No sign-up. Just your honest reaction.</p>
          
          <div className="bg-[#1E1E21] border border-primary/40 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <p className="text-[#FAF8F4] text-sm mb-3 font-medium">
              Important: This survey is about your experience on our main website.
            </p>
            <p className="text-[#8E8E92] text-[13px] mb-4">
              Please open the site, take a look around, and then come back here to share your thoughts.
            </p>
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center bg-white text-background hover:bg-gray-200 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95"
            >
              Open Main Website <span className="ml-2">↗</span>
            </a>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[2px] bg-[#2C2C30] relative overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out" 
            style={{ width: progress }}
          />
        </div>

        {/* Body */}
        <div className="p-10 relative z-10">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#8E8E92] mb-3">01 of 06</p>
              <h2 className="font-display font-bold text-xl text-[#FAF8F4] mb-6">What type of business do you run?</h2>
              <div className="flex flex-col gap-2.5">
                {[
                  { id: 'real-estate', label: 'Real estate / property' },
                  { id: 'ecommerce', label: 'E-commerce / Retail' },
                  { id: 'tech', label: 'Technology / SaaS' },
                  { id: 'creative', label: 'Creative / Agency / Media' },
                  { id: 'law', label: 'Law / professional services' },
                  { id: 'healthcare', label: 'Healthcare / dental' },
                  { id: 'hospitality', label: 'Hospitality / food' },
                  { id: 'consulting', label: 'Consulting / Coaching' },
                  { id: 'diaspora', label: 'Diaspora business' },
                  { id: 'other', label: 'Other' },
                ].map(opt => (
                  <OptionButton 
                    key={opt.id} 
                    label={opt.label} 
                    selected={answers['q1'] === opt.id} 
                    onClick={() => handleSelect('q1', opt.id)} 
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#8E8E92] mb-3">02 of 06</p>
              <h2 className="font-display font-bold text-xl text-[#FAF8F4] mb-6">Where did you find us?</h2>
              <div className="flex flex-col gap-2.5">
                {[
                  { id: 'instagram', label: 'Instagram' },
                  { id: 'whatsapp', label: 'WhatsApp' },
                  { id: 'linkedin', label: 'LinkedIn' },
                  { id: 'referral', label: 'Referred by someone' },
                  { id: 'other', label: 'Other' },
                ].map(opt => (
                  <OptionButton 
                    key={opt.id} 
                    label={opt.label} 
                    selected={answers['q2'] === opt.id} 
                    onClick={() => handleSelect('q2', opt.id)} 
                  />
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#8E8E92] mb-3">03 of 06</p>
              <h2 className="font-display font-bold text-xl text-[#FAF8F4] mb-6">First impression — what does the site make you feel?</h2>
              <textarea 
                className="w-full bg-[#1E1E21] border border-[#2C2C30] rounded-lg p-4 text-[#FAF8F4] text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
                rows={5}
                placeholder="Be direct. Good and bad."
                value={answers['q3'] || ''}
                onChange={e => handleText('q3', e.target.value)}
              />
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#8E8E92] mb-3">04 of 06</p>
              <h2 className="font-display font-bold text-xl text-[#FAF8F4] mb-6">What's the one thing that's unclear or missing?</h2>
              <textarea 
                className="w-full bg-[#1E1E21] border border-[#2C2C30] rounded-lg p-4 text-[#FAF8F4] text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
                rows={5}
                placeholder="Pricing, process, who this is for — anything."
                value={answers['q4'] || ''}
                onChange={e => handleText('q4', e.target.value)}
              />
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#8E8E92] mb-3">05 of 06</p>
              <h2 className="font-display font-bold text-xl text-[#FAF8F4] mb-6">Would you hire us based on what you saw?</h2>
              <div className="flex flex-col gap-2.5">
                {[
                  { id: 'yes', label: 'Yes, right now' },
                  { id: 'maybe', label: 'Maybe — I need to see more' },
                  { id: 'not-yet', label: 'Not yet' },
                ].map(opt => (
                  <OptionButton 
                    key={opt.id} 
                    label={opt.label} 
                    selected={answers['q5'] === opt.id} 
                    onClick={() => handleSelect('q5', opt.id)} 
                  />
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#8E8E92] mb-3">06 of 06</p>
              <h2 className="font-display font-bold text-xl text-[#FAF8F4] mb-6">Leave your WhatsApp number if you want us to follow up.</h2>
              <input 
                type="text"
                className="w-full bg-[#1E1E21] border border-[#2C2C30] rounded-lg p-4 text-[#FAF8F4] font-mono text-[13px] focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="+234 xxx xxxx xxx"
                value={answers['q6'] || ''}
                onChange={e => handleText('q6', e.target.value)}
              />
              <p className="text-[12px] text-[#8E8E92] mt-2">Optional. No spam — we'll only reach out if your feedback raises a question.</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <span className="font-mono text-[11px] text-[#8E8E92] tracking-wider">Step {step} of 6</span>
            <div className="flex gap-2.5">
              {step > 1 && (
                <button 
                  onClick={handlePrev}
                  className="bg-transparent border border-[#2C2C30] hover:border-white/20 text-[#8E8E92] hover:text-[#FAF8F4] px-5 py-2.5 rounded-md text-[13px] font-semibold transition-colors"
                >
                  ← Back
                </button>
              )}
              {step < 6 ? (
                <button 
                  onClick={handleNext}
                  className="bg-primary hover:opacity-90 active:scale-95 text-[#FAF8F4] px-6 py-2.5 rounded-md text-[13px] font-semibold transition-all"
                >
                  Continue →
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary hover:opacity-90 active:scale-95 disabled:opacity-50 text-[#FAF8F4] px-6 py-2.5 rounded-md text-[13px] font-semibold transition-all"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit feedback'}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function OptionButton({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-colors select-none ${
        selected 
          ? 'bg-primary/10 border-primary' 
          : 'bg-[#1E1E21] border-[#2C2C30] hover:border-primary/40 hover:bg-[#252528]'
      }`}
    >
      <div className={`w-4 h-4 rounded-full border-[1.5px] shrink-0 flex items-center justify-center transition-colors ${
        selected ? 'border-primary bg-primary' : 'border-[#8E8E92]'
      }`}>
        {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
      </div>
      <span className={`text-sm font-medium leading-snug ${selected ? 'text-[#FAF8F4]' : 'text-[#FAF8F4]'}`}>
        {label}
      </span>
    </button>
  );
}
