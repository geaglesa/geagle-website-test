# Gulf Eagle Website — Codex Implementation Prompt
> Pre-Launch Fix List | Based on Full Site Audit | June 2026
> Apply all changes to the existing codebase. Do not alter any design, layout, or branding.

---

## 1. BUG FIXES

### 1.1 Fix broken contact form on `index.html`
- **Problem:** The homepage contact form (`<form class='contact-form'>`) has no `id`, no `action`, and no JS submission handler. Submitting the form does nothing.
- **Fix:**
  - Add `id="contact-form-home"` to the form element.
  - Add a hidden input: `<input type="hidden" name="subject" value="New Consultation Request - Gulf Eagle Website">`
  - Add the following script block at the bottom of `index.html` (before `</body>`), after the existing `<script src='assets/script.js'>`:
    ```js
    const formHome = document.getElementById('contact-form-home');
    if (formHome) {
      formHome.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = new FormData(formHome);
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
    ```
  - *(When Web3Forms is integrated later, replace this handler with the Web3Forms fetch-based approach used in `contact.html`.)*

### 1.2 Fix placeholder phone number on `index.html`
- **Problem:** `<a href='tel:+966000000000'>Call Geagle</a>` in the homepage contact section uses a fake number.
- **Fix:** Replace `+966000000000` with `+966545144359`. Final tag: `<a href='tel:+966545144359'>Call Geagle</a>`

### 1.3 Fix dead social media links (all pages)
- **Problem:** X (Twitter) and YouTube footer icon links use `href='#'` on all pages (`index.html`, `contact.html`, `careers.html`, `partners.html`, `privacy.html`, `terms.html`, `404.html`).
- **Fix (Option A — accounts exist):** Replace `href='#'` with the real X and YouTube profile URLs for Gulf Eagle Business Solutions.
- **Fix (Option B — accounts not ready):** Remove the `<a>` elements for X and YouTube from the footer social block entirely on all pages. Keep only the LinkedIn link.
- Apply the same change consistently across all HTML files.

### 1.4 Fix broken Arabic language toggle (all pages)
- **Problem:** All nav bars include `<a class='lang' href='ar/index.html'>AR</a>`. The `/ar/` directory and pages do not exist, causing a 404.
- **Fix:** Add `style="display:none"` to all AR toggle links across all pages so the toggle is hidden until Arabic pages are built:
  ```html
  <a class='lang' href='ar/index.html' style='display:none'>AR</a>
  ```
- Apply to: `index.html`, `contact.html`, `careers.html`, `partners.html`, `privacy.html`, `terms.html`, `404.html`.

### 1.5 Update `404.html` navigation to match site-wide mega-menu
- **Problem:** `404.html` uses an older simplified `<nav>` without the mega-menu dropdown that all other pages have.
- **Fix:** Replace the `<nav>` block inside the `<header>` of `404.html` with the identical full mega-menu nav markup used in `contact.html` or `careers.html`. Also update the header wrapper structure to match (`brand-logo-mark` span, `menu-toggle` button placement, `nav-actions` div).

---

## 2. SEO IMPROVEMENTS

### 2.1 Fix sitemap URL format mismatch in `sitemap.xml`
- **Problem:** `sitemap.xml` lists URLs with trailing slashes (e.g. `/contact/`, `/partners/`) but the actual files are `contact.html`, `partners.html`, etc. at the root.
- **Fix:** Update `sitemap.xml` to match the real file URLs. Replace all trailing-slash entries for the top-level pages:
  ```xml
  <!-- Change these: -->
  <loc>https://geagle.sa/contact/</loc>
  <loc>https://geagle.sa/partners/</loc>
  <loc>https://geagle.sa/careers/</loc>
  <loc>https://geagle.sa/privacy/</loc>
  <loc>https://geagle.sa/terms/</loc>
  <!-- To these: -->
  <loc>https://geagle.sa/contact.html</loc>
  <loc>https://geagle.sa/partners.html</loc>
  <loc>https://geagle.sa/careers.html</loc>
  <loc>https://geagle.sa/privacy.html</loc>
  <loc>https://geagle.sa/terms.html</loc>
  ```
- *(Service page URLs in sitemap can remain with trailing slashes only if the server is configured to serve `services/software-development/index.html` etc. — confirm with hosting setup.)*

