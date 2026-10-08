import React, { useState } from 'react';
import { X, Key, CheckCircle2, Sparkles } from 'lucide-react';
import { geminiRetailService } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateKey: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onUpdateKey }) => {
  if (!isOpen) return null;

  const [inputKey, setInputKey] = useState(geminiRetailService.getApiKey());
  const [selectedModel, setSelectedModel] = useState(geminiRetailService.getModelName());
  const [reasoningBudget, setReasoningBudget] = useState(2048);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    geminiRetailService.setApiKey(inputKey, selectedModel, reasoningBudget);
    onUpdateKey();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  const isLive = geminiRetailService.isLiveApiActive();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 110,
      background: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }} onClick={onClose}>
      
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
          border: '1px solid #e2e8f0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key size={18} color="#2563eb" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>AI Model & API Configuration</h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Configure Gemini 3.7 Flash credentials</p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            background: isLive ? '#f0fdf4' : '#eff6ff',
            border: `1px solid ${isLive ? '#bbf7d0' : '#bfdbfe'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            {isLive ? <CheckCircle2 size={18} color="#16a34a" /> : <Sparkles size={18} color="#2563eb" />}
            <div style={{ fontSize: '0.8rem' }}>
              <strong style={{ color: '#0f172a', display: 'block' }}>
                {isLive ? 'Live Gemini 3.7 API Connected' : 'High-Fidelity Retail Simulation Active'}
              </strong>
              <span style={{ color: '#64748b' }}>
                {isLive ? 'Queries execute against live Google GenAI endpoint.' : 'Ready for offline presentation and demo evaluations.'}
              </span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
              GOOGLE GEMINI API KEY (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="AIzaSy... (leave blank to run high-fidelity simulator)"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
            <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
              Stored strictly in browser memory for secure testing.
            </p>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
              ACTIVE MODEL
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="gemini-3.7-flash">Gemini 3.7 Flash (Default - Multimodal Reasoning & Thinking)</option>
              <option value="gemini-3.7-pro">Gemini 3.7 Pro (Deep Chain-of-Thought & Edge Dispositions)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }}>
              {savedSuccess ? 'Configuration Saved!' : 'Save & Update'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
