// Smooth scroll to a section when scroll-indicator is clicked or focused+Enter
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('.scroll-indicator')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  // Parallax effect for hero background (on scroll)
  const hero = document.querySelector('.hero-section');
  window.addEventListener('scroll', () => {
    if (hero) {
      const y = window.scrollY;
      hero.style.backgroundPosition = `center ${y * 0.3}px`;
    }
  });
  
  // Reveal sections on scroll
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  const revealOnScroll = () => {
    const trigger = window.innerHeight * 0.85;
    revealEls.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) el.classList.add('revealed');
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('DOMContentLoaded', revealOnScroll);
  
  // Animate menu items/cards
  const animateMenuItems = () => {
    const items = document.querySelectorAll('.menu-item-card');
    const trigger = window.innerHeight * 0.9;
    items.forEach((card, i) => {
      const top = card.getBoundingClientRect().top;
      if (top < trigger) {
        setTimeout(() => card.classList.add('revealed'), i * 60);
      }
    });
  };
  window.addEventListener('scroll', animateMenuItems);
  window.addEventListener('DOMContentLoaded', animateMenuItems);