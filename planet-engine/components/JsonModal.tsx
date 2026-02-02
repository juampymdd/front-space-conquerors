import { useState } from 'react';
import type { SolarSystemData } from '../types/solar-system.types';

interface JsonModalProps {
  data: SolarSystemData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JsonModal({ data, isOpen, onClose }: JsonModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📋 Sistema Solar JSON</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <pre className="json-display">{jsonString}</pre>
        </div>
        
        <div className="modal-footer">
          <button className="copy-button" onClick={handleCopy}>
            {copied ? '✓ Copiado!' : '📋 Copiar al Portapapeles'}
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: #1a1a1a;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          border: 1px solid #333;
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          color: white;
          font-size: 20px;
        }

        .close-button {
          background: none;
          border: none;
          color: #999;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: #333;
          color: white;
        }

        .modal-body {
          flex: 1;
          overflow: auto;
          padding: 20px;
        }

        .json-display {
          margin: 0;
          padding: 15px;
          background: #0a0a0a;
          border-radius: 8px;
          color: #4af;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.5;
          overflow-x: auto;
          border: 1px solid #222;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #333;
          display: flex;
          justify-content: flex-end;
        }

        .copy-button {
          padding: 12px 24px;
          background: #4a4aff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .copy-button:hover {
          background: #6a6aff;
          transform: translateY(-1px);
        }

        .copy-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
