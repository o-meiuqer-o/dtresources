// --- Persistence Logic ---
const STORAGE_PREFIX = 'dt-persistence-';
const PAGE_ID = window.location.pathname.split('/').pop() || 'index';
const STORAGE_KEY = STORAGE_PREFIX + PAGE_ID;

function saveTemplateData() {
    const data = {
        fields: [],
        sections: [],
        images: []
    };

    // 1. Core Fields (by index to handle non-ID fields)
    document.querySelectorAll('input, textarea, select').forEach((el, i) => {
        if (el.closest('.template-controls')) return;
        data.fields.push({
            index: i,
            value: el.value,
            checked: el.type === 'checkbox' || el.type === 'radio' ? el.checked : null
        });
    });

    // 2. Dynamic Sections
    document.querySelectorAll('.section-wrapper').forEach(sw => {
        const title = sw.querySelector('.section-title')?.textContent;
        const label = sw.querySelector('label')?.textContent;
        const value = sw.querySelector('textarea')?.value;
        data.sections.push({ title, label, value });
    });

    // 3. Images (Data URLs)
    document.querySelectorAll('.image-placeholder').forEach((ph, i) => {
        const img = ph.querySelector('.preview-img');
        if (img && img.src.startsWith('data:')) {
            data.images.push({ index: i, src: img.src });
        }
    });

    // 4. Special: Root Cause Analysis (vis-network)
    if (typeof nodes !== 'undefined' && typeof edges !== 'undefined' && typeof network !== 'undefined') {
        // Sync visual coordinates back to DataSet for persistence
        network.storePositions();
        data.rca = {
            nodes: nodes.get(),
            edges: edges.get()
        };
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Auto-save failed:', e);
    }
}

function loadTemplateData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
        const data = JSON.parse(raw);

        // 1. Restore Dynamic Sections
        (data.sections || []).forEach(s => {
            restoreSection(s.title, s.label, s.value);
        });

        // 2. Restore Fields
        const fields = document.querySelectorAll('input, textarea, select');
        (data.fields || []).forEach(f => {
            const el = fields[f.index];
            if (el) {
                if (f.checked !== null) el.checked = f.checked;
                else el.value = f.value;
                // Trigger auto-resize for textareas
                if (el.tagName === 'TEXTAREA') {
                    el.style.height = 'auto';
                    el.style.height = (el.scrollHeight) + 'px';
                }
            }
        });

        // 3. Restore Images
        const placeholders = document.querySelectorAll('.image-placeholder');
        (data.images || []).forEach(img => {
            const ph = placeholders[img.index];
            if (ph) displayImage(ph, img.src);
        });

        // 4. Special: Root Cause Analysis
        if (data.rca && typeof nodes !== 'undefined' && typeof edges !== 'undefined' && typeof network !== 'undefined') {
            nodes.clear();
            edges.clear();
            nodes.add(data.rca.nodes);
            edges.add(data.rca.edges);
            
            // Restore settings if any
            if (data.rca_settings) {
                const slider = document.getElementById('lengthSlider');
                if (slider) {
                    slider.value = data.rca_settings.nodeDistance;
                    if (typeof updateLineLength === 'function') {
                        updateLineLength(slider.value);
                    }
                }
            }

            if (typeof updateNodeColors === 'function') updateNodeColors();
            setTimeout(() => network.fit(), 200);
        }
    } catch (e) {
        console.error('Auto-load failed:', e);
    }
}

function restoreSection(title, label, value) {
    const sectionWrap = document.createElement('div');
    sectionWrap.className = 'section-wrapper';
    sectionWrap.innerHTML = `
        <div class="section-title">${title}</div>
        <button class="btn-remove" onclick="this.parentElement.parentElement.remove(); saveTemplateData();">×</button>
        <div class="field">
            ${label ? `<label>${label}</label>` : ''}
            <textarea placeholder="Enter details here...">${value || ''}</textarea>
        </div>
    `;
    document.body.appendChild(sectionWrap);
    
    // Add event listeners to new content
    const ta = sectionWrap.querySelector('textarea');
    ta.addEventListener('input', saveTemplateData);
    setupSectionHelp(); // Re-bind help
}

function resetTemplate() {
    if (confirm("Reset template and clear all your answers?")) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    }
}

function addSection() {
    const heading = prompt("Enter Section Heading:");
    if (!heading) return;

    const description = prompt("Enter Section Description (optional):");

    const sectionWrap = document.createElement('div');
    sectionWrap.className = 'section-wrapper';

    let html = `
        <div class="section-title">${heading}</div>
        <button class="btn-remove" onclick="this.parentElement.parentElement.remove(); saveTemplateData();">×</button>
        <div class="field">
            ${description ? `<label>${description}</label>` : ''}
            <textarea placeholder="Enter details here..."></textarea>
        </div>
    `;

    sectionWrap.innerHTML = html;
    document.body.appendChild(sectionWrap);
    
    // Wire up events
    sectionWrap.querySelector('textarea').addEventListener('input', saveTemplateData);
    setupSectionHelp();
    saveTemplateData();
}

