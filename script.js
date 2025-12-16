// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Fade in animation for sections with staggered delays
function fadeInOnScroll() {
    const elements = document.querySelectorAll('.section, .project-card, .skill-category, .achievement-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in', 'visible');
        }
    });
    
    // Timeline items animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        const itemTop = item.getBoundingClientRect().top;
        const itemVisible = 100;
        
        if (itemTop < window.innerHeight - itemVisible) {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 200); // Staggered animation
        }
    });
    
    // Stat cards animation
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = 100;
        
        if (cardTop < window.innerHeight - cardVisible) {
            setTimeout(() => {
                card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
            }, index * 100);
        }
    });
}

// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', function () {
    navLinks.classList.toggle('show');
    mobileMenu.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        mobileMenu.classList.remove('active');
    });
});

// ==================== FORMSPREE CONTACT FORM ====================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');
    
    if (!contactForm) return;
    
    // Set reply-to field dynamically
    const emailField = document.getElementById('email');
    const replyToField = contactForm.querySelector('input[name="_replyto"]');
    
    if (emailField && replyToField) {
        emailField.addEventListener('input', function() {
            replyToField.value = this.value;
        });
    }
    
    // Form submission handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Form validation
        if (!validateForm()) {
            showFormStatus('Please fill all required fields correctly.', 'error');
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Send to Formspree
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                showFormStatus('✅ Message sent successfully! I\'ll reply within 24 hours.', 'success');
                contactForm.reset();
                
                // Optional: Send to Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_submit', {
                        'event_category': 'engagement',
                        'event_label': 'Contact Form'
                    });
                }
                
                // Auto-hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
                
            } else {
                // Formspree failed - fallback to mailto
                throw new Error('Formspree submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Fallback to mailto method
            showFormStatus('⚠️ Using fallback method...', 'info');
            
            setTimeout(() => {
                const name = encodeURIComponent(document.getElementById('name').value);
                const email = encodeURIComponent(document.getElementById('email').value);
                const subject = encodeURIComponent(document.getElementById('subject').value);
                const message = encodeURIComponent(document.getElementById('message').value);
                
                const mailtoBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
                const mailtoLink = `mailto:sandeepanandmca2026@gmail.com?subject=Portfolio Contact: ${subject}&body=${mailtoBody}`;
                
                // Show clickable link
                showFormStatus(
                    '❌ Could not send automatically. <br>' +
                    `<a href="${mailtoLink}" class="mailto-link">Click here to send via email</a>`,
                    'error'
                );
            }, 1000);
            
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    });
    
    // Form validation function
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Check empty fields
        if (!name || !email || !subject || !message) {
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormStatus('Please enter a valid email address.', 'error');
            return false;
        }
        
        // Message length validation
        if (message.length < 10) {
            showFormStatus('Message should be at least 10 characters.', 'error');
            return false;
        }
        
        return true;
    }
    
    // Show form status messages
    function showFormStatus(message, type) {
        if (!formStatus) return;
        
        formStatus.innerHTML = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        // Auto-hide error/info messages after 3 seconds
        if (type !== 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 3000);
        }
    }
});

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 9999;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .notification.success {
            background: #10b981;
            color: white;
            border-left: 4px solid #059669;
        }
        .notification.error {
            background: #ef4444;
            color: white;
            border-left: 4px solid #dc2626;
        }
        .notification-close {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            font-size: 1rem;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            to { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Close notification on button click
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Typing effect for hero tagline
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect after page loads
window.addEventListener('load', function () {
    const tagline = document.querySelector('.hero .tagline');
    const originalText = tagline.textContent;
    setTimeout(() => {
        typeWriter(tagline, originalText, 50);
    }, 1000);
});

// Add hover effects to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;

    if (hero) {
        hero.style.transform = `translate3d(0, ${rate}px, 0)`;
    }
});

// Active navigation highlighting
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Skills animation on scroll
const skillCategories = document.querySelectorAll('.skill-category');
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            entry.target.style.animationDelay = `${Array.from(skillCategories).indexOf(entry.target) * 0.1}s`;
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

skillCategories.forEach(category => {
    skillObserver.observe(category);
});

// Achievement cards animation
const achievementCards = document.querySelectorAll('.achievement-card');
const achievementObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            entry.target.style.animationDelay = `${Array.from(achievementCards).indexOf(entry.target) * 0.15}s`;
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

achievementCards.forEach(card => {
    achievementObserver.observe(card);
});

// Education timeline animation
const timelineObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.timeline-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 200);
            });
        }
    });
}, { threshold: 0.3 });

const educationSection = document.querySelector('.education');
if (educationSection) {
    timelineObserver.observe(educationSection);
}

// Stat cards counter animation
function animateCounters() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const countElement = card.querySelector('h3');
        const target = parseInt(countElement.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                countElement.textContent = target + '+';
                clearInterval(timer);
            } else {
                countElement.textContent = Math.floor(current) + '+';
            }
        }, 30);
    });
}

// Initialize counter animation when education section is in view
const educationObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            educationObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (educationSection) {
    educationObserver.observe(educationSection);
}

// Initialize scroll animations
window.addEventListener('scroll', fadeInOnScroll);
fadeInOnScroll(); // Run once on load

// Add loading animation
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
    
    // Add loading animation styles
    const style = document.createElement('style');
    style.textContent = `
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.5s ease;
        }
        body.loaded::before {
            opacity: 0;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
});

// Experience Section Animations
const experienceCards = document.querySelectorAll('.experience-card');

// Intersection Observer for experience cards
const experienceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Staggered animation for cards
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 200);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
});

// Observe experience cards
experienceCards.forEach(card => experienceObserver.observe(card));

// Add hover effect to experience cards
experienceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 25px 50px rgba(37, 99, 235, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('featured')) {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
        }
    });
});

// Add click to expand functionality for mobile
experienceCards.forEach(card => {
    const header = card.querySelector('.experience-header');
    const content = card.querySelector('.experience-content');
    
    header.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            card.classList.toggle('expanded');
            content.style.maxHeight = card.classList.contains('expanded') 
                ? content.scrollHeight + 'px' 
                : '0';
        }
    });
});

// Initialize max-height for mobile
if (window.innerWidth <= 768) {
    experienceCards.forEach(card => {
        const content = card.querySelector('.experience-content');
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.3s ease';
    });
}

// Add CSS for expanded state
const expandStyle = document.createElement('style');
expandStyle.textContent = `
    .experience-card.expanded .experience-content {
        max-height: 1000px !important;
        padding-top: 1rem;
    }
    
    @media (max-width: 768px) {
        .experience-header {
            cursor: pointer;
        }
        
        .experience-header::after {
            content: '▼';
            position: absolute;
            right: 1.5rem;
            color: var(--gray-400);
            transition: transform 0.3s ease;
        }
        
        .experience-card.expanded .experience-header::after {
            transform: rotate(180deg);
        }
    }
`;
document.head.appendChild(expandStyle);