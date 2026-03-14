 document.addEventListener("DOMContentLoaded", () => {

  // 1. Language Switcher & Automatic Link Adjustment
  (function() {
    const switcher = document.getElementById('lang-switcher');
    if (!switcher) return;

    const path = window.location.pathname;
    const isEn = path.includes('-en.html');
    
    // Determine target links for the toggle
    let greekHref = isEn ? path.replace('-en.html', '.html') : path;
    let engHref = isEn ? path : (path.endsWith('.html') ? path.replace('.html', '-en.html') : 'index-en.html');

    // Ensure links within the nav point to the correct language version
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (isEn && href && !href.includes('-en.html') && href.includes('.html')) {
        link.href = href.replace('.html', '-en.html');
      }
    });

    switcher.innerHTML = `
      <a href="${greekHref}" class="${!isEn ? 'active' : ''}">Ελληνικά</a> | 
      <a href="${engHref}" class="${isEn ? 'active' : ''}">English</a>
    `;
  })();

  // 2. Mobile Hamburger Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', menuToggle.classList.contains('active'));
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Performance: Team Image Placeholders
  // Uses an inline SVG to prevent Layout Shift (CLS) while images load.
  (function() {
    const placeholderData = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">'
      + '<rect width="100%" height="100%" fill="#0e0e0e"/>'
      + '<text x="50%" y="50%" fill="#e6e6e6" font-family="Space Grotesk" font-size="28" dominant-baseline="middle" text-anchor="middle">Fractal</text>'
      + '</svg>'
    );

    document.querySelectorAll('.team-card img').forEach(img => {
      const realSrc = img.getAttribute('src');
      img.src = placeholderData;
      img.style.objectFit = 'cover';

      if (realSrc) {
        const loader = new Image();
        loader.onload = () => { img.src = realSrc; };
        loader.src = realSrc;
      }
    });
  })();

  // 4. Stagger Animations (IntersectionObserver)
  const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -100px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = i * 80;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'scale(1) translateY(0)';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.service-card, .project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9) translateY(30px)';
    card.style.transition = 'opacity .6s ease-out, transform .6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    observer.observe(card);
  });

  // 5. Accessibility: Reduced Motion Support
  const bgVideo = document.getElementById('bg-video');
  if (bgVideo) {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReduceMotion = (e) => {
      const matches = e && typeof e.matches === 'boolean' ? e.matches : mq.matches;
      if (matches) {
        bgVideo.pause();
        bgVideo.style.display = 'none';
        // Note: poster logic follows your README-optimize suggestions
      } else {
        bgVideo.style.display = '';
        bgVideo.play().catch(() => {});
      }
    };
    handleReduceMotion(mq);
    mq.addEventListener('change', handleReduceMotion);
  }

  // 6. Project Card Interaction
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".project-card")
        .forEach(c => c !== card && c.classList.remove("active"));
      card.classList.toggle("active");
    });

    const overlay = card.querySelector(".project-overlay");
    if (overlay) {
      overlay.addEventListener("click", e => {
        e.stopPropagation();
        const link = card.dataset.link;
        if (link) window.open(link, "_blank");
      });
    }
  });
});