function downloadAsPNG() {
    const btn = event ? (event.currentTarget || document.querySelector('.btn-primary')) : document.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Rendering...';
    btn.disabled = true;

    // Load html2canvas from CDN on first use
    const ensureLib = (callback) => {
        if (typeof html2canvas !== 'undefined') return callback();
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = callback;
        s.onerror = () => { alert('Could not load export library. Check your internet connection.'); restore(); };
        document.head.appendChild(s);
    };

    // 1. Hide UI chrome
    const controlsEl = document.querySelector('.template-controls');
    const disclaimerEl = document.querySelector('.template-disclaimer');
    const tableControls = document.querySelector('.table-controls');
    const extraUi = document.querySelectorAll('.toolbar, .note, .btn-remove, .btn-add-item');

    if (controlsEl) controlsEl.style.display = 'none';
    if (disclaimerEl) disclaimerEl.style.display = 'none';
    if (tableControls) tableControls.style.display = 'none';
    extraUi.forEach(el => el.style.display = 'none');

    // 2. Expand overflow containers
    const tableContainer = document.querySelector('.table-container');
    let savedOverflow = '';
    if (tableContainer) {
        savedOverflow = tableContainer.style.overflow;
        tableContainer.style.overflow = 'visible';
    }

    // 3. Force body to full scroll width (unconstrain table) BEFORE adjusting textareas
    const savedBodyMaxWidth = document.body.style.maxWidth;
    const savedBodyWidth = document.body.style.width;
    const computedW = document.body.scrollWidth;
    document.body.style.maxWidth = 'none';
    // Use the actual pixel width rather than max-content to prevent 100% width textareas from shrinking
    document.body.style.width = Math.max(computedW, document.body.offsetWidth) + 'px';

    // 4 & 5. Convert ALL textareas and cut-off inputs to divs
    // html2canvas notoriously struggles with natively rendering <textarea> contents (especially manual resizes or newlines),
    // so we permanently solve this by swapping them for identical-looking <div> elements before the screenshot.
    const inputsToRestore = [];
    document.querySelectorAll('input[type="text"], textarea').forEach(el => {
        if (el.tagName === 'TEXTAREA' || el.scrollWidth > el.clientWidth || el.value.length > 30) {
            const div = document.createElement('div');
            const style = window.getComputedStyle(el);
            div.textContent = el.value || el.placeholder || '';
            
            // Copy computed styles
            div.style.cssText = style.cssText;
            
            // Explicitly force auto height and wrap
            div.style.height = 'auto';
            div.style.minHeight = style.height; // At least as tall as it was drawn
            div.style.whiteSpace = 'pre-wrap';
            div.style.wordBreak = 'break-word';
            div.style.overflow = 'visible';
            div.style.boxSizing = 'border-box';
            
            // Ensure core visual styles carry over cleanly
            div.style.padding = style.padding;
            div.style.border = style.border;
            div.style.borderRadius = style.borderRadius;
            div.style.font = style.font;
            div.style.color = style.color;
            div.style.background = style.background;

            el.parentElement.insertBefore(div, el);
            
            // Hide original
            const savedDisplay = el.style.display;
            el.style.display = 'none';
            inputsToRestore.push({ el, div, savedDisplay });
        }
    });

    // 6. Special handling for vis-network (Root Cause Analysis)
    let savedNetworkSize = null;
    let savedNetworkStyle = null;
    const networkDiv = document.getElementById('mynetwork');
    if (networkDiv && typeof network !== 'undefined') {
        savedNetworkSize = { 
            width: networkDiv.style.width, 
            height: networkDiv.style.height,
            viewId: network.getViewPosition(),
            scale: network.getScale()
        };
        savedNetworkStyle = {
            border: networkDiv.style.border,
            background: networkDiv.style.background,
            boxShadow: networkDiv.style.boxShadow
        };
        
        // Hide borders for export
        networkDiv.style.border = 'none';
        networkDiv.style.background = 'transparent';
        networkDiv.style.boxShadow = 'none';

        network.fit();
        const scale = network.getScale();
        if (scale < 1) {
            const reqH = (networkDiv.offsetHeight / scale) + 100;
            const reqW = (networkDiv.offsetWidth / scale) + 100;
            networkDiv.style.height = reqH + 'px';
            networkDiv.style.width = reqW + 'px';
            network.setSize(reqW + 'px', reqH + 'px');
            network.redraw();
            network.fit();
        }
    }

    function restore() {
        document.body.style.maxWidth = savedBodyMaxWidth;
        document.body.style.width = savedBodyWidth;
        if (controlsEl) controlsEl.style.display = 'flex';
        if (disclaimerEl) disclaimerEl.style.display = 'block';
        if (tableControls) tableControls.style.display = 'flex';
        extraUi.forEach(el => el.style.display = '');

        if (tableContainer) tableContainer.style.overflow = savedOverflow;
        
        inputsToRestore.forEach(item => {
            item.el.style.display = item.savedDisplay || '';
            item.div.remove();
        });
        
        if (savedNetworkSize) {
            networkDiv.style.width = savedNetworkSize.width;
            networkDiv.style.height = savedNetworkSize.height;
            networkDiv.style.border = savedNetworkStyle.border;
            networkDiv.style.background = savedNetworkStyle.background;
            networkDiv.style.boxShadow = savedNetworkStyle.boxShadow;
            
            network.setSize(savedNetworkSize.width, savedNetworkSize.height);
            network.redraw();
            setTimeout(() => {
                network.moveTo({
                    position: savedNetworkSize.viewId,
                    scale: savedNetworkSize.scale,
                    animation: false
                });
            }, 50);
        }

        btn.innerHTML = originalText;
        btn.disabled = false;
    }

    // Let the layout reflow, then capture
    requestAnimationFrame(() => {
        setTimeout(() => {
            const pad = 40;
            const fullW = document.body.scrollWidth;
            const fullH = document.body.scrollHeight;

            ensureLib(() => {
                html2canvas(document.body, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    width: fullW,
                    height: fullH,
                    windowWidth: fullW,
                    windowHeight: fullH,
                    scrollX: 0,
                    scrollY: 0,
                    x: 0,
                    y: 0
                }).then(srcCanvas => {
                    // Create a padded canvas
                    const finalCanvas = document.createElement('canvas');
                    finalCanvas.width = srcCanvas.width + pad * 2 * 2; // pad * scale
                    finalCanvas.height = srcCanvas.height + pad * 2 * 2;
                    const ctx = finalCanvas.getContext('2d');
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
                    ctx.drawImage(srcCanvas, pad * 2, pad * 2);

                    // Trigger download
                    finalCanvas.toBlob(blob => {
                        if (!blob) { restore(); return; }
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = (document.title || 'template').replace(/[^a-zA-Z0-9 ]/g, '') + '.png';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(a.href);
                        }, 100);
                        restore();
                    }, 'image/png');
                }).catch(err => {
                    console.error('html2canvas error:', err);
                    restore();
                    alert('PNG export failed. Try again or use your browser\'s screenshot tool.');
                });
            });
        }, 200);
    });
}

