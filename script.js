document.addEventListener('DOMContentLoaded', () => {
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
});
