(function () {
  const doc = document;
  const body = doc.body;

  // Mobile nav toggle
  const toggle = doc.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      body.classList.toggle('nav-open');
    });
  }

  // Cart counter
  let cartCount = 0;
  const cartCountEl = doc.querySelector('.cart-count');
  function updateCartCount() {
    if (cartCountEl) cartCountEl.textContent = String(cartCount);
  }
  doc.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.classList && target.classList.contains('add-to-cart')) {
      cartCount += 1;
      updateCartCount();
      // Micro feedback
      target.classList.add('adding');
      setTimeout(() => target.classList.remove('adding'), 300);
    }
  });

  // Reveal on scroll
  const revealEls = Array.from(doc.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // Lightbox modal for product images
  const lightbox = doc.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Product image';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    lightboxImg.alt = '';
  }

  doc.addEventListener('click', (e) => {
    const btn = e.target && (e.target.closest && e.target.closest('.image-btn'));
    if (btn && btn.querySelector('img')) {
      const img = btn.querySelector('img');
      openLightbox(img.src, img.alt);
    }
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  doc.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Product search/filter
  const searchInput = doc.getElementById('productSearch');
  const cards = Array.from(doc.querySelectorAll('.product-grid .card'));
  function filterProducts(query) {
    const q = query.trim().toLowerCase();
    cards.forEach((card) => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const category = (card.getAttribute('data-category') || '').toLowerCase();
      const text = card.textContent ? card.textContent.toLowerCase() : '';
      const match = !q || name.includes(q) || category.includes(q) || text.includes(q);
      card.style.display = match ? '' : 'none';
    });
  }
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterProducts(e.target.value);
    });
  }
})();