// Image handling logic
function setupImagePlaceholders() {
    const placeholders = document.querySelectorAll('.image-placeholder:not(.active-placeholder)');
    placeholders.forEach(placeholder => {
        // Create UI for upload/camera
        placeholder.innerHTML = `
            <div class="image-controls">
                <button class="btn-image" onclick="triggerUpload(this)">📁 Upload</button>
                <button class="btn-image" onclick="triggerCamera(this)">📸 Camera</button>
            </div>
            <input type="file" accept="image/*" style="display:none" onchange="handleImage(this)">
            <p class="placeholder-text">Add a representative image</p>
            <video autoplay playsinline style="display:none; width:100\%; max-height:100\%; object-fit:cover; border-radius:8px;"></video>
            <canvas style="display:none;"></canvas>
        `;
        placeholder.classList.add('active-placeholder');
    });
}

function triggerUpload(btn) {
    const input = btn.closest('.image-placeholder').querySelector('input[type="file"]');
    input.click();
}

function triggerCamera(btn) {
    const placeholder = btn.closest('.image-placeholder');
    const video = placeholder.querySelector('video');
    const text = placeholder.querySelector('.placeholder-text');
    const controls = placeholder.querySelector('.image-controls');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            video.srcObject = stream;
            video.style.display = 'block';
            text.style.display = 'none';
            controls.innerHTML = `
                <button class="btn-image btn-primary" onclick="captureImage(this)">📸 Take Photo</button>
                <button class="btn-image" onclick="stopCamera(this)">❌ Cancel</button>
            `;
        }).catch(err => {
            alert("Camera access denied or not available. Use Upload instead.");
        });
    }
}

function captureImage(btn) {
    const placeholder = btn.closest('.image-placeholder');
    const video = placeholder.querySelector('video');
    const canvas = placeholder.querySelector('canvas');
    const stream = video.srcObject;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/png');
    displayImage(placeholder, dataUrl);
    stopCamera(btn);
}

function stopCamera(btn) {
    const placeholder = btn.closest('.image-placeholder');
    const video = placeholder.querySelector('video');
    const controls = placeholder.querySelector('.image-controls');
    const text = placeholder.querySelector('.placeholder-text');

    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';
    text.style.display = 'block';
    resetControls(controls);
}

