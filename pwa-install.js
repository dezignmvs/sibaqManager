/**
 * Sibaq PWA & Desktop App Downloader Handler
 * Handles:
 * 1. Service Worker registration
 * 2. beforeinstallprompt (PWA install to desktop / phone system)
 * 3. Direct Download options (.exe and PWA)
 */

(function initSibaqPWA() {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('[PWA] ServiceWorker registered:', reg.scope))
        .catch((err) => console.warn('[PWA] ServiceWorker registration failed:', err));
    });
  }

  let deferredPrompt = null;

  // Listen for PWA installation prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] beforeinstallprompt captured');
    // Show download/install button if hidden
    const btn = document.getElementById('pwaDownloadBtn');
    if (btn) btn.style.display = 'inline-flex';
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    showPwaToast('Sibaq App installed successfully to your system!');
  });

  // Inject Download Modal & Button Styles
  const style = document.createElement('style');
  style.textContent = `
    .pwa-download-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #fdf1ee;
      border: 1px solid #fecbc2;
      color: #ea3a18;
      padding: 6px 14px;
      border-radius: 9px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.18s ease;
      text-decoration: none;
    }
    .pwa-download-btn:hover {
      background: #ea3a18;
      color: #ffffff;
      border-color: #ea3a18;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(234, 58, 24, 0.22);
    }
    .pwa-download-btn svg {
      width: 15px;
      height: 15px;
      stroke-width: 2.3;
    }

    /* Floating Download Trigger Button for Mobile & Desktop */
    .pwa-float-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #ea3a18, #d23111);
      color: #ffffff;
      border: none;
      border-radius: 50px;
      padding: 11px 18px;
      font-size: 0.84rem;
      font-weight: 800;
      font-family: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 6px 20px rgba(234, 58, 24, 0.38);
      z-index: 9998;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
    }
    .pwa-float-trigger:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 24px rgba(234, 58, 24, 0.45);
    }
    .pwa-float-trigger svg {
      width: 17px;
      height: 17px;
      stroke-width: 2.3;
    }

    /* Modal Backdrop */
    .pwa-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .pwa-modal-backdrop.open {
      display: flex;
      opacity: 1;
    }

    /* Modal Card */
    .pwa-modal-card {
      background: #ffffff;
      border-radius: 18px;
      padding: 28px 24px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 20px 45px rgba(0,0,0,0.22);
      border: 1px solid #eae5de;
      transform: scale(0.95);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .pwa-modal-backdrop.open .pwa-modal-card {
      transform: scale(1);
    }

    .pwa-modal-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .pwa-modal-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .pwa-modal-close {
      background: none;
      border: none;
      font-size: 1.3rem;
      cursor: pointer;
      color: #64748b;
      padding: 4px;
      border-radius: 6px;
      line-height: 1;
    }

    .pwa-options-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 20px 0 16px 0;
    }

    .pwa-option-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      background: #f8fafc;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
    }
    .pwa-option-card:hover {
      background: #ffffff;
      border-color: #ea3a18;
      box-shadow: 0 4px 14px rgba(234, 58, 24, 0.1);
      transform: translateY(-1px);
    }
    .pwa-option-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .pwa-option-title {
      font-size: 0.95rem;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .pwa-option-desc {
      font-size: 0.78rem;
      color: #64748b;
      line-height: 1.3;
    }

    /* Mini Toast */
    .pwa-toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #0f172a;
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 0.86rem;
      font-weight: 700;
      z-index: 10001;
      opacity: 0;
      transition: all 0.25s ease;
      pointer-events: none;
    }
    .pwa-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;
  document.head.appendChild(style);

  // Create Modal HTML
  const modalContainer = document.createElement('div');
  modalContainer.className = 'pwa-modal-backdrop';
  modalContainer.id = 'pwaModalBackdrop';
  modalContainer.innerHTML = `
    <div class="pwa-modal-card">
      <div class="pwa-modal-head">
        <div class="pwa-modal-title">
          <img src="Sibaq Logo.png" alt="Sibaq" style="width:28px;height:auto;">
          Download / Install Sibaq
        </div>
        <button type="button" class="pwa-modal-close" id="pwaModalClose">✕</button>
      </div>
      <p style="font-size:0.86rem;color:#64748b;margin-bottom:14px;">
        Choose your preferred way to install or download Sibaq Portal:
      </p>

      <div class="pwa-options-list">
        <!-- Option 1: PWA Native App Install -->
        <div class="pwa-option-card" id="pwaInstallDirectOption">
          <div class="pwa-option-icon" style="background:#fdf1ee;color:#ea3a18;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
          </div>
          <div>
            <div class="pwa-option-title">Install to System / Phone (PWA)</div>
            <div class="pwa-option-desc">Saves directly to your Windows / Mac desktop or Android / iPhone home screen as a standalone app.</div>
          </div>
        </div>

        <!-- Option 2: Windows Executable (.exe) -->
        <div class="pwa-option-card" id="pwaDownloadExeOption">
          <div class="pwa-option-icon" style="background:#fef9e8;color:#d97706;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          </div>
          <div>
            <div class="pwa-option-title">Download Windows App (.exe)</div>
            <div class="pwa-option-desc">Generates / downloads standalone Windows executable (.exe) for offline desktop usage.</div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalContainer);

  // Floating Button Trigger
  const floatBtn = document.createElement('button');
  floatBtn.type = 'button';
  floatBtn.className = 'pwa-float-trigger';
  floatBtn.id = 'pwaFloatTrigger';
  floatBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
    Download App
  `;
  document.body.appendChild(floatBtn);

  // Toast container
  const toast = document.createElement('div');
  toast.className = 'pwa-toast';
  toast.id = 'pwaToastMsg';
  document.body.appendChild(toast);

  function showPwaToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function openPwaModal() {
    modalContainer.classList.add('open');
  }

  function closePwaModal() {
    modalContainer.classList.remove('open');
  }

  // Event Listeners
  floatBtn.addEventListener('click', openPwaModal);
  document.querySelectorAll('.pwa-trigger-btn, #pwaDownloadBtn').forEach(btn => {
    btn.addEventListener('click', openPwaModal);
  });
  document.getElementById('pwaModalClose')?.addEventListener('click', closePwaModal);
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) closePwaModal();
  });

  // Handle Option 1: PWA Install
  document.getElementById('pwaInstallDirectOption')?.addEventListener('click', async () => {
    closePwaModal();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        showPwaToast('Installing Sibaq App to your system...');
      } else {
        showPwaToast('Installation dismissed.');
      }
      deferredPrompt = null;
    } else {
      // If browser already has app installed or doesn't support deferred prompt
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        showPwaToast('Tap your browser menu (⋮ or Share) and select "Add to Home screen" to save!');
      } else {
        showPwaToast('Click the install icon in your browser address bar (top right) or download the .exe!');
      }
    }
  });

  // Handle Option 2: Windows Executable (.exe)
  document.getElementById('pwaDownloadExeOption')?.addEventListener('click', () => {
    closePwaModal();
    showPwaToast('Preparing Sibaq Windows App download...');
    
    // Check if dist executable exists or trigger download
    const exeUrl = './dist/Sibaq-Portal-Portable.exe';
    
    // Create hidden download anchor
    const link = document.createElement('a');
    link.href = exeUrl;
    link.download = 'Sibaq-Portal-Portable.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      showPwaToast('If building fresh, run build-exe.bat to generate latest .exe file!');
    }, 2000);
  });

  // Expose global method
  window.openSibaqDownloadModal = openPwaModal;
})();
