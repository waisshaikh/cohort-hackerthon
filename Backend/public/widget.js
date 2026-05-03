/**
 * TenantDesk AI - Embeddable Support Widget
 * Inject this script into your website to add a support widget
 * 
 * Usage: <script src="https://tenantdesk.com/widget.js?tenant=YOUR_SLUG"></script>
 */

(function() {
  // Get tenant slug from query parameter
  const scriptTag = document.currentScript;
  const url = new URL(scriptTag.src);
  const tenantSlug = url.searchParams.get('tenant');

  if (!tenantSlug) {
    console.error('TenantDesk Widget: tenant parameter is required');
    return;
  }

  // Widget configuration
  const config = {
    tenantSlug,
    apiUrl: url.origin,
    iframeUrl: `${url.origin}/widget-iframe.html?tenant=${tenantSlug}`,
  };

  // Create widget styles
  const styles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    .tenantdesk-widget-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
      z-index: 999998;
    }

    .tenantdesk-widget-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 0;
    }

    .tenantdesk-widget-button:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.6);
    }

    .tenantdesk-widget-button:active {
      transform: scale(0.95);
    }

    .tenantdesk-widget-button svg {
      width: 28px;
      height: 28px;
      fill: white;
    }

    .tenantdesk-widget-bubble {
      position: absolute;
      bottom: 100px;
      right: 0;
      background: white;
      border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      font-size: 13px;
      color: #333;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
      margin-bottom: 8px;
    }

    .tenantdesk-widget-button:hover ~ .tenantdesk-widget-bubble {
      opacity: 1;
    }

    .tenantdesk-widget-frame {
      display: none;
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 420px;
      height: 600px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      z-index: 999999;
      background: white;
    }

    .tenantdesk-widget-frame.open {
      display: block;
      animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .tenantdesk-widget-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 999997;
    }

    .tenantdesk-widget-backdrop.open {
      display: block;
    }

    @media (max-width: 480px) {
      .tenantdesk-widget-frame {
        width: 100%;
        height: 100%;
        bottom: 0;
        right: 0;
        border-radius: 0;
      }

      .tenantdesk-widget-container {
        bottom: 16px;
        right: 16px;
      }
    }
  `;

  // Create widget HTML
  const containerHTML = `
    <div class="tenantdesk-widget-container">
      <button class="tenantdesk-widget-button" title="Chat with us">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8l-2 2V4h14v12z"/>
        </svg>
      </button>
      <div class="tenantdesk-widget-bubble">We typically reply in minutes</div>
    </div>
    <div class="tenantdesk-widget-backdrop"></div>
    <iframe class="tenantdesk-widget-frame" allow="camera; microphone"></iframe>
  `;

  // Initialize widget
  function init() {
    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Create container
    const container = document.createElement('div');
    container.innerHTML = containerHTML;
    document.body.appendChild(container);

    // Get references
    const button = container.querySelector('.tenantdesk-widget-button');
    const frame = container.querySelector('.tenantdesk-widget-frame');
    const backdrop = container.querySelector('.tenantdesk-widget-backdrop');

    // Set iframe src
    frame.src = config.iframeUrl;

    // Toggle widget
    function toggle() {
      const isOpen = frame.classList.contains('open');
      if (isOpen) {
        close();
      } else {
        open();
      }
    }

    function open() {
      frame.classList.add('open');
      backdrop.classList.add('open');
    }

    function close() {
      frame.classList.remove('open');
      backdrop.classList.remove('open');
    }

    // Event listeners
    button.addEventListener('click', toggle);
    backdrop.addEventListener('click', close);

    // Listen for close message from iframe
    window.addEventListener('message', function(event) {
      if (event.origin !== config.apiUrl) return;
      if (event.data.type === 'close-widget') {
        close();
      }
    });

    // Expose close function globally for iframe
    window.tenantdeskWidget = {
      open,
      close,
      toggle,
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