function handleImage(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            displayImage(input.closest('.image-placeholder'), e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function displayImage(placeholder, src) {
    let img = placeholder.querySelector('.preview-img');
    if (!img) {
        img = document.createElement('img');
        img.className = 'preview-img';
        placeholder.appendChild(img);
    }
    img.src = src;
    img.style.display = 'block';
    placeholder.querySelector('.placeholder-text').style.display = 'none';
    saveTemplateData();
}

function resetControls(controls) {
    controls.innerHTML = `
        <button class="btn-image" onclick="triggerUpload(this)">📁 Upload</button>
        <button class="btn-image" onclick="triggerCamera(this)">📸 Camera</button>
    `;
}

// ===== Section Help Tooltip System =====
const SECTION_HELP = {
    // Proto-Persona
    'identity': {
        tip: 'Give your assumed user a face and name — it makes them memorable.',
        detail: 'Naming a proto-persona transforms abstract "users" into a concrete person your team can empathize with. Even though the details are assumed, a specific identity anchors team discussions and aligns decisions around a shared mental model.',
        why: 'Research shows named personas significantly reduce team drift and "self-referential design" — where designers unknowingly build for themselves instead of real users.'
    },
    'demographics': {
        tip: 'Age, location, environment — the context that shapes their world.',
        detail: 'Demographics provide the situational backdrop for understanding behavior. A 20-year-old college student in a metro city has very different constraints, access, and habits than a 55-year-old farmer in a rural area.',
        why: 'Context shapes behavior more than personality does. Two identical personality types in different environments will approach the same problem very differently.'
    },
    'demographics & context': {
        tip: 'Age, location, environment — the context that shapes their world.',
        detail: 'Demographics provide the situational backdrop for understanding behavior. A 20-year-old college student in a metro city has very different constraints, access, and habits than a 55-year-old farmer in a rural area.',
        why: 'Context shapes behavior more than personality does. Two identical personality types in different environments will approach the same problem very differently.'
    },
    'behaviors & attitudes': {
        tip: 'What you ASSUME they do and feel — to be validated later.',
        detail: 'Proto-personas capture your team\'s best guesses about user behaviors. Writing these down explicitly — rather than leaving them as unspoken assumptions — makes them testable hypotheses.',
        why: 'The primary value of a proto-persona is not accuracy; it\'s accountability. By writing assumptions down, you create a checklist of things to validate in real research.'
    },
    'assumptions to validate': {
        tip: 'The riskiest guesses — test these FIRST with real users.',
        detail: 'Not all assumptions carry equal risk. This section forces you to identify which beliefs, if wrong, would most damage your product direction. These should become the first interview or survey questions.',
        why: 'Design thinking is fundamentally about reducing uncertainty. Prioritizing risky assumptions ensures your limited research time targets the highest-impact unknowns.'
    },
    // Persona
    'goals & motivations': {
        tip: 'What they actually want — based on research, not guesses.',
        detail: 'Goals describe the desired end-state the user is working toward. Motivations explain the emotional or practical "why" behind those goals. Together, they define the job-to-be-done.',
        why: 'Products that align with user goals feel intuitive. Products that ignore them feel frustrating — no matter how polished the UI is.'
    },
    'frustrations & pain points': {
        tip: 'Real problems they voiced — the fuel for your design solutions.',
        detail: 'Frustrations represent unmet needs and broken workflows. These are the specific friction points where your design can create the most impact.',
        why: 'Pain points are the single best source of design opportunities. Every successful product solves a real frustration — not an imagined one.'
    },
    'behaviors & habits': {
        tip: 'Observed patterns — what they actually do (not what they say they do).',
        detail: 'Behavioral data comes from watching users in their natural context. This is critical because what people say they do and what they actually do are often very different.',
        why: 'Observational research catches the "say/do gap" — one of the biggest sources of design failure. Always trust observed behavior over self-reported behavior.'
    },
    'scenario': {
        tip: 'A narrative snapshot — show the persona in their natural context.',
        detail: 'A scenario builds a small narrative showing the persona encountering the problem in their everyday life. It serves as a team alignment tool and an empathy exercise.',
        why: 'Stories are the most powerful communication tool in design. A well-written scenario can instantly align a diverse team around a shared understanding of the problem space.'
    },
    // Empathy Map
    'user / persona': {
        tip: 'Who exactly are you mapping? Anchor the map to a specific person.',
        detail: 'An empathy map must be anchored to a single user (or persona) in a specific situation. Mapping "users in general" produces vague insights.',
        why: 'Specificity drives empathy. The more concrete and singular your subject, the deeper your team\'s understanding becomes.'
    },
    'the four quadrants': {
        tip: 'Says, Thinks, Does, Feels — the core lens into user experience.',
        detail: 'The four quadrants force you to separate observable facts (Says, Does) from inferred inner experience (Thinks, Feels). The magic happens when you compare across quadrants — contradictions between what users SAY and DO reveal the deepest insights.',
        why: 'Empathy maps were designed by XPLANE as a "putting yourself in the user\'s shoes" tool. The quadrant structure prevents teams from over-relying on one data type.'
    },
    'insights & contradictions': {
        tip: 'The gold — where Says vs. Does reveals hidden truths.',
        detail: 'Contradictions (e.g., "I always read reviews" but observed skipping past them) reveal subconscious habits and unspoken needs. These are often the most actionable findings.',
        why: 'Insight synthesis is where raw data becomes design direction. Without this step, empathy maps become filing cabinets of observations rather than launchpads for innovation.'
    },
    // Survey
    'survey objective': {
        tip: 'Define what you want to learn BEFORE writing any questions.',
        detail: 'A clear research question prevents survey bloat and ensures every question earns its place. If a question doesn\'t serve the objective, cut it.',
        why: 'Surveys with unclear objectives produce noisy data that\'s difficult to analyze. A focused survey of 8 questions outperforms a scattered survey of 30.'
    },
    'survey questions': {
        tip: 'Mix closed (scales/MCQ) and open-ended. Keep it under 10 minutes.',
        detail: 'Closed questions give you quantifiable data for patterns; open questions give you qualitative richness for understanding. The ideal survey alternates between both.',
        why: 'Survey fatigue dramatically reduces response quality after ~10 minutes. Shorter, focused surveys yield higher completion rates and more honest answers.'
    },
    'analysis plan': {
        tip: 'Plan how you\'ll use the data BEFORE collecting it.',
        detail: 'Deciding your analysis strategy upfront ensures you ask the right questions in the right format. If you plan to create personas, you need different data than if you plan to generate journey maps.',
        why: 'The most common survey mistake is collecting data you can\'t act on. An analysis plan prevents "now what?" paralysis after responses come in.'
    },
    // Journey & Empathy Map
    'journey context': {
        tip: 'Anchor the map — who is the user and what are they trying to do?',
        detail: 'Every journey map needs a protagonist and a goal. Without these, the map becomes a disconnected list of steps rather than an empathetic narrative.',
        why: 'Journey maps are storytelling tools. A clear protagonist and objective transforms a process diagram into an empathy-building experience.'
    },
    'the map': {
        tip: 'The full timeline — actions, thoughts, emotions across every stage.',
        detail: 'This combined journey + empathy map captures the complete experience across multiple dimensions simultaneously. Each column represents a stage; each row captures a different facet of the experience (actions, thoughts, speech, pain points, emotions).',
        why: 'Combining journey and empathy mapping in one view reveals correlations that separate tools miss — like discovering that the most painful moments correlate with specific actions or unspoken thoughts.'
    },
    'emotion graph': {
        tip: 'Quantify the emotional journey — where are the peaks and valleys?',
        detail: 'The emotion score (-10 to +10) creates a visual heartbeat of the experience. Peaks represent delight moments worth preserving; troughs represent pain points worth solving. The graph makes emotional patterns instantly scannable.',
        why: 'Emotion graphs help prioritize where to intervene. Fixing the deepest trough typically has more impact than enhancing the tallest peak.'
    },
    // Root Cause Analysis (parsed from visible text)
    'root cause analysis': {
        tip: 'Keep asking "Why?" to dig past symptoms to the real cause.',
        detail: 'Root cause analysis uses graphical tree diagrams to trace problem causality. Each level answers "Why did this happen?" for the level above it. The goal is to identify the systemic root cause — a change that would prevent the problem from ever recurring.',
        why: 'Treating symptoms feels productive but only provides temporary relief. RCA targets the one fundamental cause whose fix eliminates the entire chain of symptoms above it.'
    },
    // Problem Statement Evaluator
    'your problem statement': {
        tip: 'Write or paste your full problem statement here for evaluation.',
        detail: 'The problem statement is the single most important artifact of the Define phase. It encodes your understanding of who the user is, what they struggle with, why, and what success looks like.',
        why: 'A well-written problem statement acts as a compass for every downstream activity — ideation, prototyping, and testing. A flawed one sends the entire team in the wrong direction.'
    },
    'dimension 1 — human-centeredness': {
        tip: 'Is a real human at the centre — not a business metric or technology?',
        detail: 'IDEO and Stanford d.school define human-centeredness as beginning with real people in real situations. The statement must name a protagonist (persona), ground itself in observed needs, and acknowledge emotional experience — not just functional gaps.',
        why: 'Human-centered problem statements produce solutions people actually want. Business-centered ones produce products that look good in boardrooms but fail in the field.'
    },
    'dimension 2 — solution-agnosticism': {
        tip: 'Does the problem remain open to ANY solution — no embedded answers?',
        detail: 'Wedell-Wedellsborg (HBR, 2017) warns of the "Law of the Hammer" — framing problems to match solutions you already have. The "elevator speed" example shows how reframing from "slow elevator" to "boring wait" opens entirely different (and cheaper) solutions.',
        why: 'Solution-embedded problem statements kill creativity before ideation even begins. They turn brainstorming into rationalization of a pre-chosen path.'
    },
    'dimension 3 — frame quality': {
        tip: 'Has the problem been properly framed — with causes and context?',
        detail: 'Dorst (2011) argues that design thinking is fundamentally about frame creation — constructing a coherent narrative about WHY a problem exists. A well-framed statement includes a causal chain (because…), situational context, and evidence of having considered alternative framings.',
        why: 'The way you frame a problem determines which solutions become visible and which remain hidden. Frame creation is the most cognitively demanding — and most valuable — part of design.'
    },
    'dimension 4 — measurability': {
        tip: 'Can a neutral observer verify the problem exists and that you solved it?',
        detail: 'Drawing from Creswell (2014) and SMART criteria (Doran, 1981), a quality problem statement defines success in terms that are specific, measurable, and time-bound. "Improve user experience" is unmeasurable; "reduce task completion time by 40% within 2 weeks" is not.',
        why: 'Without measurable criteria, you cannot evaluate whether your solution actually worked — turning the design process from science into guesswork.'
    },
    'dimension 5 — scope calibration': {
        tip: 'Is it broad enough for creativity but narrow enough for action?',
        detail: 'Brown (2009) and Cross (2006) describe the design "sweet spot": a scope broad enough to admit 3+ fundamentally different solution types, yet narrow enough for a small team to make progress within a sprint (1-2 weeks).',
        why: 'Too broad ("fix healthcare") produces paralysis. Too narrow ("add a button") produces trivial solutions. The right scope enables both ambition and action.'
    },
    'dimension 6 — ethical & systemic awareness': {
        tip: 'Could solving this accidentally harm someone else?',
        detail: 'Buchanan (1992) placed design problems firmly in the "wicked problems" category — where solutions to one stakeholder can create problems for another. Papanek (1971) demanded that designers account for the social and ecological consequences of their work.',
        why: 'In interconnected systems, every solution creates ripples. Ethical awareness prevents the classic trap of "solving" a problem by shifting its burden to a less visible group.'
    },
    'reflective notes': {
        tip: 'Step back — what would you change about the statement?',
        detail: 'Reflection closes the evaluation loop. After scoring each dimension, identify the weakest criteria and attempt a reframing (Wedell-Wedellsborg technique): "What if the problem isn\'t what we think it is?"',
        why: 'Metacognition — thinking about your own thinking — is the hallmark of expert designers (Schön, 1983). Without explicit reflection, evaluation becomes a checkbox exercise rather than genuine learning.'
    },
    'academic references': {
        tip: 'The scholarly sources behind this evaluation framework.',
        detail: 'This evaluator synthesizes criteria from foundational texts spanning design theory, practice, research methodology, and innovation strategy.',
        why: 'Academic grounding distinguishes a rigorous evaluation from subjective opinion. Each criterion can be traced to a specific published framework.'
    },
    // Problem Statement Canvas
    'final problem statement': {
        tip: 'Combine your POV with measurable success criteria into one actionable statement.',
        detail: 'The final problem statement is the culmination of the entire canvas. It should encode WHO the user is, WHAT they struggle with, WHY (root cause), and HOW you will measure success. Use the formula: [User] experiences [Pain] because [Root Cause]. HMW help them [Outcome] so that [Measurable Criteria]?',
        why: 'This statement becomes the single artifact that guides your entire team through ideation, prototyping, and testing. Every design decision should be traceable back to this statement.'
    }
};

function setupSectionHelp() {
    // Create the help modal overlay (one shared instance)
    let overlay = document.querySelector('.help-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'help-overlay';
        overlay.innerHTML = '<div class="help-card"><button class="help-close">✕</button><h3></h3><p class="help-body"></p><div class="help-why"></div></div>';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('help-close')) {
                overlay.classList.remove('active');
            }
        });
    }

    const titles = document.querySelectorAll('.section-title');
    titles.forEach(el => {
        if (el.dataset.helpBound) return; // Don't double-bind
        el.dataset.helpBound = 'true';

        const text = el.textContent.replace(/[0-9]+\.\s*/g, '').replace(/ⓘ/g, '').trim().toLowerCase();
        const help = SECTION_HELP[text];
        if (!help) return;

        // Add hover tooltip
        const tip = document.createElement('span');
        tip.className = 'section-tip';
        tip.innerHTML = help.tip + '<span class="tip-click">Click for more detail →</span>';
        el.appendChild(tip);

        // Click opens detail modal
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = overlay.querySelector('.help-card');
            card.querySelector('h3').textContent = el.textContent.replace(/ⓘ/g, '').trim();
            card.querySelector('.help-body').textContent = help.detail;
            card.querySelector('.help-why').innerHTML = '<strong>Why this matters:</strong> ' + help.why;
            overlay.classList.add('active');
        });

        // Add "Add Item" button to the section if it follows a standard pattern
        // (i.e. if it has fields following it until the next section)
        if (!el.dataset.addBtnAdded && !document.body.classList.contains('canvas-template')) {
            const btn = document.createElement('button');
            btn.className = 'btn-add-item';
            btn.innerHTML = '➕ Add Field';
            btn.onclick = () => {
                const field = document.createElement('div');
                field.className = 'field';
                field.innerHTML = '<label>New Field</label><textarea placeholder="Enter details..."></textarea>';
                
                // Find insertion point: before next section-title or end of siblings
                let next = el.nextElementSibling;
                let lastField = el;
                while (next && !next.classList.contains('section-title') && !next.classList.contains('template-controls')) {
                    lastField = next;
                    next = next.nextElementSibling;
                }
                lastField.after(field);
            };
            el.after(btn);
            el.dataset.addBtnAdded = 'true';
        }
    });
}

