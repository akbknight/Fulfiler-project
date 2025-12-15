
(function () {
  console.log('Script loaded, waiting for DOMContentLoaded');
  document.addEventListener("DOMContentLoaded", function () {
    console.log('DOMContentLoaded fired, initializing functions');
    initSmoothScroll();
    initMobileNav();
    initContactForm();
    setCurrentYear();
    initThemeToggle();
    initParallax();
    initLazyLoading();
    initAnimatedCounters();
    initDashboard();
    initTestimonialsCarousel();
    initScrollToTop();
  });

  /**
   * Smooth scroll for anchor links that start with '#'
   */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href").slice(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Close mobile navigation if open
          document.body.classList.remove("nav-open");
          const toggle = document.querySelector(".nav-toggle");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /**
   * Mobile navigation toggle
   */
  function initMobileNav() {
    const navToggle = document.querySelector(".nav-toggle");
    if (!navToggle) return;

    navToggle.addEventListener("click", function () {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  /**
   * example hai ye  contact form validation
   */
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const statusEl = document.getElementById("form-status");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      clearErrors();
      if (statusEl) {
        statusEl.textContent = "";
        statusEl.classList.remove("form-status--success", "form-status--error");
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      let isValid = true;

      if (!name) {
        showError("name", "Please enter your name.");
        isValid = false;
      }

      if (!email) {
        showError("email", "Please enter your email address.");
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError("email", "Please enter a valid email address.");
        isValid = false;
      }

      if (!message) {
        showError("message", "Please enter a brief message.");
        isValid = false;
      }

      if (!isValid) {
        if (statusEl) {
          statusEl.textContent = "Please fix the errors above and try again.";
          statusEl.classList.add("form-status--error");
        }
        return;
      }

      // Demo only: no real submit
      if (statusEl) {
        statusEl.textContent =
          "Thank you for reaching out. This demo form doesn’t send emails, but your validation is working!";
        statusEl.classList.add("form-status--success");
      }

      form.reset();
    });
  }

  function showError(fieldId, message) {
    const errorEl = document.getElementById("error-" + fieldId);
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearErrors() {
    const errorEls = document.querySelectorAll(".error-message");
    errorEls.forEach((el) => (el.textContent = ""));
  }

  function isValidEmail(value) {
    // Simple email pattern for demo purposes
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value);
  }

  /**
   * Set current year in footer
   */
  function setCurrentYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /**
   * Theme toggle functionality
   */
  function initThemeToggle() {
    console.log('initThemeToggle called');
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) {
      console.error('Theme toggle button not found');
      return;
    }

    console.log('Theme toggle button found:', themeToggle);

    // Check system preference first, then localStorage
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    console.log('Initial theme:', initialTheme, 'prefersDark:', prefersDark, 'savedTheme:', savedTheme);

    document.documentElement.setAttribute('data-theme', initialTheme);

    themeToggle.addEventListener('click', (e) => {
      console.log('Theme toggle clicked!');
      alert('Theme toggle clicked!'); // Temporary alert for testing
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      console.log('Switching from', currentTheme, 'to', newTheme);

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      console.log('Theme set to:', newTheme, 'data-theme attribute:', document.documentElement.getAttribute('data-theme'));

      // Add a subtle animation effect
      themeToggle.style.animation = 'none';
      setTimeout(() => {
        themeToggle.style.animation = 'pulse 0.3s ease';
      }, 10);
    });

    // Listen for system theme changes when no manual preference is saved
    if (!savedTheme) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
      });
    }
  }

  /**
   * Parallax scrolling effect
   */
  function initParallax() {
    const parallaxBg = document.querySelector('.parallax-bg');
    if (!parallaxBg) return;
    
    let ticking = false;

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      parallaxBg.style.transform = `translateY(${rate}px)`;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  /**
   * Lazy loading for images
   */
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /**
   * Animated counters for metrics (excluding dashboard)
   */
  function initAnimatedCounters() {
    const counters = document.querySelectorAll('.metric-value:not(.dashboard .metric-value)');
    
    function animateCounter(counter) {
      const target = parseInt(counter.textContent.replace(/\D/g, ''));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString();
        }
      }, 16);
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    
    counters.forEach(counter => observer.observe(counter));
  }

  /**
   * Dashboard initialization
   */
  function initDashboard() {
    console.log('Initializing dashboard...');

    // Show loading state
    const loadingEl = document.getElementById('dashboard-loading');
    const contentEl = document.getElementById('dashboard-content');

    if (loadingEl) loadingEl.style.display = 'block';
    if (contentEl) contentEl.style.display = 'none';

    // For now, load sample data immediately to test
    setTimeout(() => {
      loadSampleData();
    }, 500);
  }

  /**
   * Update dashboard with data
   */
  function updateDashboard(data) {
    console.log('Updating dashboard with data:', data);
    try {
      // Update metrics immediately (no animation for dashboard)
      document.getElementById('totalSellers').textContent = data.totalSellers.toLocaleString();
      document.getElementById('totalServiceProviders').textContent = data.totalServiceProviders.toLocaleString();
      document.getElementById('successfulMatches').textContent = data.successfulMatches.toLocaleString();
      document.getElementById('platformEfficiency').textContent = data.platformEfficiency + '%';
      document.getElementById('completedOrders').textContent = data.completedOrders.toLocaleString();
      document.getElementById('inProcessOrders').textContent = data.inProcessOrders.toLocaleString();
      document.getElementById('activeRequests').textContent = data.activeRequests.toLocaleString();
      document.getElementById('servicesProvided').textContent = data.servicesProvided.toLocaleString();

      // Create matches chart
      const matchesCtx = document.getElementById('projectsChart').getContext('2d');
      new Chart(matchesCtx, {
        type: 'line',
        data: data.matchesData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Monthly Successful Matches',
              color: 'var(--text-primary)',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'var(--text-secondary)'
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'var(--text-secondary)'
              }
            }
          },
          elements: {
            point: {
              backgroundColor: '#0066cc'
            }
          }
        }
      });

      // Create services chart
      const servicesCtx = document.getElementById('satisfactionChart').getContext('2d');
      new Chart(servicesCtx, {
        type: 'doughnut',
        data: data.servicesData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: 'var(--text-secondary)',
                padding: 20,
                usePointStyle: true
              }
            },
            title: {
              display: true,
              text: 'Services Distribution',
              color: 'var(--text-primary)',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          }
        }
      });

      // Hide loading, show content
      document.getElementById('dashboard-loading').style.display = 'none';
      document.getElementById('dashboard-content').style.display = 'block';
      
      console.log('Dashboard updated successfully');
    } catch (error) {
      console.error('Error updating dashboard:', error);
    }
  }
    } catch (error) {
      console.error('Error updating dashboard:', error);
      document.getElementById('dashboard-loading').innerHTML = '<p>Error displaying dashboard data</p>';
    }
  }

  /**
   * Load sample data as fallback
   */
  function loadSampleData() {
    const sampleData = {
      "totalSellers": 1247,
      "totalServiceProviders": 892,
      "successfulMatches": 3456,
      "activeRequests": 234,
      "completedOrders": 2891,
      "inProcessOrders": 156,
      "servicesProvided": 5678,
      "platformEfficiency": 94.2,
      "matchesData": {
        "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "datasets": [{
          "label": "Successful Matches",
          "data": [234, 345, 456, 567, 678, 789],
          "borderColor": "#0066cc",
          "backgroundColor": "rgba(0, 102, 204, 0.1)",
          "tension": 0.4,
          "fill": true
        }]
      },
      "servicesData": {
        "labels": ["Storage Space", "Packing Services", "Shipping Help", "Quality Check", "Inventory Mgmt", "Other"],
        "datasets": [{
          "label": "Services Distribution",
          "data": [35, 28, 22, 8, 5, 2],
          "backgroundColor": [
            "#0066cc",
            "#0099ff",
            "#33aaff",
            "#66ccff",
            "#99ccff",
            "#cceeff"
          ],
          "hoverOffset": 4
        }]
      },
      "additionalMetrics": {
        "avgMatchTime": "2.3 hours",
        "satisfactionRate": 96,
        "monthlyRevenue": "$45,230",
        "activeRegions": 12
      }
    };

    updateDashboard(sampleData);
  }

  /**
   * Testimonials carousel
   */
  function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const cards = track.children;
    const totalCards = cards.length;
    let currentIndex = 0;
    
    // Create dots
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('div');
      dot.className = 'testimonial-dot';
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.children;
    
    function updateDots() {
      Array.from(dots).forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
    
    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }
    
    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalCards;
      goToSlide(currentIndex);
    }
    
    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      goToSlide(currentIndex);
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto-play
    setInterval(nextSlide, 5000);
  }

  /**
   * Scroll to top button
   */
  function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });
    
  /**
   * Scroll to top button
   */
  function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });
    
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Initialize particle effect for hero section
   */
  function initParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: 1;
    `;
    hero.style.position = 'relative';
    hero.appendChild(particleContainer);

    // Create particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(0, 102, 204, ${Math.random() * 0.5 + 0.1});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      particleContainer.appendChild(particle);
    }
  }

  /**
   * Initialize intersection observer for scroll animations
   */
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

  /**
   * Initialize magnetic effect for buttons
   */
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /**
   * Initialize typing effect for hero text
   */
  function initTypingEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--accent)';

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        heroTitle.style.borderRight = 'none';
      }
    };

    setTimeout(typeWriter, 1000);
  }

  /**
   * Initialize ripple effect for buttons
   */
  function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Add CSS for ripple animation
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  // Initialize new features
  initParticleEffect();
  initScrollAnimations();
  initMagneticButtons();
  initTypingEffect();
  initRippleEffect();
})();
