const docReady = (fn) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
};

docReady(() => {
  const currentYear = document.getElementById('current-year');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Reveal on scroll for elements with data-animate
  const animated = Array.from(document.querySelectorAll('[data-animate]'));
  if (animated.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    animated.forEach((el) => observer.observe(el));
  }

  // Animated counters in About section
  const counters = Array.from(document.querySelectorAll('[data-counter]'));
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const to = parseFloat(el.getAttribute('data-to') || '0');
        const suffix = el.getAttribute('data-suffix') || '';
        const durationMs = 1200;
        const start = performance.now();

        const tick = (now) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - t, 3);
          const value = Math.floor(eased * to);
          el.textContent = value.toLocaleString() + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.2 });

    counters.forEach((el) => countObserver.observe(el));
  }

  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('primary-menu');

  if (navToggle && navList) {
    const updateNavState = (expanded) => {
      navToggle.setAttribute('aria-expanded', String(expanded));
      navList.setAttribute('aria-hidden', String(!expanded));
    };

    updateNavState(false);

    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      updateNavState(!expanded);
    });

    navList.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        updateNavState(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        updateNavState(true);
      } else {
        updateNavState(false);
      }
    });
  }

  // Hero video: loop a specific segment between data-start and data-end
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo instanceof HTMLVideoElement) {
    const startAttr = heroVideo.getAttribute('data-start');
    const endAttr = heroVideo.getAttribute('data-end');

    const startTime = startAttr ? parseFloat(startAttr) : null;
    const endTime = endAttr ? parseFloat(endAttr) : null;

    if (startTime !== null && endTime !== null && endTime > startTime) {
      const seekToStart = () => {
        try {
          heroVideo.currentTime = startTime;
        } catch {}
      };

      heroVideo.addEventListener('loadedmetadata', () => {
        if (heroVideo.duration && startTime < heroVideo.duration) {
          seekToStart();
        }
      });

      heroVideo.addEventListener('timeupdate', () => {
        if (heroVideo.currentTime >= endTime - 0.05) {
          seekToStart();
          heroVideo.play().catch(() => {});
        }
      });
    }
  }

  // Gallery lightbox
  const galleryGrid = document.querySelector('[data-gallery-grid]');
  let lightbox = document.querySelector('[data-gallery-lightbox]');

  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.setAttribute('data-gallery-lightbox', '');
    lightbox.innerHTML = `
      <button class="gallery-lightbox__close" type="button" aria-label="Close gallery" data-lightbox-close>&times;</button>
      <button class="gallery-lightbox__nav gallery-lightbox__nav--prev" type="button" aria-label="Previous image" data-lightbox-prev>&lsaquo;</button>
      <img class="gallery-lightbox__image" src="" alt="Expanded gallery image" />
      <button class="gallery-lightbox__nav gallery-lightbox__nav--next" type="button" aria-label="Next image" data-lightbox-next>&rsaquo;</button>
      <div class="gallery-lightbox__caption" data-lightbox-caption></div>
    `;
    lightbox.style.display = 'none';
    document.body.appendChild(lightbox);
  }

  lightbox.classList.remove('is-visible');
  lightbox.style.display = 'none';

  if (galleryGrid && lightbox) {
    const buttons = Array.from(galleryGrid.querySelectorAll('.gallery-card__button'));
    const lightboxImage = lightbox.querySelector('.gallery-lightbox__image');
    const caption = lightbox.querySelector('[data-lightbox-caption]');
    const closeBtn = lightbox.querySelector('[data-lightbox-close]');
    const prevBtn = lightbox.querySelector('[data-lightbox-prev]');
    const nextBtn = lightbox.querySelector('[data-lightbox-next]');

    const items = buttons.map((button) => {
      const full = button.getAttribute('data-full') || '';
      const text = button.getAttribute('data-caption') || button.querySelector('img')?.alt || '';
      return { full, caption: text };
    });

    let currentIndex = 0;

    const applyImage = (index) => {
      const item = items[index];
      if (!item) return;
      lightboxImage.src = item.full;
      lightboxImage.alt = item.caption;
      if (caption) {
        caption.textContent = item.caption;
      }
    };

    const openLightbox = (index) => {
      currentIndex = (index + items.length) % items.length;
      applyImage(currentIndex);
      lightbox.style.display = 'grid';
      requestAnimationFrame(() => {
        lightbox.classList.add('is-visible');
        closeBtn?.focus();
      });
      document.body.classList.add('lightbox-open');
      document.addEventListener('keydown', onKeydown);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-visible');
      lightbox.style.display = 'none';
      document.body.classList.remove('lightbox-open');
      document.removeEventListener('keydown', onKeydown);
      if (lightboxImage) {
        lightboxImage.src = '';
        lightboxImage.alt = '';
      }
      if (caption) {
        caption.textContent = '';
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const showNext = () => {
      currentIndex = (currentIndex + 1) % items.length;
      applyImage(currentIndex);
    };

    const showPrev = () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      applyImage(currentIndex);
    };

    const onKeydown = (event) => {
      if (!lightbox.classList.contains('is-visible')) return;
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          closeLightbox();
          break;
        case 'ArrowRight':
          event.preventDefault();
          showNext();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          showPrev();
          break;
        default:
          break;
      }
    };

    buttons.forEach((button, idx) => {
      button.addEventListener('click', () => openLightbox(idx));
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(idx);
        }
      });
    });

    prevBtn?.addEventListener('click', showPrev);
    nextBtn?.addEventListener('click', showNext);
    closeBtn?.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    if (lightboxImage) {
      let pointerActive = false;
      let startX = 0;
      let startY = 0;

      const pointerDown = (event) => {
        pointerActive = true;
        const point = event.touches ? event.touches[0] : event;
        startX = point.clientX;
        startY = point.clientY;
      };

      const pointerMove = (event) => {
        if (!pointerActive) return;
        const point = event.touches ? event.touches[0] : event;
        const diffX = point.clientX - startX;
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            showPrev();
          } else {
            showNext();
          }
          pointerActive = false;
        }
      };

      const pointerUp = (event) => {
        if (!pointerActive) return;
        const point = event.changedTouches ? event.changedTouches[0] : event;
        const diffX = Math.abs(point.clientX - startX);
        const diffY = Math.abs(point.clientY - startY);
        pointerActive = false;

        if (diffX < 8 && diffY < 8) {
          closeLightbox();
        }
      };

      lightboxImage.addEventListener('pointerdown', pointerDown);
      lightboxImage.addEventListener('pointermove', pointerMove);
      lightboxImage.addEventListener('pointerup', pointerUp);
      lightboxImage.addEventListener('pointercancel', () => {
        pointerActive = false;
      });

      lightboxImage.addEventListener('touchstart', pointerDown, { passive: true });
      lightboxImage.addEventListener('touchmove', pointerMove, { passive: true });
      lightboxImage.addEventListener('touchend', pointerUp);
    }
  }
});

