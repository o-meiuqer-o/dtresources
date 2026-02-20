document.addEventListener('DOMContentLoaded', () => {
    // Restore scroll position
    const lastScroll = localStorage.getItem('lastScrollPosition');
    if (lastScroll) {
        window.scrollTo(0, parseInt(lastScroll));
    }

    // Save scroll position on scroll
    window.addEventListener('scroll', () => {
        localStorage.setItem('lastScrollPosition', window.scrollY);
    });

    // Intersection Observer for scroll animations
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.3
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Evaluation Framework Logic
    const checkboxes = document.querySelectorAll('.eval-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const dot = e.target.parentElement.querySelector('.status-dot');
            if (e.target.checked) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
            updateOverallProgress();
        });
    });

    function updateOverallProgress() {
        const total = checkboxes.length;
        const checked = document.querySelectorAll('.eval-checkbox:checked').length;
        const percentage = (checked / total) * 100;

        const feedback = document.getElementById('framework-feedback');
        if (percentage === 100) {
            feedback.textContent = "Perfect! Your problem statement is ready for the world.";
            feedback.style.color = "#00ca4e";
        } else if (percentage > 50) {
            feedback.textContent = "Getting there. Refine the remaining points.";
            feedback.style.color = "#ffb400";
        } else {
            feedback.textContent = "Keep refining your statement.";
            feedback.style.color = "#1d1d1f";
        }
    }
    // Modal Framework
    const toolCards = document.querySelectorAll('.tool-card');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('.modal-close');

    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                // Load video if it exists
                const iframe = modal.querySelector('iframe');
                if (iframe && iframe.hasAttribute('data-src')) {
                    iframe.src = iframe.getAttribute('data-src');
                }

                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            }
        });
    });

    function closeAllModals() {
        modals.forEach(modal => {
            modal.classList.remove('active');

            // Stop and unload YouTube videos
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                iframe.src = '';
            }
        });
        document.body.style.overflow = ''; // Restore scroll
    }

    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllModals();
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
});
