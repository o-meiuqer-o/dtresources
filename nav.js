/**
 * Design Thinking Course — Global Navigation
 * Renders a sidebar (desktop) / drawer (mobile) with all modules
 * and in-page section anchors for the current page.
 */

(function () {
    // ─── Site-map ───────────────────────────────────────────────────────────
    const SITE_MAP = [
        {
            label: 'Home',
            icon: '🏠',
            href: 'index.html',
            sections: [
                { label: 'Welcome', anchor: 'cover' },
                { label: 'Why This Course?', anchor: 'rationale' },
                { label: 'The Triad of Design', anchor: 'expectations' },
                { label: 'Begin the Journey', anchor: 'conclusion' },
            ],
        },
        {
            label: 'Module 01: Foundations',
            icon: '🧬',
            href: 'foundations.html',
            sections: [
                { label: 'Cover', anchor: 'cover' },
                { label: 'Cellular Logic', anchor: 'biological-nature' },
                { label: 'Natural Logic', anchor: 'response-to-stimuli' },
                { label: 'Design Spectrum', anchor: 'proleptic-power' },
                { label: 'Human Problem Solving', anchor: 'case-studies' },
                { label: 'Next Module', anchor: 'next-module' },
            ],
        },
        {
            label: 'Module 02: Genesis',
            icon: '🌱',
            href: 'introduction.html',
            sections: [
                { label: 'Cover', anchor: 'cover' },
                { label: "Johnny's Dilemma", anchor: 'johnny-story' },
                { label: 'Human Logic', anchor: 'human-logic' },
                { label: "Doctor's Loop", anchor: 'doctor-section' },
                { label: 'The Design Pillars', anchor: 'four-pillars' },
                { label: 'Conclusion', anchor: 'conclusion' },
            ],
        },
        {
            label: 'Module 03: Problem ID',
            icon: '🧠',
            href: 'finding_problem.html',
            sections: [
                { label: 'What is a Problem?', anchor: 'intro' },
                { label: 'Worth Solving?', anchor: 'worth-solving' },
                { label: 'Empathy', anchor: 'empathy' },
                { label: 'Empathy Tools', anchor: 'empathy-tools' },
                { label: 'System Mapping', anchor: 'problem-understanding' },
                { label: 'Problem Statement', anchor: 'problem-statement' },
                { label: 'Refining the Problem', anchor: 'definition-evaluation' },
                { label: 'Next Module', anchor: 'next-module' },
            ],
        },
        {
            label: 'Module 04: Ideation',
            icon: '💡',
            href: 'ideation.html',
            sections: [
                { label: 'Cover', anchor: 'cover' },
                { label: 'Divergent vs Convergent', anchor: 'divergent-convergent' },
                { label: 'Visual Ideation', anchor: 'visualization-tools' },
                { label: 'Structured Brainstorming', anchor: 'structured-tools' },
                { label: 'Lateral Methods', anchor: 'lateral-thinking' },
            ],
        },
        {
            label: 'Module 05: Prototyping',
            icon: '🧪',
            href: 'prototyping.html',
            sections: [
                { label: 'Cover', anchor: 'cover' },
            ],
        },
        {
            label: 'Module 05.1: Software Prototyping',
            icon: '💻',
            href: 'software_prototyping.html',
            sections: [
                { label: 'Cover', anchor: 'software-cover' },
                { label: 'Key Concepts', anchor: 'figma-concepts' },
                { label: 'Interactions', anchor: 'interactions' },
                { label: 'The Workflow', anchor: 'figma-workflow' },
                { label: 'Smart Animate', anchor: 'smart-animate' },
                { label: 'Beyond Figma', anchor: 'antigravity-guide' },
            ],
        },
        {
            label: 'Module 05.2: Mech Prototyping',
            icon: '⚙️',
            href: 'mech_prototyping.html',
            sections: [
                { label: 'Cover', anchor: 'cover' },
                { label: '3D Modeling', anchor: 'fusion360' },
                { label: 'Movement Conversions', anchor: 'movement-conversions' }
            ],
        },
    ];

    // ─── State ───────────────────────────────────────────────────────────────
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    let sidebarOpen = false;

    // ─── Build DOM ───────────────────────────────────────────────────────────
    function buildNav() {
        // Inject Hamburger button into the existing global-nav
        const globalNav = document.querySelector('.global-nav');
        if (globalNav) {
            const hamburger = document.createElement('button');
            hamburger.className = 'hamburger-btn';
            hamburger.setAttribute('aria-label', 'Toggle navigation menu');
            hamburger.setAttribute('id', 'hamburger-btn');
            hamburger.innerHTML = `<span></span><span></span><span></span>`;
            hamburger.addEventListener('click', toggleSidebar);
            globalNav.prepend(hamburger);
        }

        // Overlay (mobile backdrop)
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.id = 'nav-overlay';
        overlay.addEventListener('click', closeSidebar);
        document.body.appendChild(overlay);

        // Sidebar wrapper
        const sidebar = document.createElement('aside');
        sidebar.className = 'course-sidebar';
        sidebar.id = 'course-sidebar';
        sidebar.setAttribute('aria-label', 'Course navigation');

        // Sidebar header
        sidebar.innerHTML = `
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <span class="sidebar-logo-icon">🎓</span>
                    <div class="sidebar-logo-title">Design Thinking</div>
                </div>
                <button class="sidebar-close-btn" id="sidebar-close-btn" aria-label="Close navigation">✕</button>
            </div>
            <nav class="sidebar-nav" id="sidebar-nav"></nav>
        `;

        document.body.appendChild(sidebar);

        // Populate nav items
        const navEl = sidebar.querySelector('#sidebar-nav');
        SITE_MAP.forEach((module) => {
            const isCurrent = module.href === currentPage || 
                (currentPage === '' && module.href === 'index.html');
            const section = document.createElement('div');
            section.className = 'sidebar-module' + (isCurrent ? ' active' : '');

            // Module link row
            const moduleLink = document.createElement('a');
            moduleLink.className = 'sidebar-module-link';
            moduleLink.href = module.href;
            moduleLink.innerHTML = `
                <span class="sidebar-module-icon">${module.icon}</span>
                <span class="sidebar-module-label">${module.label}</span>
                ${isCurrent ? '<span class="sidebar-current-dot"></span>' : ''}
            `;

            section.appendChild(moduleLink);

            // In-page sections (only for the active page)
            if (isCurrent && module.sections && module.sections.length) {
                const sectionList = document.createElement('ul');
                sectionList.className = 'sidebar-sections';

                module.sections.forEach((s) => {
                    const li = document.createElement('li');
                    li.className = 'sidebar-section-item';
                    const a = document.createElement('a');
                    a.href = '#' + s.anchor;
                    a.textContent = s.label;
                    a.className = 'sidebar-section-link';
                    a.dataset.anchor = s.anchor;
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        scrollToSection(s.anchor);
                        // Close sidebar after clicking, on all devices
                        closeSidebar();
                    });
                    li.appendChild(a);
                    sectionList.appendChild(li);
                });

                section.appendChild(sectionList);
            }

            navEl.appendChild(section);
        });

        // Close button listener
        sidebar.querySelector('#sidebar-close-btn').addEventListener('click', closeSidebar);

        // Active section highlighting on scroll
        initScrollSpy();
    }

    // ─── Scroll to section ───────────────────────────────────────────────────
    function scrollToSection(anchor) {
        const target = document.getElementById(anchor);
        if (!target) return;

        // The scroll container is .scroll-container not window
        const container = document.querySelector('.scroll-container');
        if (container) {
            const navHeight = 70;
            const targetTop = target.offsetTop - navHeight;
            container.scrollTo({ top: targetTop, behavior: 'smooth' });
        } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // ─── Scroll Spy ──────────────────────────────────────────────────────────
    function initScrollSpy() {
        const container = document.querySelector('.scroll-container');
        if (!container) return;

        const sectionLinks = document.querySelectorAll('.sidebar-section-link[data-anchor]');
        if (!sectionLinks.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        sectionLinks.forEach((link) => {
                            link.classList.toggle('is-active', link.dataset.anchor === id);
                        });
                    }
                });
            },
            {
                root: container,
                threshold: 0.3,
                rootMargin: '-70px 0px -40% 0px',
            }
        );

        document.querySelectorAll('section[id]').forEach((sec) => observer.observe(sec));
    }

    // ─── Sidebar open / close ─────────────────────────────────────────────────
    function toggleSidebar() {
        sidebarOpen ? closeSidebar() : openSidebar();
    }

    function openSidebar() {
        sidebarOpen = true;
        document.getElementById('course-sidebar').classList.add('open');
        document.getElementById('nav-overlay').classList.add('active');
        document.getElementById('hamburger-btn').classList.add('open');
        document.body.classList.add('sidebar-open');
    }

    function closeSidebar() {
        sidebarOpen = false;
        document.getElementById('course-sidebar').classList.remove('open');
        document.getElementById('nav-overlay').classList.remove('active');
        document.getElementById('hamburger-btn').classList.remove('open');
        document.body.classList.remove('sidebar-open');
    }

    // ─── Init ────────────────────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildNav);
    } else {
        buildNav();
    }
})();
