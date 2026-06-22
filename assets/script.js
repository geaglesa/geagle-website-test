const t = document.querySelector('.menu-toggle');
const n = document.querySelector('.nav');

if (t && n) {
  t.addEventListener('click', () => {
    const o = n.classList.toggle('open');
    t.setAttribute('aria-expanded', String(o));
  });
}

document.querySelectorAll('.mega-trigger').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (window.matchMedia('(max-width:1020px)').matches) {
      const wrap = btn.closest('.nav-mega');
      const open = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    }
  });
});

document.querySelectorAll('.nav-mega').forEach((wrap) => {
  const trigger = wrap.querySelector('.mega-trigger');
  const menu = wrap.querySelector('.mega-menu');
  let timer;
  const desktop = () => window.matchMedia('(min-width:1021px)').matches;
  const open = () => {
    if (!desktop()) return;
    clearTimeout(timer);
    wrap.classList.add('open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    if (!desktop()) return;
    timer = setTimeout(() => {
      wrap.classList.remove('open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }, 260);
  };

  wrap.addEventListener('mouseenter', open);
  wrap.addEventListener('mouseleave', close);
  if (menu) {
    menu.addEventListener('mouseenter', open);
    menu.addEventListener('mouseleave', close);
  }
});

const pathName = window.location.pathname.replace(/\\/g, '/');
const pageName = pathName.split('/').pop() || 'index.html';
const isServicePage = pathName.includes('/services/');

if (isServicePage) {
  document.querySelectorAll('.nav-mega, .mega-trigger').forEach((el) => {
    el.classList.add('active');
  });
}

document.querySelectorAll('.nav a[href], .lang[href]').forEach((link) => {
  const rawHref = link.getAttribute('href') || '';
  const cleanHref = rawHref.split('#')[0].split('?')[0];
  if (!cleanHref || cleanHref === '#') return;

  const hrefPage = cleanHref.split('/').pop() || 'index.html';
  if (hrefPage === pageName && pageName !== 'index.html') {
    link.classList.add('active');
  }
});

document.querySelectorAll('.nav a[href]').forEach((link) => {
  link.addEventListener('click', (e) => {
    if (!window.matchMedia('(max-width:1020px)').matches) return;
    const href = link.getAttribute('href') || '';
    if (!href || href === '#') return;

    const openNav = link.closest('.nav.open');
    if (!openNav) return;

    e.preventDefault();
    openNav.classList.remove('open');
    if (t) t.setAttribute('aria-expanded', 'false');
    window.location.assign(link.href);
  });
});

const serviceSelect = document.querySelector('.contact-form select[name="service"]');
if (serviceSelect) {
  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get('service');
  if (requestedService) {
    const normalize = (value) => value
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[-_]+/g, ' ')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    const requested = normalize(requestedService);

    Array.from(serviceSelect.options).forEach((option) => {
      const optionText = normalize(option.textContent);
      if (optionText === requested || optionText.includes(requested) || requested.includes(optionText)) {
        serviceSelect.value = option.value;
      }
    });
  }
}

const WEB3FORMS_ACCESS_KEY = '2751e9d3-6ecd-4e9f-85f5-b685e778ad59';

async function submitToWeb3Forms(form, button) {
  const data = new FormData(form);
  if (data.get('website')) return true;
  data.set('access_key', WEB3FORMS_ACCESS_KEY);
  data.set('from_name', 'Gulf Eagle Website');
  data.set('subject', data.get('subject') || 'New Consultation Request - Gulf Eagle Website');

  if (button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = document.documentElement.dir === 'rtl' ? 'جار الإرسال...' : 'Sending...';
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'Form submission failed');
    form.reset();
    return true;
  } catch (error) {
    console.error(error);
    if (button) {
      button.disabled = false;
      button.textContent = button.dataset.originalText || 'Submit';
    }
    alert(document.documentElement.dir === 'rtl'
      ? 'تعذر إرسال الطلب. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة.'
      : 'Could not send your request. Please try again or email us directly.');
    return false;
  }
}

const homeContactForm = document.getElementById('contact-form-home');
if (homeContactForm) {
  homeContactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = homeContactForm.querySelector('button[type="submit"], .contact-submit');
    const sent = await submitToWeb3Forms(homeContactForm, button);
    if (sent) {
      if (button) {
        button.disabled = true;
        button.textContent = document.documentElement.dir === 'rtl' ? 'تم إرسال الطلب' : 'Request Sent';
      }
      const success = homeContactForm.querySelector('#form-success');
      if (success) success.style.display = 'flex';
    }
  });
}

document.querySelectorAll('.contact-form').forEach((form) => {
  if (form.id === 'contact-form-home') return;
  if (form.dataset.web3formsBound === 'true') return;
  form.dataset.web3formsBound = 'true';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = form.querySelector('#submit-btn, button[type="submit"], .contact-submit');
    const sent = await submitToWeb3Forms(form, button);
    if (!sent) return;

    const success = form.querySelector('#form-success');
    if (success) success.style.display = 'flex';
    if (button) {
      button.style.display = 'none';
      button.disabled = true;
    }
  });
});
document.querySelectorAll('.faq details').forEach((d) => {
  const s = d.querySelector('summary');
  if (!s) return;
  s.addEventListener('click', (e) => {
    e.preventDefault();
    if (d.dataset.animating === 'true') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      d.open = !d.open;
      return;
    }
    d.dataset.animating = 'true';
    if (!d.open) {
      d.open = true;
      const start = s.offsetHeight;
      const end = d.scrollHeight;
      d.style.height = start + 'px';
      d.animate({ height: [start + 'px', end + 'px'] }, {
        duration: 360,
        easing: 'cubic-bezier(.22,1,.36,1)'
      }).onfinish = () => {
        d.style.height = '';
        d.dataset.animating = 'false';
      };
    } else {
      const start = d.offsetHeight;
      const end = s.offsetHeight;
      d.style.height = start + 'px';
      d.animate({ height: [start + 'px', end + 'px'] }, {
        duration: 300,
        easing: 'cubic-bezier(.55,0,.1,1)'
      }).onfinish = () => {
        d.open = false;
        d.style.height = '';
        d.dataset.animating = 'false';
      };
    }
  });
});

document.querySelectorAll('form:not(.contact-form)').forEach((f) => {
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const b = f.querySelector('button');
    if (b) {
      b.textContent = 'Request Prepared';
      b.disabled = true;
    }
  });
});

const revealTargets = document.querySelectorAll([
  '.partner-marquee-section',
  '.logo-marquee-panel',
  '.partners-page-section',
  '.services-section .section-head',
  '.service-card',
  '.approach .section-head',
  '.delivery-steps article',
  '.saudi-ready .section-head',
  '.trust-badge-grid span',
  '.contact-section .contact-head',
  '.contact-card',
  '.contact-form',
  '.service-benefits article',
  '.content-block',
  '.feature-card',
  '.why-panel',
  '.faq',
  '.related a',
  '.careers-section article',
  '.careers-banner',
  '.footer-main > *',
  '.footer-bottom'
].join(','));

if (revealTargets.length) {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  } else {
    revealTargets.forEach((el, index) => {
      el.classList.add('reveal-on-scroll');
      el.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    revealTargets.forEach((el) => revealObserver.observe(el));
  }
}

