function addSection() {
    const heading = prompt("Enter Section Heading:");
    if (!heading) return;

    const description = prompt("Enter Section Description (optional):");

    const sectionWrap = document.createElement('div');
    sectionWrap.className = 'section-wrapper';

    let html = `
        <div class="section-title">${heading}</div>
        <button class="btn-remove" onclick="this.parentElement.parentElement.remove()">×</button>
        <div class="field">
            ${description ? `<label>${description}</label>` : ''}
            <textarea placeholder="Enter details here..."></textarea>
        </div>
    `;

    sectionWrap.innerHTML = html;

    // Append before the end of body or a specific container
    document.body.appendChild(sectionWrap);
}

function downloadAsPNG() {
    const btn = event ? (event.currentTarget || document.querySelector('.btn-primary')) : document.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Rendering...';
    btn.disabled = true;

    // 1. Hide UI chrome
    const controlsEl = document.querySelector('.template-controls');
    const disclaimerEl = document.querySelector('.template-disclaimer');
    const tableControls = document.querySelector('.table-controls');
    if (controlsEl) controlsEl.style.display = 'none';
    if (disclaimerEl) disclaimerEl.style.display = 'none';
    if (tableControls) tableControls.style.display = 'none';

    // 2. Expand overflow containers so nothing is clipped
    const tableContainer = document.querySelector('.table-container');
    let savedOverflow = '';
    if (tableContainer) {
        savedOverflow = tableContainer.style.overflow;
        tableContainer.style.overflow = 'visible';
    }

    // 3. Expand textareas to show full content
    const textareas = document.querySelectorAll('textarea');
    const savedHeights = [];
    textareas.forEach(t => {
        savedHeights.push(t.style.height);
        t.style.height = 'auto';
        t.style.height = (t.scrollHeight + 4) + 'px';
    });

    // 4. Force body to its full scroll width so the table is unconstrained
    const savedBodyMaxWidth = document.body.style.maxWidth;
    const savedBodyWidth = document.body.style.width;
    document.body.style.maxWidth = 'none';
    document.body.style.width = document.body.scrollWidth + 'px';

    // Small delay to let layout reflow
    setTimeout(() => {
        const captureWidth = document.body.scrollWidth;
        const captureHeight = document.body.scrollHeight;
        const scale = 2; // 2x for high-res output
        const pad = 40; // Padding in CSS pixels on every side

        const canvas = document.createElement('canvas');
        canvas.width = (captureWidth + pad * 2) * scale;
        canvas.height = (captureHeight + pad * 2) * scale;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);

        // 5. Clone the body and inline all computed styles
        const clone = document.body.cloneNode(true);

        // Remove hidden elements from clone
        const hideSelectors = ['.template-controls', '.template-disclaimer', '.table-controls'];
        hideSelectors.forEach(sel => {
            const el = clone.querySelector(sel);
            if (el) el.remove();
        });

        // Inline computed styles on every element
        inlineStyles(document.body, clone);

        // 6. Serialize clone to XML string
        const serializer = new XMLSerializer();
        const htmlString = serializer.serializeToString(clone);

        // 7. Build SVG foreignObject wrapper
        const svgString = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${captureWidth}" height="${captureHeight}">
                <foreignObject width="100%" height="100%">
                    <body xmlns="http://www.w3.org/1999/xhtml" style="margin:0; padding:0;">
                        ${htmlString}
                    </body>
                </foreignObject>
            </svg>`;

        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();

        img.onload = () => {
            // Fill entire canvas (including padding) with white
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, captureWidth + pad * 2, captureHeight + pad * 2);
            // Draw content inset by the padding
            ctx.drawImage(img, pad, pad, captureWidth, captureHeight);
            URL.revokeObjectURL(url);

            // 8. Trigger PNG download
            canvas.toBlob(blob => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = (document.title || 'template') + '.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);

                restore();
            }, 'image/png');
        };

        img.onerror = () => {
            // Fallback: If SVG foreignObject method fails (CORS, complex CSS),
            // fall back to simple window.print()
            console.warn('SVG render failed, falling back to print dialog.');
            restore();
            window.print();
        };

        img.src = url;
    }, 150);

    function restore() {
        document.body.style.maxWidth = savedBodyMaxWidth;
        document.body.style.width = savedBodyWidth;
        if (controlsEl) controlsEl.style.display = 'flex';
        if (disclaimerEl) disclaimerEl.style.display = 'block';
        if (tableControls) tableControls.style.display = 'flex';
        if (tableContainer) tableContainer.style.overflow = savedOverflow;
        textareas.forEach((t, i) => { t.style.height = savedHeights[i] || ''; });
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Recursively inline computed styles from source tree onto cloned tree
function inlineStyles(source, clone) {
    if (source.nodeType !== 1) return; // Element nodes only
    const computed = window.getComputedStyle(source);
    const dominated = [
        'font-family','font-size','font-weight','color','background-color','background',
        'border','border-radius','padding','margin','display','flex-direction','align-items',
        'justify-content','gap','width','height','min-height','max-width','min-width',
        'text-align','vertical-align','line-height','white-space','overflow','position',
        'top','left','right','bottom','box-sizing','border-collapse','table-layout',
        'aspect-ratio','object-fit','opacity','visibility','flex-wrap','grid-template-columns'
    ];
    dominated.forEach(prop => {
        try {
            clone.style[prop] = computed.getPropertyValue(prop);
        } catch(e) {}
    });
    const srcChildren = source.children;
    const clnChildren = clone.children;
    for (let i = 0; i < srcChildren.length && i < clnChildren.length; i++) {
        inlineStyles(srcChildren[i], clnChildren[i]);
    }
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
}

function resetControls(controls) {
    controls.innerHTML = `
        <button class="btn-image" onclick="triggerUpload(this)">📁 Upload</button>
        <button class="btn-image" onclick="triggerCamera(this)">📸 Camera</button>
    `;
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

    // Add controls container
    const controls = document.createElement('div');
    controls.className = 'template-controls';
    controls.innerHTML = `
        <button class="btn-control" onclick="addSection()">➕ Add Section</button>
        <button class="btn-control btn-primary" onclick="downloadAsPNG()">📥 Download PNG</button>
    `;
    document.body.appendChild(controls);

    // Add disclaimer
    const disclaimer = document.createElement('div');
    disclaimer.className = 'template-disclaimer';
    disclaimer.innerHTML = `
        <strong>💡 Pro-Tip:</strong> No two problems are identical. Feel free to <strong>add new sections</strong> or adapt this template to suit the specific nature of your project.
    `;
    const firstSection = document.querySelector('.section-title') || document.body.firstChild;
    document.body.insertBefore(disclaimer, firstSection);
});
