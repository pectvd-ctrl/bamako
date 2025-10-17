/* Global interactions for megamenu, mobile menu, smooth scroll & contact form validation */

document.addEventListener('DOMContentLoaded', () => {
  // Set year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Elements
  const mobileToggle = document.getElementById('mobile-toggle');
  const siteNav = document.getElementById('site-nav');
  const megaButtons = document.querySelectorAll('.has-mega .menu-btn');
  const megaPanels = document.querySelectorAll('.megamenu');
  const header = document.getElementById('header');

  // MOBILE TOGGLE
  mobileToggle && mobileToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(open));
  });

  // MEGAMENU - toggle per item
  megaButtons.forEach(btn => {
    const parent = btn.closest('.has-mega');
    const panel = parent.querySelector('.megamenu');

    // Mouseenter (desktop)
    parent.addEventListener('mouseenter', () => {
      closeAllMega();
      openMega(panel, btn);
    });
    parent.addEventListener('mouseleave', () => {
      closeMega(panel, btn);
    });

    // Click - for accessibility & mobile (toggle)
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMega(panel, btn);
      } else {
        closeAllMega();
        openMega(panel, btn);
      }
    });
  });

  // Close other megamenus
  function closeAllMega() {
    megaPanels.forEach(p => {
      p.setAttribute('aria-hidden', 'true');
    });
    megaButtons.forEach(b => b.setAttribute('aria-expanded', 'false'));
  }
  function openMega(panel, button) {
    if (!panel) return;
    panel.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
  }
  function closeMega(panel, button) {
    if (!panel) return;
    panel.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
  }

  // Close megamenu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-mega')) {
      closeAllMega();
    }
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - (header.offsetHeight + 8);
          window.scrollTo({ top, behavior: 'smooth' });
          // Close mobile menu after click
          if (siteNav.classList.contains('open')) {
            siteNav.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded','false');
          }
        }
      }
    });
  });

  /* Contact form validation and submit handling */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      let valid = true;

      if (!name || name.length < 2) {
        showError('err-name', 'Nom requis (2 caractères minimum).');
        valid = false;
      }
      if (!validateEmail(email)) {
        showError('err-email', 'Email invalide.');
        valid = false;
      }
      if (!message || message.length < 10) {
        showError('err-message', 'Message trop court (10 caractères minimum).');
        valid = false;
      }

      if (!valid) return;

      // Here: you can replace with an API call (fetch) to your backend.
      // For now we show a success message and clear form (simulating send).
      const feedback = document.getElementById('form-feedback');
      feedback.textContent = 'Envoi en cours…';
      try {
        // Simulate network latency
        await new Promise(r => setTimeout(r, 700));
        feedback.textContent = "Merci — votre message a bien été envoyé. Nous vous répondrons bientôt.";
        contactForm.reset();
      } catch (err) {
        feedback.textContent = "Erreur lors de l'envoi. Réessayez plus tard.";
      }
    });
  }

  function showError(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function clearErrors() {
    ['err-name','err-email','err-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    const fb = document.getElementById('form-feedback');
    if (fb) fb.textContent = '';
  }
  function validateEmail(email) {
    // Simple but safe regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* Accessibility: close mobile nav with Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded','false');
      }
      closeAllMega();
    }
  });

});