// ===== Colour Palette System =====
const PALETTES = [
    {
        id: 'blue', name: 'Ocean',
        accent: '#0071e3', light: '#f0f7ff', bg: '#ffffff', sectionBg: '#f5f5f7',
        text: '#1d1d1f', muted: '#666', border: '#ddd',
        heading: '#0071e3', label: '#333', inputBg: '#ffffff', inputText: '#1d1d1f',
        cardBg: '#f8faff', linkColor: '#0071e3'
    },
    {
        id: 'coral', name: 'Coral',
        accent: '#e85d75', light: '#fff0f3', bg: '#fdf8f8', sectionBg: '#fdf2f4',
        text: '#3d1f24', muted: '#8a5a5a', border: '#f0c8d0',
        heading: '#c2185b', label: '#5c2e36', inputBg: '#fff8f9', inputText: '#3d1f24',
        cardBg: '#fff5f7', linkColor: '#e85d75'
    },
    {
        id: 'emerald', name: 'Forest',
        accent: '#00a676', light: '#ecfdf5', bg: '#f7fdfb', sectionBg: '#ecfdf5',
        text: '#14332a', muted: '#4a7a6a', border: '#a8dcc8',
        heading: '#047857', label: '#1e4037', inputBg: '#f8fffb', inputText: '#14332a',
        cardBg: '#f0fdf8', linkColor: '#00a676'
    },
    {
        id: 'violet', name: 'Lavender',
        accent: '#7c3aed', light: '#f5f0ff', bg: '#faf8ff', sectionBg: '#f3efff',
        text: '#2d1f54', muted: '#7a6a90', border: '#d4c4f0',
        heading: '#6d28d9', label: '#3d2e5a', inputBg: '#faf8ff', inputText: '#2d1f54',
        cardBg: '#f7f3ff', linkColor: '#7c3aed'
    },
    {
        id: 'sunset', name: 'Sunset',
        accent: '#e65100', light: '#fff3e0', bg: '#fffbf5', sectionBg: '#fff0e0',
        text: '#3e2208', muted: '#8a6a4a', border: '#f0d0a0',
        heading: '#bf360c', label: '#5c3a1a', inputBg: '#fffcf8', inputText: '#3e2208',
        cardBg: '#fff8ef', linkColor: '#e65100'
    },
    {
        id: 'teal', name: 'Teal',
        accent: '#0097a7', light: '#e0f7fa', bg: '#f5fdfe', sectionBg: '#e0f7fa',
        text: '#0e2f33', muted: '#4a7a80', border: '#a0d8e0',
        heading: '#00838f', label: '#1a3e42', inputBg: '#f8fffe', inputText: '#0e2f33',
        cardBg: '#eefafb', linkColor: '#0097a7'
    },
    {
        id: 'rose', name: 'Rose',
        accent: '#c2185b', light: '#fce4ec', bg: '#fef8fa', sectionBg: '#fce4ec',
        text: '#3b1220', muted: '#8a5a6a', border: '#f0b8c8',
        heading: '#ad1457', label: '#5c2040', inputBg: '#fff8fa', inputText: '#3b1220',
        cardBg: '#fef2f5', linkColor: '#c2185b'
    },
    {
        id: 'midnight', name: 'Midnight',
        accent: '#60a5fa', light: '#1e293b', bg: '#0f172a', sectionBg: '#1e293b',
        text: '#e2e8f0', muted: '#94a3b8', border: '#334155',
        heading: '#93c5fd', label: '#cbd5e1', inputBg: '#1e293b', inputText: '#e2e8f0',
        cardBg: '#1e293b', linkColor: '#60a5fa'
    }
];

