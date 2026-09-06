document.addEventListener('DOMContentLoaded', () => {

  // Fallback function to reveal elements if AOS fails to load or run
  function revealAllAosElements() {
    console.warn("Revealing all data-aos elements as fallback.");
    document.querySelectorAll('[data-aos]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });
  }

  // 1. Initialize Lenis Smooth Scroll
  if (typeof Lenis !== 'undefined') {
    try {
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        infinite: false,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Connect Lenis to AOS scroll updates
      lenis.on('scroll', () => {
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      });

      // Link navbar clicks to Lenis scroll target
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            // Close bootstrap navbar collapse on mobile after clicking
            const navbarCollapse = document.getElementById('navbarNav');
            if (navbarCollapse && navbarCollapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
              try {
                const bootstrapCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bootstrapCollapse) {
                  bootstrapCollapse.hide();
                }
              } catch (bsErr) {
                console.error("Bootstrap close collapse error:", bsErr);
              }
            }
            
            lenis.scrollTo(targetElement, {
              offset: -80,
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }
        });
      });
    } catch (lenisErr) {
      console.error("Lenis initialization error:", lenisErr);
    }
  } else {
    console.warn("Lenis is not defined. Smooth scroll disabled.");
  }

  // 2. Custom Cursor Movement & Interaction
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');
  
  if (cursorGlow && cursorDot) {
    document.addEventListener('mousemove', (e) => {
      if (typeof gsap !== 'undefined') {
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.05, ease: 'power2.out' });
        gsap.to(cursorGlow, { x: e.clientX, y: e.clientY, duration: 0.25, ease: 'power2.out' });
      } else {
        // Plain JS Fallback for cursor positioning
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
      }
    });

    // Expand cursor hover effects
    const interactiveElements = document.querySelectorAll(
      'a, button, .btn-custom, .btn-outline-custom, .floating-tech-icon, .skill-badge, .project-card, .service-card, .process-step'
    );
    
    interactiveElements.forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(cursorDot, { scale: 3, backgroundColor: 'rgba(56, 189, 248, 0.85)', duration: 0.2 });
          gsap.to(cursorGlow, { scale: 1.4, duration: 0.2 });
        }
      });
      elem.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(cursorDot, { scale: 1, backgroundColor: '', duration: 0.2 });
          gsap.to(cursorGlow, { scale: 1, duration: 0.2 });
        }
      });
    });
  }

  // 3. Scroll Progress Indicator Bar
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  });

  // 4. Button Click Ripple Animation
  document.querySelectorAll('.btn-custom, .btn-outline-custom').forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // 5. Typed.js Typing Animation
  const typingElement = document.getElementById('typing-element');
  if (typingElement) {
    if (typeof Typed !== 'undefined') {
      try {
        new Typed('#typing-element', {
          strings: [
            'WordPress Developer',
            'Shopify Expert',
            'Frontend Developer',
            'UI/UX Designer',
            'SEO Friendly Websites',
            'Speed Optimization Expert',
            'Freelancer',
            'Problem Solver'
          ],
          typeSpeed: 55,
          backSpeed: 30,
          backDelay: 1800,
          loop: true,
          cursorChar: '|',
          autoInsertCss: true,
        });
      } catch (typedErr) {
        console.error("Typed.js initialization error:", typedErr);
        typingElement.innerText = "Senior Web Developer";
      }
    } else {
      console.warn("Typed.js is not defined. Using static fallback.");
      typingElement.innerText = "Senior Web Developer";
    }
  }

  // 6. AOS (Animate on Scroll) Setup
  if (typeof AOS !== 'undefined') {
    try {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom',
      });
    } catch (aosErr) {
      console.error("AOS initialization error:", aosErr);
      revealAllAosElements();
    }
  } else {
    console.warn("AOS library not loaded.");
    revealAllAosElements();
  }

  // 7. Swiper Portfolio Slider
  if (document.querySelector('.portfolio-slider-container')) {
    if (typeof Swiper !== 'undefined') {
      try {
        new Swiper('.portfolio-slider-container', {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: true,
          grabCursor: true,
          autoplay: {
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          },
          pagination: {
            el: '.portfolio-slider-container .swiper-pagination',
            clickable: true,
            dynamicBullets: true,
          },
          breakpoints: {
            576: {
              slidesPerView: 1.2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            }
          }
        });
      } catch (swiperErr) {
        console.error("Swiper initialization error:", swiperErr);
      }
    } else {
      console.warn("Swiper is not defined. Project slider might show as stack.");
    }
  }

  // 7.1 Swiper Testimonials Slider
  if (document.querySelector('.testimonials-slider-container')) {
    if (typeof Swiper !== 'undefined') {
      try {
        new Swiper('.testimonials-slider-container', {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: true,
          grabCursor: true,
          autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          },
          pagination: {
            el: '.testimonials-slider-container .swiper-pagination',
            clickable: true,
            dynamicBullets: true,
          },
          breakpoints: {
            576: {
              slidesPerView: 1.2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            }
          }
        });
      } catch (testSwiperErr) {
        console.error("Testimonials Swiper initialization error:", testSwiperErr);
      }
    }
  }

  // 8. Experience Counter Animation
  const counters = document.querySelectorAll('.counter-num');
  
  if (counters.length > 0) {
    const startCounting = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '+';
      let count = 0;
      const duration = 2000; // 2 seconds
      const intervalTime = 30;
      const step = (target / (duration / intervalTime));
      
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          clearInterval(timer);
          counter.innerText = target + suffix;
        } else {
          counter.innerText = Math.floor(count) + suffix;
        }
      }, intervalTime);
    };

    try {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startCounting(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => {
        counterObserver.observe(counter);
      });
    } catch (obsErr) {
      console.error("IntersectionObserver not supported. Running counters directly:", obsErr);
      counters.forEach(counter => startCounting(counter));
    }
  }

  // 9. Particles.js Configuration
  if (document.getElementById('particles-js')) {
    if (typeof particlesJS !== 'undefined') {
      try {
        particlesJS('particles-js', {
          "particles": {
            "number": {
              "value": 50,
              "density": {
                "enable": true,
                "value_area": 800
              }
            },
            "color": {
              "value": ["#38BDF8", "#6366F1", "#A78BFA"]
            },
            "shape": {
              "type": "circle",
              "stroke": {
                "width": 0,
                "color": "#000000"
              }
            },
            "opacity": {
              "value": 0.25,
              "random": true,
              "anim": {
                "enable": true,
                "speed": 0.8,
                "opacity_min": 0.05,
                "sync": false
              }
            },
            "size": {
              "value": 3,
              "random": true,
              "anim": {
                "enable": false
              }
            },
            "line_linked": {
              "enable": true,
              "distance": 160,
              "color": "#6366F1",
              "opacity": 0.12,
              "width": 1
            },
            "move": {
              "enable": true,
              "speed": 1.2,
              "direction": "none",
              "random": true,
              "straight": false,
              "out_mode": "out",
              "bounce": false,
              "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
              }
            }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": {
                "enable": true,
                "mode": "grab"
              },
              "onclick": {
                "enable": false
              },
              "resize": true
            },
            "modes": {
              "grab": {
                "distance": 150,
                "line_linked": {
                  "opacity": 0.35
                }
              }
            }
          },
          "retina_detect": true
        });
      } catch (partErr) {
        console.error("Particles.js error:", partErr);
      }
    } else {
      console.warn("Particles.js is not defined.");
    }
  }

  // 10. Active Navigation Menu Item Highlight on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link-custom');

  if (sections.length > 0 && navLinks.length > 0) {
    try {
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, { rootMargin: '-10% 0px -70% 0px' });

      sections.forEach(section => {
        navObserver.observe(section);
      });
    } catch (navObsErr) {
      console.error("Nav link highlighting Observer failed:", navObsErr);
    }
  }

  // 11. Parallax Scroll Effect for Hero Image, Blobs, and Floating Icons
  function handleHeroParallax() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // Only animate if hero section is visible (top of page)
    if (scrollY < window.innerHeight) {
      const items = [
        { selector: '.icon-wp', speedY: 0.12, rotateSpeed: 0.05 },
        { selector: '.icon-shopify', speedY: -0.08, rotateSpeed: -0.03 },
        { selector: '.icon-html', speedY: 0.15, rotateSpeed: 0.08 },
        { selector: '.icon-css', speedY: -0.12, rotateSpeed: -0.06 },
        { selector: '.icon-js', speedY: 0.08, rotateSpeed: 0.04 },
        { selector: '.icon-elementor', speedY: 0.14, rotateSpeed: 0.07 },
        { selector: '.icon-woo', speedY: -0.06, rotateSpeed: -0.02 }
      ];

      items.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) {
          el.style.transform = `translate3d(0, ${scrollY * item.speedY}px, 0) rotate(${scrollY * item.rotateSpeed}deg)`;
        }
      });

      const avatar = document.querySelector('.avatar-img');
      if (avatar) {
        avatar.style.transform = `translate3d(0, ${scrollY * 0.06}px, 0) rotate(${scrollY * -0.01}deg)`;
      }
      
      const blob = document.querySelector('.blob-bg');
      if (blob) {
        blob.style.transform = `translate3d(0, ${scrollY * 0.1}px, 0) scale(${1 + scrollY * 0.0001})`;
      }
      
      const circle = document.querySelector('.gradient-circle');
      if (circle) {
        circle.style.transform = `translate3d(0, ${scrollY * 0.04}px, 0)`;
      }
    }
  }
  
  window.addEventListener('scroll', handleHeroParallax);

  // GSAP animation for floating blob and floating icons
  if (typeof gsap !== 'undefined') {
    try {
      gsap.from('.avatar-img', {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.5
      });

      gsap.from('.floating-tech-icon', {
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'back.out(1.7)',
        delay: 0.8
      });
    } catch (gsapErr) {
      console.error("GSAP animations failed:", gsapErr);
    }
  }

  // 12. Refresh on window load & safety fallback check
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  });

  // Safety fallback: if AOS is delayed or blocked, ensure elements are shown
  setTimeout(() => {
    document.querySelectorAll('[data-aos]').forEach(el => {
      const computedOpacity = window.getComputedStyle(el).opacity;
      if (computedOpacity === '0') {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  }, 2500);

});
