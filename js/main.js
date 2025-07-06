// Main JavaScript functionality
class MDALWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleLoading();
        this.setupNavigation();
        this.setupScrollEffects();
        this.initializeComponents();
    }

    setupEventListeners() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.handleLoading();
        });

        // Window Load
        window.addEventListener('load', () => {
            this.hideLoadingScreen();
        });

        // Scroll Events
        window.addEventListener('scroll', () => {
            this.handleNavbarScroll();
            this.handleScrollAnimations();
        });

        // Resize Events
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            // Simulate loading time
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 2000);
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    setupNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    setupScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements with data-aos attribute
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    handleScrollAnimations() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    initializeComponents() {
        this.setupProductImageHovers();
        this.setupQuickViewButtons();
        this.setupMusicPlayer();
    }

    setupProductImageHovers() {
        const productImages = document.querySelectorAll('.product-image');
        
        productImages.forEach(image => {
            image.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1)';
            });
            
            image.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
            });
        });
    }

    setupQuickViewButtons() {
        const quickViewButtons = document.querySelectorAll('.btn-quick-view');
        
        quickViewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = button.closest('.product-card');
                const comprarBtn = productCard.querySelector('.comprar-btn');
                
                if (comprarBtn) {
                    comprarBtn.click();
                }
            });
        });
    }

    setupMusicPlayer() {
        const playButton = document.querySelector('.play-button');
        const spotifyLink = document.querySelector('.btn-spotify');
        
        if (playButton && spotifyLink) {
            playButton.addEventListener('click', () => {
                spotifyLink.click();
            });
        }
    }

    handleResize() {
        // Handle responsive adjustments
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (window.innerWidth > 768) {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        }
    }

    // Utility methods
    static formatPrice(price) {
        return `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the website
const website = new MDALWebsite();

// Export for use in other modules
window.MDALWebsite = MDALWebsite;