function applyPalette(id) {
    const p = PALETTES.find(x => x.id === id) || PALETTES[0];
    const root = document.documentElement;

    // Set CSS custom properties
    root.style.setProperty('--template-accent', p.accent);
    root.style.setProperty('--template-accent-light', p.light);
    root.style.setProperty('--template-accent-border', p.accent);
    root.style.setProperty('--template-bg', p.bg);
    root.style.setProperty('--template-section-bg', p.sectionBg);
    root.style.setProperty('--template-note-bg', p.light);
    root.style.setProperty('--template-note-border', p.accent);
    root.style.setProperty('--template-text', p.text);
    root.style.setProperty('--template-text-muted', p.muted);
    root.style.setProperty('--template-border', p.border);

    // === Body ===
    document.body.style.background = p.bg;
    document.body.style.color = p.text;

    // === Headings ===
    document.querySelectorAll('h1').forEach(el => {
        el.style.color = p.heading;
    });
    document.querySelectorAll('.subtitle').forEach(el => {
        el.style.color = p.muted;
    });

    // === Section Titles ===
    document.querySelectorAll('.section-title').forEach(el => {
        el.style.borderBottomColor = p.accent;
        el.style.color = p.text;
    });

    // === Labels ===
    document.querySelectorAll('.field label, label').forEach(el => {
        el.style.color = p.label;
    });

    // === Inputs & Textareas ===
    document.querySelectorAll('input, textarea, select').forEach(el => {
        el.style.background = p.inputBg;
        el.style.color = p.inputText;
        el.style.borderColor = p.border;
    });

    // === Notes / Disclaimers ===
    document.querySelectorAll('.note').forEach(el => {
        el.style.background = p.light;
        el.style.borderLeftColor = p.accent;
        el.style.color = p.muted;
    });
    document.querySelectorAll('.template-disclaimer').forEach(el => {
        el.style.background = p.light;
        el.style.borderLeftColor = p.accent;
        el.style.color = p.text;
    });

    // === Table Headers ===
    document.querySelectorAll('th').forEach(el => {
        el.style.background = p.sectionBg;
        el.style.color = p.text;
        el.style.borderColor = p.border;
    });
    document.querySelectorAll('td').forEach(el => {
        el.style.borderColor = p.border;
        el.style.color = p.text;
    });

    // === Empathy Map Quadrants ===
    document.querySelectorAll('.quadrant').forEach(el => {
        el.style.background = p.cardBg;
        el.style.borderColor = p.border;
    });
    document.querySelectorAll('.quadrant h3').forEach(el => {
        el.style.color = p.accent;
    });

    // === Evaluation Items ===
    document.querySelectorAll('.eval-section h3').forEach(el => {
        el.style.color = p.accent;
    });
    document.querySelectorAll('.eval-item').forEach(el => {
        el.style.borderColor = p.border;
        el.style.background = p.cardBg;
    });
    document.querySelectorAll('.eval-item .eval-question strong').forEach(el => {
        el.style.color = p.text;
    });
    document.querySelectorAll('.eval-item .eval-question span').forEach(el => {
        el.style.color = p.muted;
    });

    // === Score Summary ===
    document.querySelectorAll('.score-summary').forEach(el => {
        el.style.background = p.sectionBg;
        el.style.color = p.text;
    });
    document.querySelectorAll('.score-bar').forEach(el => {
        el.style.background = p.border;
    });

    // === Grid/Cards ===
    document.querySelectorAll('.grid').forEach(el => {
        el.style.color = p.text;
    });

    // === Links ===
    document.querySelectorAll('a').forEach(el => {
        if (!el.closest('.template-controls') && !el.closest('.palette-dropdown')) {
            el.style.color = p.linkColor;
        }
    });

    // === Image Placeholders ===
    document.querySelectorAll('.image-placeholder').forEach(el => {
        el.style.background = p.cardBg;
        el.style.borderColor = p.border;
    });

    // === Controls bar theming ===
    const controlsEl = document.querySelector('.template-controls');
    if (controlsEl) {
        if (p.id === 'midnight') {
            controlsEl.style.background = 'rgba(15, 23, 42, 0.9)';
            controlsEl.querySelectorAll('.btn-control').forEach(b => {
                b.style.background = '#1e293b';
                b.style.color = '#e2e8f0';
                b.style.borderColor = '#334155';
            });
            const palBtn = controlsEl.querySelector('.palette-toggle');
            if (palBtn) {
                palBtn.style.background = '#1e293b';
                palBtn.style.color = '#e2e8f0';
                palBtn.style.borderColor = '#334155';
            }
            const primaryBtn = controlsEl.querySelector('.btn-primary');
            if (primaryBtn) {
                primaryBtn.style.background = p.accent;
                primaryBtn.style.color = '#0f172a';
                primaryBtn.style.borderColor = p.accent;
            }
        } else {
            controlsEl.style.background = 'rgba(255,255,255,0.9)';
            controlsEl.querySelectorAll('.btn-control').forEach(b => {
                b.style.background = 'white';
                b.style.color = '';
                b.style.borderColor = '#ddd';
            });
            const palBtn = controlsEl.querySelector('.palette-toggle');
            if (palBtn) {
                palBtn.style.background = 'white';
                palBtn.style.color = '';
                palBtn.style.borderColor = '#ddd';
            }
            const primaryBtn = controlsEl.querySelector('.btn-primary');
            if (primaryBtn) {
                primaryBtn.style.background = p.accent;
                primaryBtn.style.color = '#fff';
                primaryBtn.style.borderColor = p.accent;
            }
        }
    }

    // === Palette dropdown theming ===
    const dropdown = document.getElementById('palette-dropdown');
    if (dropdown) {
        dropdown.style.background = p.id === 'midnight' ? '#1e293b' : '#fff';
    }

    // Update swatch preview
    const preview = document.querySelector('.palette-swatch-preview');
    if (preview) preview.style.background = p.accent;

    // Mark active option
    document.querySelectorAll('.palette-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.palette === id);
    });

    // Persist
    try { localStorage.setItem('dt-template-palette', id); } catch(e) {}
}