### 2.2 Add Open Graph meta tags to `partners.html`
- **Problem:** `partners.html` has no OG or Twitter Card meta tags.
- **Fix:** Add the following inside `<head>` of `partners.html`, after the `<meta name='description'>` tag:
  ```html
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://geagle.sa/partners.html">
  <meta property="og:title" content="Customers & Technology Partners | Gulf Eagle Business Solutions">
  <meta property="og:description" content="Gulf Eagle works with enterprise customers and leading technology vendors across IT, cloud, cybersecurity, infrastructure, telecom, and managed services in Saudi Arabia.">
  <meta property="og:image" content="https://geagle.sa/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="en_SA">
  <meta property="og:site_name" content="Gulf Eagle Business Solutions">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Customers & Technology Partners | Gulf Eagle Business Solutions">
  <meta name="twitter:description" content="Enterprise customers and technology vendor ecosystem of Gulf Eagle Business Solutions in Saudi Arabia.">
  <meta name="twitter:image" content="https://geagle.sa/assets/og-image.jpg">
  ```

### 2.3 Fix Twitter Card title on `careers.html`
- **Problem:** `careers.html` Twitter Card uses the generic title "Geagle | Saudi IT Services" instead of the page-specific title.
- **Fix:** In `careers.html`, change:
  ```html
  <meta name="twitter:title" content="Geagle | Saudi IT Services">
  ```
  To:
  ```html
  <meta name="twitter:title" content="Careers at Gulf Eagle Business Solutions">
  ```

### 2.4 Add `width` and `height` attributes to all logo images
- **Problem:** Logo `<img>` tags (brand logo, footer logo) across all pages have no `width`/`height` attributes, causing layout shift (high CLS score).
- **Fix:** Add explicit dimensions to all logo image tags. Example for the header brand logo:
  ```html
  <img src='assets/gulf-eagle-official-logo.png' alt='Gulf Eagle logo' width='40' height='40'>
  ```
  And footer logo:
  ```html
  <img class='footer-logo' src='assets/gulf-eagle-official-logo.png' alt='Gulf Eagle Business Solutions logo' width='120' height='40'>
  ```
- Apply consistent `width`/`height` across all instances in all HTML files. Use actual image pixel dimensions.

---

## 3. ANALYTICS & TRACKING

### 3.1 Activate Google Analytics 4 on all pages
- **Problem:** All pages contain the comment `<!-- Analytics placeholder: add GA4 Measurement ID before enabling. -->` but no actual GA4 script.
- **Fix:** Replace that comment on every HTML page (`index.html`, `contact.html`, `careers.html`, `partners.html`, `privacy.html`, `terms.html`, `404.html`) with:
  ```html
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
  ```
- Replace `G-XXXXXXXXXX` with the real GA4 Measurement ID provided by the client.
- Place immediately after `<head>` opens (first tag in `<head>`).

### 3.2 Activate Microsoft Clarity on all pages
- **Problem:** All pages contain `<!-- Clarity placeholder: add Microsoft Clarity project ID before enabling. -->` but no script.
- **Fix:** Replace that comment on every HTML page with:
  ```html
  <!-- Microsoft Clarity -->
  <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "XXXXXXXXXX");
  </script>
  ```
- Replace `XXXXXXXXXX` with the real Clarity Project ID.
- Place directly after the GA4 block in `<head>`.

---

## 4. SECURITY FIXES

### 4.1 Add security HTTP headers (server / hosting config)
- **Problem:** No `Content-Security-Policy`, `X-Frame-Options`, or `X-Content-Type-Options` headers are set.
- **Fix:** Add the following headers at the server or hosting configuration level (e.g. `.htaccess` for Apache, `_headers` for Netlify/Cloudflare Pages, `vercel.json` headers for Vercel):

  **For Apache `.htaccess`:**
  ```apache
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://www.clarity.ms; frame-ancestors 'none';"
  ```

  **For Netlify/Cloudflare Pages `_headers` file (create at root):**
  ```
  /*
    X-Frame-Options: SAMEORIGIN
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: geolocation=(), microphone=(), camera=()
  ```

### 4.2 Add honeypot field to contact forms
- **Problem:** Contact forms have no bot protection.
- **Fix:** Add a hidden honeypot field to the contact form in both `index.html` and `contact.html`. Insert inside the `<form>` element, before the submit button:
  ```html
  <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
  ```
- In the JS submission handler, add a check before the submit logic:
  ```js
  if (data.get('website')) return; // honeypot triggered — bot submission
  ```

---

