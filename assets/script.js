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

const homeContactForm = document.getElementById('contact-form-home');
if (homeContactForm) {
  homeContactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(homeContactForm);
    if (data.get('website')) return;

    const lines = [
      'First Name: ' + (data.get('first_name') || ''),
      'Last Name: ' + (data.get('last_name') || ''),
      'Company Email: ' + (data.get('email') || ''),
      'Mobile: ' + (data.get('mobile') || ''),
      'Company Name: ' + (data.get('company') || ''),
      'Service: ' + (data.get('service') || ''),
      'Message: ' + (data.get('message') || '')
    ];

    window.location.href = 'mailto:info@geagle.sa?subject='
      + encodeURIComponent('New Consultation Request - Gulf Eagle Website')
      + '&body=' + encodeURIComponent(lines.join('\n'));
  });
}

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
