/**
 * Sibaq Portal - Mobile Experience Runtime Engine (mobile-ui.js)
 * Delivers 100% native-app satisfaction:
 * - Fluid drawer management with swipe gestures
 * - Modern bottom navigation dock with live active tab synchronization
 * - Bottom-sheet modal handles
 * - Table swipe assist
 * - Keyboard avoidance
 */

(function initSibaqMobileUI() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileUI);
  } else {
    setupMobileUI();
  }

  function setupMobileUI() {
    setupDrawerNavigation();
    setupBottomNavDock();
    setupModalBottomSheets();
    setupTableScrollAssist();
    setupKeyboardAvoidance();
  }

  /* ==========================================================================
     1. DRAWER NAVIGATION & TOUCH GESTURES
     ========================================================================== */
  function setupDrawerNavigation() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    const menuBtn = document.getElementById('mobileMenuBtn');
    const closeBtn = document.getElementById('mobileSidebarClose');

    if (!sidebar) return;

    function openDrawer() {
      sidebar.classList.add('mobile-open');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDrawer();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    // Auto close drawer when nav links are tapped on mobile
    const navLinks = sidebar.querySelectorAll('.nav-link, .submenu-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          // If it's a submenu parent toggle, keep open; otherwise close
          const parentItem = link.closest('.has-submenu');
          if (link.id === 'userMenuHeader' || (parentItem && link.classList.contains('nav-link') && parentItem.querySelector('.submenu'))) {
            return;
          }
          closeDrawer();
        }
      });
    });

    // Touch Swipe Gestures
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Only horizontal swipes
      if (Math.abs(diffX) > 60 && Math.abs(diffY) < 50) {
        // Swipe right from left edge to open drawer
        if (diffX > 0 && touchStartX < 40 && !sidebar.classList.contains('mobile-open')) {
          openDrawer();
        }
        // Swipe left to close drawer
        else if (diffX < 0 && sidebar.classList.contains('mobile-open')) {
          closeDrawer();
        }
      }
    }, { passive: true });

    // Expose drawer control globally
    window.openSibaqDrawer = openDrawer;
    window.closeSibaqDrawer = closeDrawer;
  }

  /* ==========================================================================
     2. SLEEK BOTTOM NAVIGATION DOCK
     ========================================================================== */
  function setupBottomNavDock() {
    // Determine which dashboard we are in
    const path = window.location.pathname.toLowerCase();
    let navConfig = null;

    if (path.includes('teahdashboard') || document.querySelector('#page-attendance')) {
      navConfig = [
        {
          id: 'attendance',
          label: 'Attendance',
          icon: '<svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>'
        },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: '<svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>'
        },
        {
          id: 'evaluation',
          label: 'Evaluation',
          icon: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
        },
        {
          id: 'punishment',
          label: 'Punishment',
          icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
        },
        {
          id: '__menu__',
          label: 'Menu',
          icon: '<svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>'
        }
      ];
    } else if (path.includes('catedashboard')) {
      navConfig = [
        {
          id: 'attendance',
          label: 'Attendance',
          icon: '<svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>'
        },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: '<svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>'
        },
        {
          id: 'evaluation',
          label: 'Evaluation',
          icon: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
        },
        {
          id: 'schedule',
          label: 'Schedule',
          icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
        },
        {
          id: '__menu__',
          label: 'Menu',
          icon: '<svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>'
        }
      ];
    } else if (path.includes('chiefdashboard')) {
      navConfig = [
        {
          id: 'alerts',
          label: 'Alerts',
          icon: '<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>'
        },
        {
          id: 'staging',
          label: 'Staging',
          icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
        },
        {
          id: 'coordinators',
          label: 'Log',
          icon: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>'
        },
        {
          id: 'attendance-track',
          label: 'Tracker',
          icon: '<svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>'
        },
        {
          id: '__menu__',
          label: 'Menu',
          icon: '<svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>'
        }
      ];
    } else if (path.includes('dashboard.html') || document.querySelector('#page-home')) {
      navConfig = [
        {
          id: 'home',
          label: 'Home',
          icon: '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
        },
        {
          id: 'data',
          label: 'Data',
          icon: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>'
        },
        {
          id: 'mail',
          label: 'Mail',
          icon: '<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>'
        },
        {
          id: '__menu__',
          label: 'Menu',
          icon: '<svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>'
        }
      ];
    }

    // Only render on dashboard pages
    if (!navConfig) return;

    // Remove existing bottom nav if any
    const existing = document.getElementById('mobileBottomNav');
    if (existing) existing.remove();

    const bottomNav = document.createElement('nav');
    bottomNav.id = 'mobileBottomNav';
    bottomNav.className = 'mobile-bottom-nav';
    bottomNav.setAttribute('aria-label', 'Mobile Quick Navigation');

    navConfig.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mobile-bottom-item';
      btn.dataset.tab = item.id;
      btn.innerHTML = `
        ${item.icon}
        <span class="mobile-bottom-label">${item.label}</span>
      `;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (item.id === '__menu__') {
          if (window.openSibaqDrawer) window.openSibaqDrawer();
          return;
        }

        // Trigger native tab switch
        if (typeof window.switchToTab === 'function') {
          window.switchToTab(item.id);
        } else {
          // Fallback: click corresponding nav link
          const sidebarItem = document.querySelector(`.nav-item[data-tab="${item.id}"], .submenu-item[data-tab="${item.id}"]`);
          if (sidebarItem) {
            const link = sidebarItem.querySelector('a');
            if (link) link.click();
            else sidebarItem.click();
          }
        }
        syncBottomNavActive(item.id);
      });

      bottomNav.appendChild(btn);
    });

    document.body.appendChild(bottomNav);

    // Initial sync
    const activeSidebar = document.querySelector('.nav-item.active, .submenu-item.active');
    if (activeSidebar && activeSidebar.dataset.tab) {
      syncBottomNavActive(activeSidebar.dataset.tab);
    } else if (navConfig[0]) {
      syncBottomNavActive(navConfig[0].id);
    }

    // Hook tab switches to keep bottom nav highlighted
    if (typeof window.switchToTab === 'function') {
      const originalSwitch = window.switchToTab;
      window.switchToTab = function(tabName) {
        originalSwitch.apply(this, arguments);
        syncBottomNavActive(tabName);
      };
    }
  }

  function syncBottomNavActive(tabId) {
    const bottomNav = document.getElementById('mobileBottomNav');
    if (!bottomNav) return;

    const items = bottomNav.querySelectorAll('.mobile-bottom-item');
    items.forEach((item) => {
      if (item.dataset.tab === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     3. NATIVE MODAL BOTTOM SHEETS
     ========================================================================== */
  function setupModalBottomSheets() {
    const modals = document.querySelectorAll('.modal-card, .modal-content, .coord-modal-content');
    modals.forEach((modal) => {
      // Add iOS drag handle if missing
      if (!modal.querySelector('.bottom-sheet-handle')) {
        const handle = document.createElement('div');
        handle.className = 'bottom-sheet-handle';
        modal.prepend(handle);
      }
    });
  }

  /* ==========================================================================
     4. TABLE SWIPE ASSISTANT (Mobile Only)
     ========================================================================== */
  function setupTableScrollAssist() {
    // Only apply scroll hint on small touch screens
    if (window.innerWidth > 768) return;

    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
      const parent = table.parentElement;
      if (!parent.classList.contains('table-responsive') && !parent.classList.contains('table-scroll-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-scroll-wrapper';
        parent.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }

      // Add scroll hint only on mobile touch screens
      const scrollParent = table.closest('.table-responsive, .table-scroll-wrapper');
      if (scrollParent && !scrollParent.previousElementSibling?.classList.contains('table-scroll-hint')) {
        const hint = document.createElement('div');
        hint.className = 'table-scroll-hint';
        hint.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:14px;height:14px;max-width:14px;max-height:14px;flex-shrink:0;"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>
          <span>Scroll horizontally for more data</span>
        `;
        scrollParent.parentElement.insertBefore(hint, scrollParent);

        // Hide hint once scrolled
        scrollParent.addEventListener('scroll', () => {
          if (scrollParent.scrollLeft > 20) {
            hint.style.opacity = '0';
            hint.style.transition = 'opacity 0.3s ease';
            setTimeout(() => { hint.style.display = 'none'; }, 300);
          }
        }, { passive: true, once: true });
      }
    });
  }

  /* ==========================================================================
     5. KEYBOARD AVOIDANCE FOR BOTTOM DOCK
     ========================================================================== */
  function setupKeyboardAvoidance() {
    const bottomNav = document.getElementById('mobileBottomNav');
    if (!bottomNav) return;

    window.addEventListener('focusin', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
        bottomNav.classList.add('nav-hidden');
      }
    });

    window.addEventListener('focusout', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
        setTimeout(() => {
          bottomNav.classList.remove('nav-hidden');
        }, 150);
      }
    });
  }

})();
