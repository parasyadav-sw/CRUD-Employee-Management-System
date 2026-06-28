import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content small">
        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
          <h3 className="modal-title" style={{ color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} />
            {title || 'Confirm Action'}
          </h3>
          <button onClick={onClose} className="close-btn" disabled={isLoading}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body" style={{ paddingTop: '0.5rem', paddingBottom: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {message || 'Are you sure you want to perform this action? This cannot be undone.'}
          </p>
        </div>
        <div className="modal-footer" style={{ borderTop: 'none', paddingTop: '0' }}>
          <button
            onClick={onClose}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
