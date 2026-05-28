/**
 * O. Vivek Reddy - Personal Portfolio JS Interactions
 * Date: 2026-05-28
 * Features:
 *   - Dark/Light Theme Switching (Local Storage memory)
 *   - Scroll Indicator & Sticky Navigation
 *   - Dynamic Typing Animation
 *   - Responsive Mobile Hamburger Drawer
 *   - Projects Category Filter
 *   - Scroll Reveal via Intersection Observer
 *   - Automated Skill-bar Progress Fills on Sight
 *   - Full Form Input Verification & Feedback alerts
 *   - Project Demo Dialog Modal
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. DOM Elements Querying
  // ==========================================================================
  const body = document.body;
  const header = document.getElementById('header');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  
  // Mobile Navigation
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Project Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  // Modals
  const demoTriggers = document.querySelectorAll('.demo-trigger');
  const demoModal = document.getElementById('demo-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn, .modal-close-action');
  
  // Contact Form
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitBtnText = submitBtn.querySelector('.btn-text');
  const submitSpinner = submitBtn.querySelector('.spinner');
  const successAlert = document.getElementById('form-success');
  const errorAlert = document.getElementById('form-error');

  // ==========================================================================
  // Interactive Particles Canvas Animation (Background FX)
  // ==========================================================================
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const maxParticles = 60; // Balanced performance index
    
    let mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }
        
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
          if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
            this.x += 2;
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 2;
          }
          if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
            this.y += 2;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 2;
          }
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    const initParticles = () => {
      particlesArray = [];
      let numberOfParticles = Math.min(maxParticles, Math.floor((canvas.width * canvas.height) / 18000));
      
      const isLight = document.body.classList.contains('light-theme');
      const baseColor = isLight ? 'rgba(109, 40, 217, 0.15)' : 'rgba(6, 182, 212, 0.18)';
      
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let directionX = (Math.random() * 0.6) - 0.3;
        let directionY = (Math.random() * 0.6) - 0.3;
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, baseColor));
      }
    };

    const connect = () => {
      let opacityValue = 1;
      const isLight = document.body.classList.contains('light-theme');
      const lineColor = isLight ? '109, 40, 217' : '6, 182, 212';
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 110) {
            opacityValue = 1 - (distance / 110);
            ctx.strokeStyle = `rgba(${lineColor}, ${opacityValue * 0.12})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    let animId;
    const animate = () => {
      if (window.scrollY < window.innerHeight) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update();
        }
        connect();
      }
      animId = requestAnimationFrame(animate);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    animate();
    
    document.getElementById('theme-toggle').addEventListener('click', () => {
      setTimeout(initParticles, 200);
    });
  }

  // ==========================================================================
  // 2. Dark / Light Theme Controller
  // ==========================================================================
  const initTheme = () => {
    // Check saved theme preference or system default
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    if (savedTheme === 'light') {
      body.classList.add('light-theme');
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      body.classList.remove('light-theme');
      themeIcon.className = 'fa-solid fa-moon';
    }
  };

  const toggleTheme = () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    
    // Save to storage
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    
    // Smooth transition rotation and icon swap
    themeIcon.style.transform = 'scale(0) rotate(180deg)';
    
    setTimeout(() => {
      if (isLight) {
        themeIcon.className = 'fa-solid fa-sun';
      } else {
        themeIcon.className = 'fa-solid fa-moon';
      }
      themeIcon.style.transform = 'scale(1) rotate(0deg)';
    }, 150);
  };

  themeToggle.addEventListener('click', toggleTheme);
  initTheme();

  // ==========================================================================
  // 3. Scroll Interactions: Sticky Nav, Indicator, Back-to-Top
  // ==========================================================================
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Calculate Scroll Progress Percentage
    const scrolledPercentage = (scrollTop / documentHeight) * 100;
    scrollProgress.style.width = `${scrolledPercentage}%`;
    
    // Sticky Header Addition
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Floating Back-to-Top Button Visibility
    if (scrollTop > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active Section Link Highlighting
    const sections = document.querySelectorAll('section');
    let currentActive = 'home';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentActive = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActive}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================================================
  // 4. Custom Typewriter Animation
  // ==========================================================================
  const typewriterElement = document.getElementById('typewriter');
  
  if (typewriterElement) {
    const roles = JSON.parse(typewriterElement.getAttribute('data-words'));
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Deleting is faster
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 120; // Natural typing speed
      }

      // Check endpoints
      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at full word
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        // Shift to next role word
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    };

    // Initiate
    setTimeout(type, 1000);
  }

  // ==========================================================================
  // 5. Mobile Hamburger Drawer Menu Toggle
  // ==========================================================================
  const toggleMobileMenu = () => {
    const isOpen = mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  };

  const closeMobileMenu = () => {
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
  };

  mobileToggle.addEventListener('click', toggleMobileMenu);

  // Close when nav links are selected
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu if user clicks outside of drawer
  document.addEventListener('click', (event) => {
    if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target) && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // 6. Project Card Categorized Filtering
  // ==========================================================================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          // Delay display change until transition completes
          setTimeout(() => {
            card.style.display = 'none';
          }, 350);
        }
      });
    });
  });

  // ==========================================================================
  // 7. Scroll Reveal & Skill Progress Fills (Intersection Observer)
  // ==========================================================================
  // Generic Section / Content Reveals
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // Skill Fill animation trigger
  const skillsSection = document.getElementById('skills');
  const skillProgressFills = document.querySelectorAll('.progress-bar-fill');
  
  if (skillsSection && skillProgressFills.length > 0) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillProgressFills.forEach(fill => {
            const width = fill.parentElement.previousElementSibling.querySelector('.skill-percentage').textContent;
            fill.style.width = width;
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    skillsObserver.observe(skillsSection);
  }

  // ==========================================================================
  // 8. Contact Form Validator and Handler
  // ==========================================================================
  if (contactForm) {
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const clearErrors = () => {
      const errorContainers = contactForm.querySelectorAll('.input-container');
      errorContainers.forEach(c => c.classList.remove('error'));
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      
      let isValid = true;
      
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');
      
      // Name validation
      if (!nameInput.value.trim()) {
        nameInput.closest('.input-container').classList.add('error');
        isValid = false;
      }
      
      // Email validation
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        emailInput.closest('.input-container').classList.add('error');
        isValid = false;
      }
      
      // Message validation
      if (!messageInput.value.trim()) {
        messageInput.closest('.input-container').classList.add('error');
        isValid = false;
      }
      
      if (isValid) {
        // Trigger simulated submission loading state
        submitBtn.disabled = true;
        submitBtnText.classList.add('hidden');
        submitSpinner.classList.remove('hidden');
        successAlert.classList.add('hidden');
        errorAlert.classList.add('hidden');
        
        setTimeout(() => {
          // Success Response
          submitBtn.disabled = false;
          submitBtnText.classList.remove('hidden');
          submitSpinner.classList.add('hidden');
          
          successAlert.classList.remove('hidden');
          contactForm.reset();
          
          // Scroll up inside form slightly to read the message
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          
          // Fade alert after 8 seconds
          setTimeout(() => {
            successAlert.classList.add('hidden');
          }, 8000);
        }, 1800);
      } else {
        errorAlert.classList.remove('hidden');
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        setTimeout(() => {
          errorAlert.classList.add('hidden');
        }, 5000);
      }
    });

    // Reset error boundary styling on manual typing adjustment
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.closest('.input-container').classList.remove('error');
      });
    });
  }

  // ==========================================================================
  // 9. Interactive Projects Mock Demo Modal Trigger
  // ==========================================================================
  const toggleModal = (modal, forceHide = false) => {
    if (forceHide) {
      modal.classList.add('hidden');
      body.style.overflow = '';
      return;
    }
    
    const isHidden = modal.classList.toggle('hidden');
    if (!isHidden) {
      body.style.overflow = 'hidden'; // Stop background scrolling
    } else {
      body.style.overflow = '';
    }
  };

  demoTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleModal(demoModal);
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => toggleModal(demoModal, true));
  });

  demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal) {
      toggleModal(demoModal, true);
    }
  });

  // Modal keyboard listeners
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !demoModal.classList.contains('hidden')) {
      toggleModal(demoModal, true);
    }
  });
});
