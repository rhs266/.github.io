
// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                
                // Close all dropdowns
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            });
        });
        
        // Mobile dropdown toggle
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    const dropdown = this.parentElement;
                    dropdown.classList.toggle('active');
                    
                    // Close other dropdowns
                    document.querySelectorAll('.dropdown').forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                }
            });
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Contact form submission (for contact.html)
    const quoteForm = document.getElementById('quoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };
            
            // Basic validation
            if (!formData.name || !formData.email || !formData.service || !formData.message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For now, we'll show a success message
            alert(`Thank you, ${formData.name}! Your quote request has been submitted. We'll contact you within 24 hours at ${formData.email} or ${formData.phone}.`);
            
            // Reset the form
            quoteForm.reset();
            
            // Scroll to top (optional)
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scrolling for anchor links on the same page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal page anchors
            if (href === '#' || href.startsWith('#!')) return;
            
            // Check if it's a link to another page with anchor
            if (href.includes('.html#')) {
                // Let the browser handle navigation to another page
                return;
            }
            
            // Handle same-page anchor links
            e.preventDefault();
            
            const targetId = href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
                
                // Close dropdowns
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    });
    
    // Highlight active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
            
            // Also highlight parent dropdown if this is a services page
            if (currentPage.includes('windows') || currentPage.includes('doors') || currentPage === 'siding.html') {
                const dropdownToggle = document.querySelector('.dropdown-toggle');
                if (dropdownToggle) {
                    dropdownToggle.classList.add('active');
                }
            }
        } else {
            link.classList.remove('active');
        }
    });
    
    // Highlight nav links based on scroll position for single-page sections
    const sections = document.querySelectorAll('section[id]');
    const navLinksForScroll = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    function highlightNavLink() {
        let scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinksForScroll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Only run scroll highlighting on pages with sections (like index.html)
    if (sections.length > 3) { // Home page has multiple sections
        window.addEventListener('scroll', highlightNavLink);
    }
    
    // Simple image lazy loading for future use
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length > 0) {
        const imageOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px 50px 0px'
        };
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, imageOptions);
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Initialize slideshow
    initSlideshow();
    
    // Handle page-specific functionality
    handlePageSpecificFeatures();
});

// Slideshow functionality
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');
    
    if (slides.length === 0) return; // No slideshow on current page
    
    let currentSlide = 0;
    let slideInterval;
    
    // Show specific slide
    function showSlide(index) {
        // Ensure index is within bounds
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
        
        // Reset interval
        resetInterval();
    }
    
    // Next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Start automatic slideshow
    function startInterval() {
        slideInterval = setInterval(nextSlide, 3000); // Change slide every 5 seconds
    }
    
    // Reset interval
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    
    // Event listeners for buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Pause slideshow on hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slideshowContainer.addEventListener('mouseleave', () => {
            startInterval();
        });
    }
    
    // Initialize
    startInterval();
}

function handlePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Services page features
    if (currentPage === 'services.html' || currentPage === '') {
        // Add service category highlighting when scrolling to anchors
        const serviceSections = document.querySelectorAll('.service-detail-card');
        if (serviceSections.length > 0) {
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -70% 0px',
                threshold: 0
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        history.replaceState(null, null, `#${id}`);
                    }
                });
            }, observerOptions);
            
            serviceSections.forEach(section => {
                observer.observe(section);
            });
        }
    }
    
    // Testimonials page features
    if (currentPage === 'testimonials.html') {
        // Add animation to testimonial cards
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}
