/**
 * O. Vivek Reddy - Personal Portfolio JS Code
 * Handcrafted & beginner-friendly vanilla JS for page interactivity.
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
  
  // Mobile Hamburger Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Modal Popup elements
  const demoTriggers = document.querySelectorAll('.demo-trigger');
  const demoModal = document.getElementById('demo-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn, .modal-close-action');
  
  // Contact Form elements
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitBtnText = submitBtn.querySelector('.btn-text');
  const submitSpinner = submitBtn.querySelector('.spinner');
  const successAlert = document.getElementById('form-success');
  const errorAlert = document.getElementById('form-error');

  // ==========================================================================
  // 2. Light / Dark Theme Switcher
  // ==========================================================================
  // Check browser storage for previous preference
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    body.className = currentTheme;
    if (currentTheme === 'light-theme') {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }

  // Toggle theme class on button click
  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light-theme')) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      themeIcon.className = 'fa-solid fa-moon';
      localStorage.setItem('theme', 'dark-theme');
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      themeIcon.className = 'fa-solid fa-sun';
      localStorage.setItem('theme', 'light-theme');
    }
  });

  // ==========================================================================
  // 3. Scroll Events (Sticky Navbar, Indicator Bar & Scroll Spy)
  // ==========================================================================
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update scroll progress bar width
    if (documentHeight > 0) {
      const scrollPercentage = (scrollTop / documentHeight) * 100;
      scrollProgress.style.width = `${scrollPercentage}%`;
    }

    // Toggle sticky scrolled header styles
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy: Track which section is active in view to highlight nav links
    const sections = document.querySelectorAll('section');
    let currentSectionId = 'home';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150; // offset for nav height
      const sectionHeight = section.offsetHeight;
      
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Update nav links classes
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // 4. Mobile Drawer Navigation Menu
  // ==========================================================================
  const toggleMenu = () => {
    const isOpen = mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  };

  const closeMenu = () => {
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
  };

  // Toggle drawer when hamburger is clicked
  mobileToggle.addEventListener('click', toggleMenu);

  // Close drawer when clicking any link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close drawer when clicking outside the navbar
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // ==========================================================================
  // 5. Contact Form Fields Validation
  // ==========================================================================
  if (contactForm) {
    // Utility email validator regex
    const isValidEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear previous error messages
      const errorContainers = contactForm.querySelectorAll('.form-input-container');
      errorContainers.forEach(container => container.classList.remove('error'));
      successAlert.classList.add('hidden');
      errorAlert.classList.add('hidden');

      let isFormValid = true;

      const nameField = document.getElementById('form-name');
      const emailField = document.getElementById('form-email');
      const messageField = document.getElementById('form-message');

      // Check name field
      if (!nameField.value.trim()) {
        nameField.parentElement.classList.add('error');
        isFormValid = false;
      }

      // Check email field
      if (!emailField.value.trim() || !isValidEmail(emailField.value.trim())) {
        emailField.parentElement.classList.add('error');
        isFormValid = false;
      }

      // Check message field
      if (!messageField.value.trim()) {
        messageField.parentElement.classList.add('error');
        isFormValid = false;
      }

      if (isFormValid) {
        // Show loading spinner
        submitBtn.disabled = true;
        submitBtnText.classList.add('hidden');
        submitSpinner.classList.remove('hidden');

        // Simulate form sending delay (1.5 seconds)
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtnText.classList.remove('hidden');
          submitSpinner.classList.add('hidden');
          
          successAlert.classList.remove('hidden');
          contactForm.reset();
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          // Auto hide success notice after 5 seconds
          setTimeout(() => {
            successAlert.classList.add('hidden');
          }, 5000);
        }, 1500);
      } else {
        // Show error notification block
        errorAlert.classList.remove('hidden');
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Reset error styling on text inputs change
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.parentElement.classList.remove('error');
      });
    });
  }

  // ==========================================================================
  // 6. Interactive Demo Popup Modal
  // ==========================================================================
  const toggleModalVisibility = (show) => {
    if (show) {
      demoModal.classList.remove('hidden');
      body.style.overflow = 'hidden'; // Stop main page scrolling
    } else {
      demoModal.classList.add('hidden');
      body.style.overflow = '';
    }
  };

  // Open modal on demo links click
  demoTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleModalVisibility(true);
    });
  });

  // Close modal when close triggers are clicked
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleModalVisibility(false);
    });
  });

  // Close modal when clicking outside card overlay
  demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal) {
      toggleModalVisibility(false);
    }
  });

  // Close modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !demoModal.classList.contains('hidden')) {
      toggleModalVisibility(false);
    }
  });
});
