// UIUtils.js - Utility functions for UI operations
class UIUtils {
  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Helper function to clean up stuck modals
  static cleanupModals() {
    const modals = document.querySelectorAll('.modal-overlay, #app-modal, #app-prompt-modal');
    modals.forEach(modal => {
      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    });
    
    // Reset body overflow
    document.body.style.overflow = '';
  }

  // Initialize emergency modal cleanup
  static initModalCleanup() {
    // Emergency cleanup on double ESC press
    let escPressCount = 0;
    let escTimer = null;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        escPressCount++;
        
        if (escTimer) {
          clearTimeout(escTimer);
        }
        
        if (escPressCount >= 2) {
          // Double ESC - force cleanup
          this.cleanupModals();
          escPressCount = 0;
        } else {
          // Reset counter after 500ms
          escTimer = setTimeout(() => {
            escPressCount = 0;
          }, 500);
        }
      }
    });
  }

  static safeT(key, fallback = key) {
    try {
      if (window.t && typeof window.t === 'function') {
        return window.t(key);
      }
      return fallback;
    } catch (error) {
      return fallback;
    }
  }

  static setButtonLoading(button, isLoading) {
    if (!button) {
      return;
    }
    
    if (isLoading) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = this.safeT('messages.loading', 'Завантаження...');
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || button.textContent;
    }
  }

  static showToast(type, message, duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) {
      alert(message);
      return;
    }
    
    const toast = document.createElement('div');
    
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-message">${this.escapeHtml(message)}</div>
      </div>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove toast
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, duration);
  }

  static createModal() {
    const modalHTML = `
      <div class="modal-overlay app-modal-system" id="app-modal">
        <div class="modal app-modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Заголовок</h3>
            <button class="modal-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="modal-message">Повідомлення</p>
          </div>
          <div class="modal-actions">
            <button class="modal-btn modal-btn-primary">OK</button>
            <button class="modal-btn modal-btn-secondary">Скасувати</button>
          </div>
        </div>
      </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    const modal = div.firstElementChild;
    
    return modal;
  }

  static createPromptModal() {
    const modal = document.createElement('div');
    modal.className = 'prompt-modal-overlay';
    modal.id = 'app-prompt-modal';
    modal.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      z-index: 999999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: var(--overlay) !important;
      backdrop-filter: blur(4px) !important;
      font-family: var(--font-family) !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transition: all 0.3s ease !important;
    `;
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Введіть значення</h3>
          <button class="modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body" style="padding: var(--spacing-lg);">
          <p class="modal-message" style="
            margin: 0 0 var(--spacing-md) 0;
            color: var(--text-secondary);
            font-size: 1rem;
            line-height: 1.5;
          ">Введіть нове значення:</p>
          
          <input type="text" class="modal-input" placeholder="Введіть значення..." style="
            width: 100%;
            padding: var(--spacing-sm) var(--spacing-md);
            border: 2px solid var(--border);
            border-radius: var(--radius-md);
            background: var(--surface);
            color: var(--text-primary);
            font-size: 1rem;
            transition: border-color 0.2s ease;
            outline: none;
          ">
        </div>
        
        <div style="padding: var(--spacing-lg); padding-top: 0;">
          <div class="modal-actions">
            <button class="modal-action-btn modal-btn-secondary" style="
              background: var(--surface);
              color: var(--text-secondary);
              border: 2px solid var(--border);
            ">
              <span>Скасувати</span>
            </button>
            
            <button class="modal-action-btn modal-btn-primary" style="
              background: var(--primary);
              color: white;
              border: none;
            ">
              <span>OK</span>
            </button>
          </div>
        </div>
      </div>
    `;
    
    return modal;
  }

  static showModal(options = {}) {
    const {
      title = 'Повідомлення',
      message = '',
      confirmText = 'OK',
      cancelText = 'Скасувати',
      showCancel = false,
      type = 'info'
    } = options;

    return new Promise((resolve) => {
      // Create modal if it doesn't exist
      let modal = document.getElementById('app-modal');
      if (!modal) {
        modal = this.createModal();
        document.body.appendChild(modal);
      }

      const overlay = modal;
      const modalContent = modal.querySelector('.modal');
      const modalTitle = modal.querySelector('.modal-title');
      const modalMessage = modal.querySelector('.modal-message');
      const confirmBtn = modal.querySelector('.modal-btn-primary');
      const cancelBtn = modal.querySelector('.modal-btn-secondary');
      const closeBtn = modal.querySelector('.modal-close');

      // Set content
      modalTitle.textContent = title;
      modalMessage.textContent = message;
      confirmBtn.textContent = confirmText;
      cancelBtn.textContent = cancelText;

      // Show/hide cancel button
      cancelBtn.style.display = showCancel ? 'block' : 'none';

      // Add type class for styling
      modalContent.className = `modal modal-${type}`;

      // Remove old listeners
      const newConfirmBtn = confirmBtn.cloneNode(true);
      const newCancelBtn = cancelBtn.cloneNode(true);
      const newCloseBtn = closeBtn.cloneNode(true);
      
      confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
      cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
      closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

      // Add new listeners
      const hideModal = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove modal from DOM after transition
        setTimeout(() => {
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, 300); // Wait for CSS transition to complete
      };

      newConfirmBtn.addEventListener('click', () => {
        hideModal();
        resolve(true);
      });

      newCancelBtn.addEventListener('click', () => {
        hideModal();
        resolve(false);
      });

      newCloseBtn.addEventListener('click', () => {
        hideModal();
        resolve(false);
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          hideModal();
          resolve(false);
        }
      });

      // ESC key handler
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          hideModal();
          resolve(false);
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);

      // Show modal
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus on confirm button
      setTimeout(() => {
        newConfirmBtn.focus();
      }, 100);
    });
  }

  static showAlert(message, title = 'Повідомлення') {
    try {
      return this.showModal({
        title,
        message,
        confirmText: 'OK',
        type: 'alert'
      });
    } catch (error) {
      console.error('Modal error:', error);
      // Fallback to native alert
      alert(title + ': ' + message);
      return Promise.resolve(true);
    }
  }

  static showConfirm(message, title = 'Підтвердження') {
    return this.showModal({
      title,
      message,
      confirmText: 'Так',
      cancelText: 'Ні',
      showCancel: true,
      type: 'confirm'
    });
  }

  static showPrompt(message, defaultValue = '', title = 'Введіть значення') {
    return new Promise((resolve) => {
      // Remove existing modal if present
      const existingModal = document.getElementById('app-prompt-modal');
      if (existingModal) {
        existingModal.remove();
      }

      // Create new prompt modal
      const modal = this.createPromptModal();
      document.body.appendChild(modal);

      const modalTitle = modal.querySelector('.modal-title');
      const modalMessage = modal.querySelector('.modal-message');
      const input = modal.querySelector('.modal-input');
      const confirmBtn = modal.querySelector('.modal-btn-primary');
      const cancelBtn = modal.querySelector('.modal-btn-secondary');
      const closeBtn = modal.querySelector('.modal-close');

      // Set content
      modalTitle.textContent = title;
      modalMessage.textContent = message;
      input.value = defaultValue;
      
      // Add input focus styling
      input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--primary)';
      });
      input.addEventListener('blur', () => {
        input.style.borderColor = 'var(--border)';
      });

      const cleanup = () => {
        modal.remove();
        document.body.style.overflow = '';
      };

      const handleConfirm = () => {
        const value = input.value.trim();
        cleanup();
        resolve(value || null);
      };

      const handleCancel = () => {
        cleanup();
        resolve(null);
      };

      confirmBtn.addEventListener('click', handleConfirm);
      cancelBtn.addEventListener('click', handleCancel);
      closeBtn.addEventListener('click', handleCancel);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) handleCancel();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleConfirm();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          handleCancel();
        }
      });

      // Show modal
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
      
      // Focus on input
      setTimeout(() => {
        input.focus();
        input.select();
      }, 100);
    });
  }
}

// Export for use in other modules
window.UIUtils = UIUtils;