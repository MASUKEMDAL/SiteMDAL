// Animation and visual effects
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupHoverEffects();
        this.setupCounterAnimations();
        this.initializeHallOfFame();
    }

    setupScrollAnimations() {
        // Enhanced intersection observer for scroll animations
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const animationType = element.getAttribute('data-aos') || 'fade-up';
                const delay = element.getAttribute('data-aos-delay') || 0;

                if (entry.isIntersecting) {
                    setTimeout(() => {
                        this.applyAnimation(element, animationType);
                    }, parseInt(delay));
                }
            });
        }, observerOptions);

        // Observe all elements with data-aos attributes
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => observer.observe(el));

        // Observe sections for additional effects
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => observer.observe(section));
    }

    applyAnimation(element, type) {
        element.classList.add('aos-animate');
        
        switch (type) {
            case 'fade-up':
                element.style.animation = 'fadeInUp 0.8s ease-out forwards';
                break;
            case 'fade-down':
                element.style.animation = 'fadeInDown 0.8s ease-out forwards';
                break;
            case 'fade-left':
                element.style.animation = 'fadeInLeft 0.8s ease-out forwards';
                break;
            case 'fade-right':
                element.style.animation = 'fadeInRight 0.8s ease-out forwards';
                break;
            case 'zoom-in':
                element.style.animation = 'zoomIn 0.8s ease-out forwards';
                break;
            case 'slide-up':
                element.style.animation = 'slideInUp 0.8s ease-out forwards';
                break;
            default:
                element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;

        const handleScroll = MDALWebsite.throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll);
    }

    setupHoverEffects() {
        // Enhanced product card hover effects
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateProductCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateProductCard(card, 'leave');
            });
        });

        // Plan card hover effects
        const planCards = document.querySelectorAll('.plan-card');
        
        planCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animatePlanCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animatePlanCard(card, 'leave');
            });
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.animateButton(button, 'enter');
            });
            
            button.addEventListener('mouseleave', () => {
                this.animateButton(button, 'leave');
            });
        });
    }

    animateProductCard(card, state) {
        const image = card.querySelector('.product-image');
        const overlay = card.querySelector('.product-overlay');
        
        if (state === 'enter') {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            
            if (overlay) {
                overlay.style.opacity = '1';
            }
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            
            if (image) {
                image.style.transform = 'scale(1)';
            }
            
            if (overlay) {
                overlay.style.opacity = '0';
            }
        }
    }

    animatePlanCard(card, state) {
        if (state === 'enter') {
            card.style.transform = 'translateY(-8px) scale(1.03)';
            card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
        } else {
            const isFeature = card.classList.contains('featured');
            card.style.transform = isFeature ? 'scale(1.05)' : 'translateY(0) scale(1)';
            card.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
        }
    }

    animateButton(button, state) {
        if (state === 'enter') {
            button.style.transform = 'translateY(-2px) scale(1.05)';
            button.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        } else {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = 'none';
        }
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = parseInt(element.getAttribute('data-duration')) || 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);

            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    initializeHallOfFame() {
        const hallOfFameMembers = [
            { 
                nome: "Crazy Dragon", 
                foto: "https://media.licdn.com/dms/image/v2/D4D03AQE_3zs32K8iHQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724450909764?e=1752105600&v=beta&t=w6dgSipS6wKDY9tHwy1VBmPAYoPnvUHWRGw6grVVOCg"
            },
            { 
                nome: "12 Bala", 
                foto: "https://media.licdn.com/dms/image/v2/D4D03AQHlT171zmr3rw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1722853292227?e=1752105600&v=beta&t=ne8cLntZlcWWAA5VdhhLw9dVo05kdK2o2g1T2I0DN3I"
            },
            { 
                nome: "Vizzky", 
                foto: "https://media.licdn.com/dms/image/v2/D4D03AQERZaB-vCUVyQ/profile-displayphoto-shrink_800_800/B4DZPCa3.jGgAc-/0/1734133645686?e=1752105600&v=beta&t=00YXVygqsBs3f4Wwn9vMJ4CKIUswwQcvFBlXAv_CTJI"
            },
            { 
                nome: "Samurai", 
                foto: "https://media.licdn.com/dms/image/v2/D4D03AQE3PEy3O__bDQ/profile-displayphoto-shrink_400_400/B4DZanGkaVGcAg-/0/1746560241098?e=1752105600&v=beta&t=DX4enLWyscV92a9PtntFW2fccfpiOei9t3kosQY-ihg"
            },
            { 
                nome: "Leitinho", 
                foto: "https://media.licdn.com/dms/image/v2/D4D03AQEg9Ur4fFXbTQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720365094005?e=1752105600&v=beta&t=chAE1N27xGgVlG0nBA8sMRyHn500bb2wl7_7kFNuZo0"
            },
            { 
                nome: "Laurão", 
                foto: "https://media.licdn.com/dms/image/v2/C4E03AQF78LT6C-O-RA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1650290231896?e=1752105600&v=beta&t=8kkHxYIF3J-n2tCqxCsaTbJsdL2Bx6pHgvMRHtrR6mI"
            },
            { 
                nome: "Kaminari", 
                foto: "https://media.licdn.com/dms/image/v2/D4D03AQEvrqH6rSb10A/profile-displayphoto-shrink_800_800/B4DZWdANrfHYAg-/0/1742095835938?e=1752105600&v=beta&t=CwabGPyPxucBFaL9Pfw9CyZ61P_o5jLN0BoVxi2QewM"
            },
            { 
                nome: "Cabeça", 
                foto: "https://media.licdn.com/dms/image/v2/D4D03AQFrREvxfyYfpA/profile-displayphoto-shrink_800_800/B4DZZuMX1pHIAc-/0/1745605459846?e=1752105600&v=beta&t=BoSV7zO88aZ5bjNEod8kUGKaA_7VrdPlTLj6fdRjaZk"
            }
        ];

        this.populateHallOfFame(hallOfFameMembers);
    }

    populateHallOfFame(members) {
        const container = document.getElementById('hall-da-fama-container');
        if (!container) return;

        container.innerHTML = '';

        members.forEach((member, index) => {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'hall-of-fame-item';
            memberDiv.setAttribute('data-aos', 'fade-up');
            memberDiv.setAttribute('data-aos-delay', (index * 100).toString());

            memberDiv.innerHTML = `
                <img src="${member.foto}" alt="${member.nome}" loading="lazy">
                <span class="nome">${member.nome}</span>
            `;

            container.appendChild(memberDiv);
        });

        // Re-observe new elements
        const newElements = container.querySelectorAll('[data-aos]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        this.applyAnimation(entry.target, 'fade-up');
                    }, parseInt(delay));
                }
            });
        });

        newElements.forEach(el => observer.observe(el));
    }

    // Utility method to create custom animations
    createCustomAnimation(element, keyframes, options = {}) {
        const defaultOptions = {
            duration: 1000,
            easing: 'ease-out',
            fill: 'forwards'
        };

        const animationOptions = { ...defaultOptions, ...options };

        if (element.animate) {
            return element.animate(keyframes, animationOptions);
        } else {
            // Fallback for older browsers
            console.warn('Web Animations API not supported');
            return null;
        }
    }

    // Method to add stagger effect to multiple elements
    staggerAnimation(elements, animationType, staggerDelay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.applyAnimation(element, animationType);
            }, index * staggerDelay);
        });
    }
}

// Add CSS animations if not already present
const addAnimationStyles = () => {
    if (document.querySelector('#animation-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'animation-styles';
    styles.textContent = `
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes zoomIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .aos-animate {
            opacity: 1;
        }

        [data-aos] {
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .loading-spinner {
            animation: spin 1s linear infinite;
        }

        .scroll-indicator {
            animation: bounce 2s infinite;
        }

        .hero-text {
            animation: fadeInUp 1s ease-out;
        }

        .hero-visual {
            animation: fadeInRight 1s ease-out 0.3s both;
        }
    `;

    document.head.appendChild(styles);
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    window.animationManager = new AnimationManager();
});

// Export for use in other modules
window.AnimationManager = AnimationManager;