## 5. PERFORMANCE OPTIMIZATION

### 5.1 Add `loading="eager"` to above-fold hero images
- **Problem:** Any hero or above-fold images that might have `loading="lazy"` would delay rendering of the visible content.
- **Fix:** Ensure the brand/header logo image does NOT have `loading="lazy"`. Add `loading="eager"` explicitly if needed:
  ```html
  <img src='assets/gulf-eagle-official-logo.png' alt='Gulf Eagle logo' loading='eager' width='40' height='40'>
  ```
- Partner logo images in `partners.html` already correctly use `loading="lazy"` — keep as-is.

### 5.2 Add `fetchpriority="high"` to LCP image on homepage
- **Problem:** The largest contentful paint element (hero/logo) may not be prioritized by the browser.
- **Fix:** On `index.html`, add `fetchpriority="high"` to the hero section's primary visual element or brand logo:
  ```html
  <img src='assets/gulf-eagle-official-logo.png' alt='Gulf Eagle logo' loading='eager' fetchpriority='high' width='40' height='40'>
  ```

---

## 6. INTEGRATIONS

### 6.1 Replace mailto fallback with Web3Forms on `contact.html`
- **Problem:** The current contact form JS on `contact.html` opens a `mailto:` link, which fails silently if the user has no default email app configured.
- **Fix:** Replace the existing form submission JS on `contact.html` with a Web3Forms fetch submission:
  ```js
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = document.getElementById('submit-btn');
      btn.disabled = true;
      btn.textContent = 'Sending...';
      const formData = new FormData(form);
      formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY');
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          const success = document.getElementById('form-success');
          if (success) success.style.display = 'flex';
          form.reset();
        } else {
          alert('Something went wrong. Please email us directly at info@geagle.sa');
        }
      } catch(err) {
        alert('Network error. Please email us directly at info@geagle.sa');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Submit';
      }
    });
  }
  ```
- Replace `YOUR_WEB3FORMS_ACCESS_KEY` with the real key from web3forms.com.
- Add `<input type="hidden" name="access_key" value="">` inside the form (the JS will set it dynamically), OR keep it as a static hidden input in the HTML with the real key.

### 6.2 Apply same Web3Forms handler to homepage contact form (`index.html`)
- **Problem:** After fixing the homepage form (Task 1.1), it should also use Web3Forms rather than mailto for consistency.
- **Fix:** Once Web3Forms is set up in `contact.html` (Task 6.1), apply the same fetch-based handler to `contact-form-home` in `index.html`. Reuse the same access key.

---

## 7. CONTENT FIXES

### 7.1 Add Pakistan office postal code to footer (all pages)
- **Problem:** Pakistan office address reads "CB283 Rahimabad, Chaklala Cantt., Rawalpindi" with no postal code.
- **Fix:** Update to include postal code. The correct postal code for Chaklala Cantt., Rawalpindi is **46000**:
  ```html
  <p><strong>Pakistan Office</strong><br>CB283 Rahimabad<br>Chaklala Cantt., Rawalpindi 46000<br>Pakistan</p>
  ```
- Apply to all pages where the footer appears: `index.html`, `contact.html`, `careers.html`, `partners.html`, `privacy.html`, `terms.html`.

---

## 8. ASSETS TO CREATE (Non-Code Tasks for Designer)

> These cannot be automated by Codex — flag these as manual tasks.

| Asset | Spec | Location |
|---|---|---|
| `og-image.jpg` | 1200×630px, branded with Gulf Eagle logo + tagline "Saudi IT Services" | `assets/og-image.jpg` |
| `favicon.png` | 512×512px Gulf Eagle logo mark, PNG with transparency | `assets/favicon.png` |

---

## IMPLEMENTATION ORDER (Priority)

```
1. Fix homepage form (1.1) → Fix phone number (1.2)
2. Hide AR toggle (1.4) → Fix social links (1.3)
3. Activate GA4 (3.1) + Clarity (3.2)
4. Fix sitemap (2.1) → Add OG tags to partners.html (2.2)
5. Add image dimensions (2.4)
6. Add security headers (4.1)
7. Add honeypot (4.2)
8. Integrate Web3Forms (6.1, 6.2)
9. Fix 404 nav (1.5)
10. Performance hints (5.1, 5.2)
11. Content fixes (7.1)
```

---

*End of Codex Implementation Prompt — Gulf Eagle Website Pre-Launch Fixes*
