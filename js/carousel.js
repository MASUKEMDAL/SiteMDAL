// Hero Carousel functionality
class HeroCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.indicators = [];
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        this.init();
    }

    init() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        
        if (this.slides.length === 0) return;

        this.setupEventListeners();
        this.startAutoPlay();
    }

    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.stopAutoPlay();
                this.previousSlide();
                this.startAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.stopAutoPlay();
                this.nextSlide();
                this.startAutoPlay();
            });
        }

        // Indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
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
            if (e.key === 'ArrowLeft') {
                this.stopAutoPlay();
                this.previousSlide();
                this.startAutoPlay();
            } else if (e.key === 'ArrowRight') {
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
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlide();
    }

    previousSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateSlide();
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentSlide = index;
            this.updateSlide();
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

        // Add slide animation
        const activeSlide = this.slides[this.currentSlide];
        if (activeSlide) {
            activeSlide.style.animation = 'slideIn 0.5s ease-in-out';
            setTimeout(() => {
                activeSlide.style.animation = '';
            }, 500);
        }
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
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.heroCarousel = new HeroCarousel();
    window.heroCarousel.preloadImages();
});

// Export for use in other modules
window.HeroCarousel = HeroCarousel;