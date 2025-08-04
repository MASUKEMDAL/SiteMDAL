// Hero Carousel functionality
class HeroCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.indicators = [];
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 seconds
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        
        if (this.slides.length === 0) return;

        // Initialize first slide
        this.slides[0].classList.add('active');
        if (this.indicators[0]) {
            this.indicators[0].classList.add('active');
        }
        this.setupEventListeners();
        this.startAutoPlay();
        this.preloadImages();
    }

    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.stopAutoPlay();
                this.previousSlide();
                this.startAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.stopAutoPlay();
                this.nextSlide();
                this.startAutoPlay();
            });
        }

        // Indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.stopAutoPlay();
                this.goToSlide(index);
                this.startAutoPlay();
            });
        });

        // Pause on hover
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });

            carousel.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }

        // Touch/swipe support
        this.setupTouchEvents();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;
            const heroSection = document.querySelector('#hero');
            if (!heroSection) return;
            
            const heroRect = heroSection.getBoundingClientRect();
            const isHeroVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;
            
            if (isHeroVisible && e.key === 'ArrowLeft') {
                e.preventDefault();
                this.stopAutoPlay();
                this.previousSlide();
                this.startAutoPlay();
            } else if (isHeroVisible && e.key === 'ArrowRight') {
                e.preventDefault();
                this.stopAutoPlay();
                this.nextSlide();
                this.startAutoPlay();
            }
        });
    }

    setupTouchEvents() {
        const carousel = document.querySelector('.carousel-container');
        if (!carousel) return;

        let startX = 0;
        let endX = 0;
        let isDragging = false;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoPlay();
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            endX = e.touches[0].clientX;
            e.preventDefault(); // Prevent scrolling
        });

        carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;

            const threshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }

            this.startAutoPlay();
        });

        // Mouse drag support
        let mouseDown = false;
        let mouseStartX = 0;
        let mouseEndX = 0;

        carousel.addEventListener('mousedown', (e) => {
            mouseDown = true;
            mouseStartX = e.clientX;
            this.stopAutoPlay();
            carousel.style.cursor = 'grabbing';
            e.preventDefault(); // Prevent text selection
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;
            mouseEndX = e.clientX;
        });

        carousel.addEventListener('mouseup', () => {
            if (!mouseDown) return;
            mouseDown = false;
            carousel.style.cursor = 'grab';

            const threshold = 50;
            const diff = mouseStartX - mouseEndX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }

            this.startAutoPlay();
        });

        carousel.addEventListener('mouseleave', () => {
            mouseDown = false;
            carousel.style.cursor = 'grab';
            this.startAutoPlay();
        });
        
        // Set initial cursor
        carousel.style.cursor = 'grab';
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlide();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    previousSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateSlide();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        if (index >= 0 && index < this.slides.length) {
            this.isTransitioning = true;
            this.currentSlide = index;
            this.updateSlide();
            
            setTimeout(() => {
                this.isTransitioning = false;
            }, 300);
        }
    }

    updateSlide() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // Method to preload images for better performance
    preloadImages() {
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img && img.src) {
                const preloadImg = new Image();
                preloadImg.src = img.src;
            }
        });
    }
    
    // Method to pause carousel when page is not visible
    handleVisibilityChange() {
        if (document.hidden) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.heroCarousel = new HeroCarousel();
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (window.heroCarousel) {
            window.heroCarousel.handleVisibilityChange();
        }
    });
});

// Export for use in other modules
window.HeroCarousel = HeroCarousel;