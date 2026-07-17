/* ==========================================================================
   HOTEL ASTORIA ELITE — MASTER JAVASCRIPT FILE
   Vanilla JS only. No external libraries/frameworks.
   ==========================================================================
   TABLE OF CONTENTS
   1.  Utility Helpers
   2.  Page Loader
   3.  Scroll Progress Bar
   4.  Mouse Glow Effect
   5.  Sticky Navbar
   6.  Mobile Menu Toggle
   7.  Dark / Light Mode Toggle
   8.  Hero Gold Dust Particles
   9.  Typing Effect
   10. AOS-style Scroll Reveal Animations
   11. Counter Animation
   12. Rooms Filter
   13. Gallery Filter + Lightbox
   14. Image Slider
   15. Testimonial Slider
   16. FAQ Accordion
   17. Custom Date Picker
   18. Booking Form Logic (Stepper, Summary, Validation)
   19. Contact Form Validation
   20. Newsletter Form
   21. Back To Top Button
   22. Active Nav Link on Scroll
   23. Toast Notification Helper
   24. Init
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     1. UTILITY HELPERS
     ======================================================================== */
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);
  const debounce = (fn, wait = 100) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };
  const clamp = (num, min, max) => Math.max(min, Math.min(num, max));

  /* ========================================================================
     2. PAGE LOADER
     ======================================================================== */
  function initLoader() {
    const loader = qs('#loader');
    if (!loader) return;
    const finish = () => {
      loader.classList.add('loaded');
      document.body.classList.remove('no-scroll');
    };
    // Ensure a minimum display time for a premium feel
    const minTime = new Promise((res) => setTimeout(res, 1200));
    const pageLoaded = new Promise((res) => {
      if (document.readyState === 'complete') res();
      else window.addEventListener('load', res);
    });
    document.body.classList.add('no-scroll');
    Promise.all([minTime, pageLoaded]).then(finish);
    // Safety net in case something hangs
    setTimeout(finish, 4000);
  }

  /* ========================================================================
     3. SCROLL PROGRESS BAR
     ======================================================================== */
  function initScrollProgress() {
    const bar = qs('#scroll-progress');
    if (!bar) return;
    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    };
    on(window, 'scroll', update, { passive: true });
    update();
  }

  /* ========================================================================
     4. MOUSE GLOW EFFECT
     ======================================================================== */
  function initMouseGlow() {
    const glow = qs('#mouse-glow');
    if (!glow) return;
    if (window.matchMedia('(hover: none)').matches) return;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;

    on(window, 'mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      glow.style.opacity = '1';
    });

    on(document, 'mouseleave', () => {
      glow.style.opacity = '0';
    });

    function animate() {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ========================================================================
     5. STICKY NAVBAR
     ======================================================================== */
  function initStickyNavbar() {
    const navbar = qs('#navbar');
    if (!navbar) return;
    const update = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    on(window, 'scroll', update, { passive: true });
    update();
  }

  /* ========================================================================
     6. MOBILE MENU TOGGLE
     ======================================================================== */
  function initMobileMenu() {
    const hamburger = qs('.hamburger');
    const mobileMenu = qs('.mobile-menu');
    const overlay = qs('.menu-overlay');
    const closeBtn = qs('.mobile-menu-close');
    if (!hamburger || !mobileMenu) return;

    const openMenu = () => {
      hamburger.classList.add('active');
      mobileMenu.classList.add('active');
      overlay && overlay.classList.add('active');
      document.body.classList.add('no-scroll');
    };
    const closeMenu = () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      overlay && overlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
    };

    on(hamburger, 'click', () => {
      hamburger.classList.contains('active') ? closeMenu() : openMenu();
    });
    on(closeBtn, 'click', closeMenu);
    on(overlay, 'click', closeMenu);
    qsa('.mobile-menu a').forEach((a) => on(a, 'click', closeMenu));
  }

  /* ========================================================================
     7. DARK / LIGHT MODE TOGGLE
     ======================================================================== */
  function initThemeToggle() {
    const toggles = qsa('.theme-toggle');
    if (!toggles.length) return;

    const applyTheme = (theme) => {
      if (theme === 'light') {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
    };

    const saved = localStorage.getItem('astoria-theme');
    if (saved) {
      applyTheme(saved);
    } else {
      // Default to dark theme for luxury feel
      applyTheme('dark');
    }

    toggles.forEach((toggle) => {
      on(toggle, 'click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        localStorage.setItem('astoria-theme', isLight ? 'light' : 'dark');
      });
    });
  }

  /* ========================================================================
     8. HERO GOLD DUST PARTICLES
     ======================================================================== */
  function initGoldDust() {
    const container = qs('.hero-particles');
    if (!container) return;
    const count = window.innerWidth < 768 ? 18 : 36;
    for (let i = 0; i < count; i++) {
      const dust = document.createElement('span');
      dust.className = 'gold-dust';
      const left = Math.random() * 100;
      const size = Math.random() * 3 + 2;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 12;
      dust.style.left = left + '%';
      dust.style.width = size + 'px';
      dust.style.height = size + 'px';
      dust.style.animationDuration = duration + 's';
      dust.style.animationDelay = delay + 's';
      container.appendChild(dust);
    }
  }

  /* ========================================================================
     9. TYPING EFFECT
     ======================================================================== */
  function initTypingEffect() {
    const el = qs('#hero-typing');
    if (!el) return;
    const phrases = [
      'Where Timeless Elegance Meets Modern Comfort',
      'Experience Unparalleled Luxury & Service',
      'Your Sanctuary of Refined Living Awaits',
      'Five-Star Hospitality, Redefined'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.substring(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.substring(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 35 : 65);
    }
    type();
  }

  /* ========================================================================
     10. AOS-STYLE SCROLL REVEAL ANIMATIONS
     ======================================================================== */
  function initScrollReveal() {
    const items = qsa('[data-aos]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('aos-animate'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ========================================================================
     11. COUNTER ANIMATION
     ======================================================================== */
  function initCounters() {
    const counters = qsa('[data-counter]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-counter'));
      const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
      const duration = 2000;
      const startTime = performance.now();

      function update(now) {
        const progress = clamp((now - startTime) / duration, 0, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
        }
      }
      requestAnimationFrame(update);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => observer.observe(el));
  }

  /* ========================================================================
     12. ROOMS FILTER
     ======================================================================== */
  function initRoomsFilter() {
    const chips = qsa('.filter-chip[data-filter]');
    const cards = qsa('.room-card[data-category]');
    if (!chips.length || !cards.length) return;

    chips.forEach((chip) => {
      on(chip, 'click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter');

        cards.forEach((card) => {
          const category = card.getAttribute('data-category');
          const show = filter === 'all' || category === filter;
          if (show) {
            card.style.display = '';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.92)';
            setTimeout(() => {
              if (card.style.opacity === '0') card.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    cards.forEach((card) => {
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
  }

  /* ========================================================================
     13. GALLERY FILTER + LIGHTBOX
     ======================================================================== */
  function initGalleryFilter() {
    const chips = qsa('.gallery-filter .filter-chip[data-filter]');
    const items = qsa('.gallery-item[data-category]');
    if (!chips.length || !items.length) return;

    chips.forEach((chip) => {
      on(chip, 'click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter');

        items.forEach((item) => {
          const category = item.getAttribute('data-category');
          const show = filter === 'all' || category === filter;
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          if (show) {
            item.style.display = '';
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
              if (item.style.opacity === '0') item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  function initLightbox() {
    const lightbox = qs('#lightbox');
    const galleryItems = qsa('.gallery-item[data-full]');
    if (!lightbox || !galleryItems.length) return;

    const lightboxImg = qs('#lightbox-img');
    const lightboxCaption = qs('#lightbox-caption');
    const closeBtn = qs('.lightbox-close');
    const prevBtn = qs('.lightbox-prev');
    const nextBtn = qs('.lightbox-next');

    let currentIndex = 0;

    const openLightbox = (index) => {
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add('active');
      document.body.classList.add('no-scroll');
    };

    const updateLightbox = () => {
      const item = galleryItems[currentIndex];
      const fullSrc = item.getAttribute('data-full');
      const caption = item.getAttribute('data-caption') || '';
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = fullSrc;
        lightboxImg.alt = caption;
        lightboxCaption.textContent = caption;
        lightboxImg.style.opacity = '1';
      }, 150);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.classList.remove('no-scroll');
    };

    const showNext = () => {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateLightbox();
    };

    const showPrev = () => {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightbox();
    };

    galleryItems.forEach((item, index) => {
      on(item, 'click', () => openLightbox(index));
    });

    on(closeBtn, 'click', closeLightbox);
    on(nextBtn, 'click', showNext);
    on(prevBtn, 'click', showPrev);
    on(lightbox, 'click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    on(document, 'keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });

    lightboxImg.style.transition = 'opacity 0.15s ease';
  }

  /* ========================================================================
     14. IMAGE SLIDER (Homepage highlights)
     ======================================================================== */
  function initImageSlider() {
    const slider = qs('.image-slider');
    if (!slider) return;
    const wrapper = qs('.slider-wrapper', slider);
    const items = qsa('.slider-item', slider);
    const prevBtn = qs('.slider-arrow.prev', slider);
    const nextBtn = qs('.slider-arrow.next', slider);
    const dotsContainer = qs('.slider-controls', slider);
    if (!wrapper || !items.length) return;

    let index = 0;
    let autoTimer;

    // Build dots
    let dots = [];
    if (dotsContainer) {
      items.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        on(dot, 'click', () => goTo(i));
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    function update() {
      wrapper.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + items.length) % items.length;
      update();
      resetAuto();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 5500);
    }

    on(nextBtn, 'click', next);
    on(prevBtn, 'click', prev);
    resetAuto();
    update();
  }

  /* ========================================================================
     15. TESTIMONIAL SLIDER
     ======================================================================== */
  function initTestimonialSlider() {
    const slider = qs('.testimonial-slider');
    if (!slider) return;
    const track = qs('.testimonial-track', slider);
    const slides = qsa('.testimonial-slide', slider);
    const prevBtn = qs('.slider-arrow.prev', slider.parentElement);
    const nextBtn = qs('.slider-arrow.next', slider.parentElement);
    const dotsContainer = qs('.slider-controls', slider.parentElement);
    if (!track || !slides.length) return;

    let index = 0;
    let autoTimer;
    let dots = [];

    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        on(dot, 'click', () => goTo(i));
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
      resetAuto();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 6000);
    }

    on(nextBtn, 'click', next);
    on(prevBtn, 'click', prev);
    resetAuto();
  }

  /* ========================================================================
     16. FAQ ACCORDION
     ======================================================================== */
  function initFAQ() {
    const items = qsa('.faq-item');
    if (!items.length) return;

    items.forEach((item) => {
      const question = qs('.faq-question', item);
      on(question, 'click', () => {
        const isActive = item.classList.contains('active');
        items.forEach((i) => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }

  /* ========================================================================
     17. CUSTOM DATE PICKER
     ======================================================================== */
  function createDatePicker(inputEl, options = {}) {
    if (!inputEl) return null;
    const wrap = inputEl.closest('.datepicker-wrap');
    if (!wrap) return null;
    const picker = qs('.datepicker', wrap);
    if (!picker) return null;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    let selectedDate = null;
    const minDate = options.minDate || today;

    const header = qs('.datepicker-header h5', picker);
    const daysContainer = qs('.dp-days', picker);
    const prevBtn = qs('.dp-nav.prev', picker);
    const nextBtn = qs('.dp-nav.next', picker);

    function render() {
      header.textContent = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
      daysContainer.innerHTML = '';

      const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
      const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('span');
        empty.className = 'dp-day empty';
        daysContainer.appendChild(empty);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement('span');
        dayEl.className = 'dp-day';
        dayEl.textContent = d;
        const thisDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);

        if (thisDate < minDate) {
          dayEl.classList.add('disabled');
        }
        if (thisDate.getTime() === today.getTime()) {
          dayEl.classList.add('today');
        }
        if (selectedDate && thisDate.getTime() === selectedDate.getTime()) {
          dayEl.classList.add('selected');
        }

        on(dayEl, 'click', () => {
          if (dayEl.classList.contains('disabled')) return;
          selectedDate = thisDate;
          const formatted = thisDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          inputEl.value = formatted;
          inputEl.setAttribute('data-iso', thisDate.toISOString());
          picker.classList.remove('active');
          render();
          if (options.onSelect) options.onSelect(thisDate);
        });

        daysContainer.appendChild(dayEl);
      }
    }

    on(prevBtn, 'click', (e) => {
      e.stopPropagation();
      viewDate.setMonth(viewDate.getMonth() - 1);
      render();
    });
    on(nextBtn, 'click', (e) => {
      e.stopPropagation();
      viewDate.setMonth(viewDate.getMonth() + 1);
      render();
    });

    on(inputEl, 'click', (e) => {
      e.stopPropagation();
      qsa('.datepicker.active').forEach((p) => {
        if (p !== picker) p.classList.remove('active');
      });
      picker.classList.toggle('active');
    });

    on(document, 'click', (e) => {
      if (!wrap.contains(e.target)) {
        picker.classList.remove('active');
      }
    });

    render();

    return {
      getSelectedDate: () => selectedDate,
      setMinDate: (date) => { options.minDate = date; render(); }
    };
  }

  function initDatePickers() {
    const checkinInput = qs('#checkin-input');
    const checkoutInput = qs('#checkout-input');

    if (checkinInput) {
      const checkinPicker = createDatePicker(checkinInput, {
        onSelect: (date) => {
          if (checkoutInput) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            if (checkoutPicker) checkoutPicker.setMinDate(nextDay);
            const isoCheckout = checkoutInput.getAttribute('data-iso');
            if (!isoCheckout || new Date(isoCheckout) <= date) {
              checkoutInput.value = '';
              checkoutInput.removeAttribute('data-iso');
            }
          }
          updateBookingSummary();
        }
      });
      var checkoutPicker = checkoutInput ? createDatePicker(checkoutInput, {
        minDate: (() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(0,0,0,0); return d; })(),
        onSelect: updateBookingSummary
      }) : null;
    }

    // Simple hero search widget date fields (no linked logic needed, standalone)
    const heroCheckin = qs('#hero-checkin');
    const heroCheckout = qs('#hero-checkout');
    if (heroCheckin) createDatePicker(heroCheckin);
    if (heroCheckout) createDatePicker(heroCheckout, {
      minDate: (() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(0,0,0,0); return d; })()
    });
  }

  /* ========================================================================
     18. BOOKING FORM LOGIC (Stepper, Summary, Validation)
     ======================================================================== */
  const roomPrices = {
    'deluxe-king': { name: 'Deluxe King Room', price: 249, img: 'images/room-deluxe.svg' },
    'executive-suite': { name: 'Executive Suite', price: 429, img: 'images/room-executive.svg' },
    'royal-penthouse': { name: 'Royal Penthouse', price: 899, img: 'images/room-penthouse.svg' },
    'garden-view': { name: 'Garden View Room', price: 199, img: 'images/room-garden.svg' },
    'ocean-suite': { name: 'Ocean View Suite', price: 549, img: 'images/room-ocean.svg' },
    'family-room': { name: 'Family Luxury Room', price: 329, img: 'images/room-family.svg' }
  };

  let guestCount = { adults: 2, children: 0, rooms: 1 };

  function updateBookingSummary() {
    const roomSelect = qs('#room-type-select');
    const checkinInput = qs('#checkin-input');
    const checkoutInput = qs('#checkout-input');

    const summaryRoomName = qs('#summary-room-name');
    const summaryRoomImg = qs('#summary-room-img');
    const summaryNights = qs('#summary-nights');
    const summaryRate = qs('#summary-rate');
    const summarySubtotal = qs('#summary-subtotal');
    const summaryTax = qs('#summary-tax');
    const summaryTotal = qs('#summary-total');

    if (!roomSelect || !summaryTotal) return;

    const roomKey = roomSelect.value;
    const room = roomPrices[roomKey] || roomPrices['deluxe-king'];

    let nights = 1;
    const checkinIso = checkinInput ? checkinInput.getAttribute('data-iso') : null;
    const checkoutIso = checkoutInput ? checkoutInput.getAttribute('data-iso') : null;

    if (checkinIso && checkoutIso) {
      const d1 = new Date(checkinIso);
      const d2 = new Date(checkoutIso);
      const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
      nights = diff > 0 ? diff : 1;
    }

    const rooms = guestCount.rooms || 1;
    const subtotal = room.price * nights * rooms;
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    if (summaryRoomName) summaryRoomName.textContent = room.name;
    if (summaryRoomImg) summaryRoomImg.src = room.img;
    if (summaryNights) summaryNights.textContent = nights + (nights > 1 ? ' Nights' : ' Night');
    if (summaryRate) summaryRate.textContent = '$' + room.price + ' x ' + nights + ' x ' + rooms;
    if (summarySubtotal) summarySubtotal.textContent = '$' + subtotal.toFixed(2);
    if (summaryTax) summaryTax.textContent = '$' + tax.toFixed(2);
    if (summaryTotal) summaryTotal.textContent = '$' + total.toFixed(2);
  }

  function initBookingStepper() {
    const steppers = qsa('.stepper[data-guest-type]');
    if (!steppers.length) return;

    steppers.forEach((stepper) => {
      const type = stepper.getAttribute('data-guest-type');
      const decrementBtn = qs('.stepper-decrement', stepper);
      const incrementBtn = qs('.stepper-increment', stepper);
      const valueEl = qs('.stepper-value', stepper);
      const min = type === 'adults' || type === 'rooms' ? 1 : 0;
      const max = type === 'rooms' ? 5 : 8;

      const render = () => {
        valueEl.textContent = guestCount[type];
      };

      on(decrementBtn, 'click', () => {
        if (guestCount[type] > min) {
          guestCount[type]--;
          render();
          updateBookingSummary();
        }
      });

      on(incrementBtn, 'click', () => {
        if (guestCount[type] < max) {
          guestCount[type]++;
          render();
          updateBookingSummary();
        }
      });

      render();
    });
  }

  function initBookingRoomSelect() {
    const roomSelect = qs('#room-type-select');
    if (!roomSelect) return;
    on(roomSelect, 'change', updateBookingSummary);

    // Pre-select room if passed via URL query (?room=executive-suite)
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && roomPrices[roomParam]) {
      roomSelect.value = roomParam;
    }
    updateBookingSummary();
  }

  function initBookingFormValidation() {
    const form = qs('#booking-form');
    if (!form) return;

    const validators = {
      'booking-fullname': (val) => val.trim().length >= 3,
      'booking-email': (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'booking-phone': (val) => /^[0-9+\-\s()]{7,}$/.test(val),
      'checkin-input': (val) => val.trim().length > 0,
      'checkout-input': (val) => val.trim().length > 0
    };

    function validateField(field) {
      const validator = validators[field.id];
      if (!validator) return true;
      const group = field.closest('.form-group');
      const isValid = validator(field.value);
      if (group) {
        group.classList.toggle('invalid', !isValid);
      }
      return isValid;
    }

    Object.keys(validators).forEach((id) => {
      const field = qs('#' + id);
      if (field) {
        on(field, 'blur', () => validateField(field));
        on(field, 'input', () => {
          const group = field.closest('.form-group');
          if (group && group.classList.contains('invalid')) validateField(field);
        });
      }
    });

    on(form, 'submit', (e) => {
      e.preventDefault();
      let allValid = true;
      Object.keys(validators).forEach((id) => {
        const field = qs('#' + id);
        if (field && !validateField(field)) allValid = false;
      });

      if (allValid) {
        showToast('Booking request submitted successfully! We will confirm shortly.');
        form.reset();
        guestCount = { adults: 2, children: 0, rooms: 1 };
        qsa('.stepper[data-guest-type]').forEach((s) => {
          const type = s.getAttribute('data-guest-type');
          qs('.stepper-value', s).textContent = guestCount[type];
        });
        qsa('.datepicker-wrap input').forEach((inp) => {
          inp.value = '';
          inp.removeAttribute('data-iso');
        });
        updateBookingSummary();
      } else {
        showToast('Please complete all required fields correctly.', true);
      }
    });
  }

  /* ========================================================================
     19. CONTACT FORM VALIDATION
     ======================================================================== */
  function initContactForm() {
    const form = qs('#contact-form');
    if (!form) return;

    const validators = {
      'contact-name': (val) => val.trim().length >= 2,
      'contact-email': (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'contact-subject': (val) => val.trim().length >= 3,
      'contact-message': (val) => val.trim().length >= 10
    };

    function validateField(field) {
      const validator = validators[field.id];
      if (!validator) return true;
      const group = field.closest('.form-group');
      const isValid = validator(field.value);
      if (group) group.classList.toggle('invalid', !isValid);
      return isValid;
    }

    Object.keys(validators).forEach((id) => {
      const field = qs('#' + id);
      if (field) {
        on(field, 'blur', () => validateField(field));
        on(field, 'input', () => {
          const group = field.closest('.form-group');
          if (group && group.classList.contains('invalid')) validateField(field);
        });
      }
    });

    on(form, 'submit', (e) => {
      e.preventDefault();
      let allValid = true;
      Object.keys(validators).forEach((id) => {
        const field = qs('#' + id);
        if (field && !validateField(field)) allValid = false;
      });

      if (allValid) {
        showToast('Message sent successfully! We will get back to you soon.');
        form.reset();
      } else {
        showToast('Please fill in all fields correctly.', true);
      }
    });
  }

  /* ========================================================================
     20. NEWSLETTER FORM
     ======================================================================== */
  function initNewsletterForm() {
    const forms = qsa('.newsletter-form');
    forms.forEach((form) => {
      on(form, 'submit', (e) => {
        e.preventDefault();
        const input = qs('input', form);
        if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          showToast('Thank you for subscribing to Astoria Elite!');
          form.reset();
        } else {
          showToast('Please enter a valid email address.', true);
        }
      });
    });
  }

  /* ========================================================================
     21. BACK TO TOP BUTTON
     ======================================================================== */
  function initBackToTop() {
    const btn = qs('#back-to-top');
    if (!btn) return;

    const update = () => {
      if (window.scrollY > 500) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    };

    on(window, 'scroll', update, { passive: true });
    on(btn, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    update();
  }

  /* ========================================================================
     22. ACTIVE NAV LINK ON SCROLL (Homepage sections)
     ======================================================================== */
  function initActiveNavOnScroll() {
    const sections = qsa('section[id]');
    const navLinks = qsa('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const update = debounce(() => {
      let currentId = '';
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          currentId = section.id;
        }
      });
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
      });
    }, 50);

    on(window, 'scroll', update, { passive: true });
  }

  /* ========================================================================
     23. TOAST NOTIFICATION HELPER
     ======================================================================== */
  function showToast(message, isError = false) {
    let toast = qs('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${isError
          ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
          : '<path d="M20 6L9 17l-5-5"></path>'}
      </svg>
      <span>${message}</span>
    `;
    toast.style.background = isError ? 'linear-gradient(135deg,#e08a7a,#c96a59)' : '';
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }
  window.showToast = showToast;

  /* ========================================================================
     ROOM CARD "BOOK NOW" QUICK LINK (adds room param to booking.html)
     ======================================================================== */
  function initRoomBookLinks() {
    qsa('[data-book-room]').forEach((btn) => {
      on(btn, 'click', (e) => {
        const room = btn.getAttribute('data-book-room');
        if (btn.tagName === 'A') {
          btn.setAttribute('href', 'booking.html?room=' + encodeURIComponent(room));
        }
      });
    });
  }

  /* ========================================================================
     SEARCH WIDGET REDIRECT (Hero booking widget -> booking.html)
     ======================================================================== */
  function initHeroSearchWidget() {
    const form = qs('#hero-search-form');
    if (!form) return;
    on(form, 'submit', (e) => {
      e.preventDefault();
      const roomType = qs('#hero-room-type');
      const params = new URLSearchParams();
      if (roomType && roomType.value) params.set('room', roomType.value);
      window.location.href = 'booking.html' + (params.toString() ? '?' + params.toString() : '');
    });
  }

  /* ========================================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ======================================================================== */
  function initSmoothAnchorScroll() {
    qsa('a[href^="#"]').forEach((link) => {
      on(link, 'click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = qs(href);
        if (target) {
          e.preventDefault();
          const navHeight = qs('#navbar') ? qs('#navbar').offsetHeight : 0;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ========================================================================
     24. INIT — Run all modules once DOM is ready
     ======================================================================== */
  function init() {
    initLoader();
    initScrollProgress();
    initMouseGlow();
    initStickyNavbar();
    initMobileMenu();
    initThemeToggle();
    initGoldDust();
    initTypingEffect();
    initScrollReveal();
    initCounters();
    initRoomsFilter();
    initGalleryFilter();
    initLightbox();
    initImageSlider();
    initTestimonialSlider();
    initFAQ();
    initDatePickers();
    initBookingStepper();
    initBookingRoomSelect();
    initBookingFormValidation();
    initContactForm();
    initNewsletterForm();
    initBackToTop();
    initActiveNavOnScroll();
    initRoomBookLinks();
    initHeroSearchWidget();
    initSmoothAnchorScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