// Add the controls UI to the page
document.addEventListener('DOMContentLoaded', () => {
    // Add shared CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'template_shared.css';
    document.head.appendChild(link);

    // Initial setup
    setupImagePlaceholders();

    // Build palette picker HTML
    const swatchesHTML = PALETTES.map(p =>
        `<button class="palette-option" data-palette="${p.id}" title="${p.name}">
            <span class="swatch" style="background:${p.accent}"></span>
            <span class="swatch-label">${p.name}</span>
        </button>`
    ).join('');

    // Determine saved palette
    let savedPalette = 'blue';
    try { savedPalette = localStorage.getItem('dt-template-palette') || 'blue'; } catch(e) {}
    const savedP = PALETTES.find(x => x.id === savedPalette) || PALETTES[0];

    // Add controls container
    const controls = document.createElement('div');
    controls.className = 'template-controls';
    controls.innerHTML = `
        <button class="btn-control" onclick="resetTemplate()" title="Clear all work">🧹 Reset</button>
        <button class="btn-control" onclick="addSection()">➕ Add Section</button>
        <div class="palette-wrapper">
            <button class="palette-toggle" id="palette-toggle-btn">
                <span class="palette-swatch-preview" style="background:${savedP.accent}"></span>
                🎨 Theme
            </button>
            <div class="palette-dropdown" id="palette-dropdown">
                ${swatchesHTML}
            </div>
        </div>
        <button class="btn-control btn-primary" onclick="downloadAsPNG()">📥 PNG</button>
    `;
    document.body.appendChild(controls);

    // Toggle dropdown
    document.getElementById('palette-toggle-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('palette-dropdown').classList.toggle('open');
    });

    // Palette option clicks
    document.querySelectorAll('.palette-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            applyPalette(opt.dataset.palette);
            document.getElementById('palette-dropdown').classList.remove('open');
        });
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
        document.getElementById('palette-dropdown').classList.remove('open');
    });

    // Add disclaimer
    const disclaimer = document.createElement('div');
    disclaimer.className = 'template-disclaimer';
    disclaimer.innerHTML = `
        <strong>💡 Pro-Tip:</strong> No two problems are identical. Feel free to <strong>add new sections</strong> or adapt this template to suit the specific nature of your project.
    `;
    const firstSection = document.querySelector('.section-title') || document.body.firstChild;
    document.body.insertBefore(disclaimer, firstSection);

    // Wire up section help tooltips
    setupSectionHelp();

    // Apply saved palette
    applyPalette(savedPalette);

    // --- Persistence Wiring ---
    // Load existing
    loadTemplateData();

    // Setup listeners for all inputs
    document.body.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            saveTemplateData();
        }
    });

    // Handle checkboxes/radios
    document.body.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox' || e.target.type === 'radio') {
            saveTemplateData();
        }
    });
});
