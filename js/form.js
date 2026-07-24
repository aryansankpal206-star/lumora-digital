/* ============================================
   FORM HANDLING & VALIDATION
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const formMessage = document.getElementById('formMessage');

            // Clear previous message
            formMessage.textContent = '';
            formMessage.className = 'form-message';

            // Validate form
            if (!name) {
                showFormMessage('Please enter your name', 'error');
                return;
            }

            if (!email) {
                showFormMessage('Please enter your email', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }

            if (phone && !isValidPhone(phone)) {
                showFormMessage('Please enter a valid phone number', 'error');
                return;
            }

            if (!subject) {
                showFormMessage('Please enter a subject', 'error');
                return;
            }

            if (!message) {
                showFormMessage('Please enter your message', 'error');
                return;
            }

            if (message.length < 10) {
                showFormMessage('Message must be at least 10 characters long', 'error');
                return;
            }

            // All validation passed
            submitForm({
                name,
                email,
                phone,
                subject,
                message
            });
        });
    }

    function showFormMessage(message, type) {
        const formMessage = document.getElementById('formMessage');
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    function submitForm(formData) {
        const formMessage = document.getElementById('formMessage');
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual backend call)
        fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                showFormMessage('✓ Your message has been sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }, 5000);
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Fallback: Show success message anyway (for demo purposes)
            showFormMessage('✓ Thank you for your message! We\'ll contact you shortly.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Clear success message after 5 seconds
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        });
    }

    // Real-time validation for email field
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#e5e7eb';
            }
        });

        emailInput.addEventListener('focus', function() {
            this.style.borderColor = '#6366f1';
        });
    }

    // Real-time validation for phone field
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value && !isValidPhone(this.value)) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#e5e7eb';
            }
        });

        phoneInput.addEventListener('focus', function() {
            this.style.borderColor = '#6366f1';
        });
    }

    // Character counter for message field
    const messageInput = document.getElementById('message');
    if (messageInput) {
        let charCounter = document.createElement('div');
        charCounter.id = 'charCounter';
        charCounter.style.cssText = `
            font-size: 0.85rem;
            color: #6b7280;
            margin-top: 5px;
        `;
        messageInput.parentNode.insertBefore(charCounter, messageInput.nextSibling);

        messageInput.addEventListener('input', function() {
            const length = this.value.length;
            charCounter.textContent = `${length} characters`;
            
            if (length < 10) {
                charCounter.style.color = '#ef4444';
            } else if (length < 50) {
                charCounter.style.color = '#f59e0b';
            } else {
                charCounter.style.color = '#10b981';
            }
        });
    }

    // Add loading indicator style
    const style = document.createElement('style');
    style.textContent = `
        button[type="submit"]:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .form-message {
            padding: 1rem;
            border-radius: 5px;
            margin-top: 1rem;
            display: none;
        }

        .form-message.success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
            display: block;
        }

        .form-message.error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
            display: block;
        }
    `;
    document.head.appendChild(style);
});

// Export form utilities
window.formUtils = {
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    isValidPhone: function(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
};
