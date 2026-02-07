document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  let currentSlideIndex = 0;

  function updateCurrentSlideIndex() {
    if (document.body.classList.contains('fullscreen-mode')) return;
    
    let minDistance = Infinity;
    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      if (distance < minDistance) {
        minDistance = distance;
        currentSlideIndex = index;
      }
    });
    updateActiveSlideClass();
  }

  function updateActiveSlideClass() {
    slides.forEach((slide, index) => {
      if (index === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }

      const slideNumberElement = slide.querySelector('.slide-number');
      if (slideNumberElement) {
        if (index > 0) { // Start numbering from the second slide (index 1)
          slideNumberElement.textContent = `${index + 1}`;
        } else {
          slideNumberElement.textContent = ''; // First slide (index 0) has no number
        }
      }
    });
  }

  function updateScale() {
    if (!document.body.classList.contains('fullscreen-mode')) {
      document.body.style.removeProperty('--scale-factor');
      return;
    }
    const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    document.body.style.setProperty('--scale-factor', scale);
  }

  function scrollToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    currentSlideIndex = index;
    updateActiveSlideClass();

    if (document.body.classList.contains('fullscreen-mode')) {
      // In fullscreen, CSS handles visibility/positioning based on .active class
    } else {
      slides[currentSlideIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }

  document.addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('fullscreen-mode')) {
        updateCurrentSlideIndex();
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'Enter':
      case 'PageDown':
        e.preventDefault();
        scrollToSlide(currentSlideIndex + 1);
        break;
      
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'Backspace':
      case 'PageUp':
        e.preventDefault();
        scrollToSlide(currentSlideIndex - 1);
        break;

      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullScreen();
        break;
        
      case 'Home':
        e.preventDefault();
        scrollToSlide(0);
        break;

      case 'End':
        e.preventDefault();
        scrollToSlide(slides.length - 1);
        break;
    }
  });

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      document.body.classList.add('fullscreen-mode');
      updateScale();
      window.addEventListener('resize', updateScale);
      // Ensure current slide is active and visible immediately
      updateActiveSlideClass(); 
    } else {
      document.body.classList.remove('fullscreen-mode');
      window.removeEventListener('resize', updateScale);
      // Re-align scroll position to current slide when exiting
      setTimeout(() => scrollToSlide(currentSlideIndex), 100);
    }
  });

  // Initial setup
  updateCurrentSlideIndex();
});