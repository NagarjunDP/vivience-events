// --- DOM Elements ---
const loader = document.getElementById('loader');
const loaderVideo = document.getElementById('loaderVideo');
const mainContent = document.getElementById('mainContent');
const heroLogo = document.getElementById('heroLogo');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const cursor = document.querySelector('.cursor');
const statNumbers = document.querySelectorAll('.stat-number');
const animatedElements = document.querySelectorAll('.animate-on-scroll');
const selectEl = document.querySelector('select');

// --- Custom Cursor ---
if (window.innerWidth >= 1024) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const updateCursor = () => {
    // Smooth lag effect (approx 60ms feel)
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(updateCursor);
  };
  requestAnimationFrame(updateCursor);

  // Hover effect on links and buttons
  const hoverElements = document.querySelectorAll('a, button, select, input, textarea, .gallery-item, .service-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

// --- Loading Screen ---
// Play video once, then fade out
if (loaderVideo) {
  loaderVideo.addEventListener('ended', () => {
    hideLoader();
  });
  
  // Handle iOS/mobile where autoplay is blocked
  const playPromise = loaderVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay was prevented or failed
      hideLoader();
    });
  }
  
  // Fallback in case video fails to load or play
  setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
      hideLoader();
    }
  }, 6000); // 6 seconds max
} else {
  hideLoader();
}

function hideLoader() {
  loader.classList.add('fade-out');
  setTimeout(() => {
    document.body.classList.add('loaded');
    mainContent.classList.add('visible');
    
    // Fade in hero logo
    setTimeout(() => {
      if (heroLogo) heroLogo.classList.add('loaded');
    }, 400); // Wait a bit after main content slides up
    
    // Remove loader from DOM
    setTimeout(() => loader.remove(), 1000);
  }, 800); // Wait for fade out transition
}

// --- Navbar Scroll Effect ---
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- Mobile Menu ---
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- Active Nav Link (Simple ScrollSpy) ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
    }
  });
});

// --- Parallax Effect on Hero Logo ---
if (heroLogo) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      const offset = window.scrollY * 0.2;
      heroLogo.style.transform = `translateY(-${offset}px) scale(1)`;
    }
  });
}

// --- Hero Background Particles ---
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
  const particleCount = 25;

  for (let i = 0; i < particleCount; i++) {
    createParticle();
  }

  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random size between 2px and 5px
    const size = Math.random() * 3 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${100 + Math.random() * 20}vh`; // Start below viewport
    
    // Random animation duration between 10s and 25s
    const duration = Math.random() * 15 + 10;
    particle.style.animationDuration = `${duration}s`;
    
    // Random delay
    particle.style.animationDelay = `${Math.random() * 10}s`;
    
    particlesContainer.appendChild(particle);
  }
}

// --- Intersection Observer for Scroll Animations ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

animatedElements.forEach(el => observer.observe(el));

// --- Counter Animation ---
const statsSection = document.querySelector('.stats-strip');
let countersAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersAnimated) {
    countersAnimated = true;
    
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1500; // 1.5s
      const fps = 60;
      const totalFrames = (duration / 1000) * fps;
      const increment = target / totalFrames;
      
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.innerText = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target;
        }
      };
      
      updateCounter();
    });
  }
}, { threshold: 0.1 });

if (statsSection) {
  statsObserver.observe(statsSection);
}

// --- Form Select Color Fix ---
if (selectEl) {
  selectEl.addEventListener('change', function() {
    this.style.color = 'var(--white)';
  });
}

// --- Typewriter Effect ---
const typewriterEl = document.getElementById('typewriter');
if (typewriterEl) {
  const text = "Crafting Moments. Curating Memories.";
  let i = 0;
  // wait for loader to finish
  setTimeout(() => {
    function type() {
      if (i < text.length) {
        typewriterEl.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, 60); // typing speed
      } else {
        const cursor = document.querySelector('.typewriter-cursor');
        if (cursor) cursor.style.animation = 'blink 1s infinite';
      }
    }
    type();
  }, 2500);
}
