/**
 * Residential Home Solutions - Main JavaScript
 * All accessibility and functionality improvements
 */

// Main initialization function
function initializeAll() {
    setCurrentYear();
    initializeMobileMenu();
    initializeHeaderScroll();
    highlightCurrentPage();
    initializeContactForm();
    initializeSmoothScroll();
    initializeLazyLoading();
    initSlideshow();
    handlePageSpecificFeatures();
    initializeDropdownAccessibility();
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAll();
});

/**
 * Set current year in footer
 */
function setCurrentYear() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Initialize mobile menu with accessibility features
 */
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!menuToggle || !navMenu) return;

    // Mobile menu toggle
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = navMenu.classList.contains('active');
        
        // Toggle menu
        navMenu.classList.toggle('active');
        
        // Update ARIA attribute
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle icon
        const icon = this.querySelector('i');
        if (icon) {
            if (!isExpanded) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu.classList.contains('active') && 
            !event.target.closest('.navbar') && 
            window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu when clicking normal links
    const navLinks = document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    function closeMobileMenu() {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }

        // Close all dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
            const dropdownIcon = dropdown.querySelector('.dropdown-toggle i');
            if (dropdownIcon) {
                dropdownIcon.style.transform = 'rotate(0deg)';
            }
        });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            // Reset dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
                const icon = dropdown.querySelector('.dropdown-toggle i');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        }
    });
}

/**
 * Initialize dropdown accessibility
 */
function initializeDropdownAccessibility() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        // Handle click for mobile
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = this.closest('.dropdown');
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown').forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                        const otherToggle = other.querySelector('.dropdown-toggle');
                        if (otherToggle) {
                            otherToggle.setAttribute('aria-expanded', 'false');
                        }
                        const otherIcon = other.querySelector('.dropdown-toggle i');
                        if (otherIcon) {
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                this.setAttribute('aria-expanded', !isExpanded);
                
                // Rotate chevron
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = !isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            }
        });

        // Handle keyboard navigation
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (window.innerWidth > 768) {
                    // On desktop, let the dropdown show on hover
                    return;
                }
                this.click();
            }
        });
    });

    // Close dropdowns when focus leaves
    document.addEventListener('focusin', function(e) {
        if (window.innerWidth <= 768) return;
        
        const isDropdownContent = e.target.closest('.dropdown');
        if (!isDropdownContent) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
}

/**
 * Header scroll effect
 */
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Highlight current page in navigation
 */
function highlightCurrentPage() {
    let currentPage = window.location.pathname.split('/').pop();

    if (currentPage === '' || currentPage === 'index.html' || currentPage === '/') {
        currentPage = 'index.html';
    }

    const allNavLinks = document.querySelectorAll('.nav-menu a');

    allNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Remove any existing active classes
        link.classList.remove('active');

        if (linkHref === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');

            // Highlight parent dropdown if exists
            const dropdown = link.closest('.dropdown');
            if (dropdown) {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.classList.add('active');
                    toggle.setAttribute('aria-current', 'page');
                }
            }
        }
    });
}

/**
 * Initialize contact form
 */
function initializeContactForm() {
    const quoteForm = document.getElementById('quoteForm');

    if (!quoteForm) return;

    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            service: document.getElementById('service')?.value || '',
            message: document.getElementById('message')?.value || ''
        };

        if (!formData.name || !formData.email || !formData.service || !formData.message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Here you would typically send the form data to a server
        alert(`Thank you, ${formData.name}! We'll contact you within 24 hours.`);

        quoteForm.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Initialize smooth scroll for anchor links
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.includes('.html#')) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header')?.offsetHeight || 100;
            
            window.scrollTo({
                top: target.offsetTop - headerHeight,
                behavior: 'smooth'
            });

            // Update URL without jumping
            history.pushState(null, null, href);
        });
    });
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                obs.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    images.forEach(img => observer.observe(img));
}

/**
 * Slideshow functionality
 */
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;
    let isPaused = false;

    function showSlide(index) {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        if (dots[index]) {
            dots[index].classList.add('active');
            dots[index].setAttribute('aria-selected', 'true');
        }

        // Update ARIA for dots
        dots.forEach((dot, i) => {
            dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });

        currentSlide = index;
        
        if (!isPaused) {
            resetInterval();
        }
    }

    function nextSlide() { 
        if (!isPaused) showSlide(currentSlide + 1); 
    }
    
    function prevSlide() { 
        if (!isPaused) showSlide(currentSlide - 1); 
    }

    function startInterval() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetInterval() {
        if (slideInterval) clearInterval(slideInterval);
        if (!isPaused) startInterval();
    }

    function pauseSlideshow() {
        isPaused = true;
        if (slideInterval) clearInterval(slideInterval);
    }

    function resumeSlideshow() {
        isPaused = false;
        startInterval();
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
        prevBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                prevSlide();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        nextBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
            }
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showSlide(index);
            }
        });
    });

    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', pauseSlideshow);
        slideshowContainer.addEventListener('mouseleave', resumeSlideshow);
        slideshowContainer.addEventListener('focusin', pauseSlideshow);
        slideshowContainer.addEventListener('focusout', resumeSlideshow);
    }

    startInterval();
}

/**
 * Page-specific features
 */
function handlePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'testimonials.html') {
        animateTestimonials();
    }
}

function animateTestimonials() {
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Initialize all features (export for use with dynamic content)
 */
window.initializeAll = initializeAll;
