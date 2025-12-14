
(function () {
  document.addEventListener("DOMContentLoaded", function () {
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
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌓';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    
    document.querySelector('.header-inner').appendChild(themeToggle);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
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
    // Check if we're running on file:// protocol
    const isFileProtocol = window.location.protocol === 'file:';

    if (isFileProtocol) {
      // Show the loading note for file:// protocol
      document.getElementById('loading-note').style.display = 'block';
      // For local file access, use a different approach or show a message
      console.warn('Running on file:// protocol. Dashboard data may not load due to browser security restrictions.');

      // Try to load data using a different method or show sample data
      setTimeout(() => {
        loadSampleData();
      }, 1000); // Small delay to show loading state
      return;
    }

    fetch('assets/data/data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        updateDashboard(data);
      })
      .catch(error => {
        console.error('Error loading dashboard data:', error);
        // Fallback to sample data
        console.log('Falling back to sample data...');
        loadSampleData();
      });
  }

  /**
   * Update dashboard with data
   */
  function updateDashboard(data) {
    try {
      // Update metrics immediately (no animation for dashboard)
      document.getElementById('totalClients').textContent = data.totalClients.toLocaleString();
      document.getElementById('avgRating').textContent = data.avgRating;
      document.getElementById('efficiencyGain').textContent = data.efficiencyGain + '%';
      document.getElementById('digitalToolsDeployed').textContent = data.additionalMetrics.digitalToolsDeployed.toLocaleString();
      document.getElementById('trainingSessions').textContent = data.additionalMetrics.trainingSessions.toLocaleString();
      document.getElementById('avgProjectDuration').textContent = data.additionalMetrics.avgProjectDuration;
      document.getElementById('clientRetentionRate').textContent = data.additionalMetrics.clientRetentionRate + '%';

      // Create projects chart
      const projectsCtx = document.getElementById('projectsChart').getContext('2d');
      new Chart(projectsCtx, {
        type: 'line',
        data: data.projectsData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Quarterly Project Completion',
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

      // Create satisfaction chart (now service distribution)
      const satisfactionCtx = document.getElementById('satisfactionChart').getContext('2d');
      new Chart(satisfactionCtx, {
        type: 'doughnut',
        data: data.satisfactionData,
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
              text: 'Service Distribution',
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
      "totalClients": 127,
      "avgRating": 4.8,
      "efficiencyGain": 38,
      "projectsData": {
        "labels": ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025"],
        "datasets": [{
          "label": "Projects Completed",
          "data": [18, 24, 31, 28, 35, 42],
          "borderColor": "#0066cc",
          "backgroundColor": "rgba(0, 102, 204, 0.1)",
          "tension": 0.4,
          "fill": true
        }]
      },
      "satisfactionData": {
        "labels": ["Strategy & Advisory", "Process Optimization", "Digital Tools", "Training & Enablement"],
        "datasets": [{
          "label": "Service Distribution",
          "data": [35, 28, 22, 15],
          "backgroundColor": [
            "#0066cc",
            "#0099ff",
            "#33aaff",
            "#66ccff"
          ],
          "hoverOffset": 4
        }]
      },
      "additionalMetrics": {
        "digitalToolsDeployed": 89,
        "trainingSessions": 156,
        "avgProjectDuration": 12,
        "clientRetentionRate": 94
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
    
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
})();
