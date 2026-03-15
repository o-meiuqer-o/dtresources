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
    if (controlsEl) controlsEl.style.display = 'none';
    if (disclaimerEl) disclaimerEl.style.display = 'none';
    if (tableControls) tableControls.style.display = 'none';

    // 2. Expand overflow containers
    const tableContainer = document.querySelector('.table-container');
    let savedOverflow = '';
    if (tableContainer) {
        savedOverflow = tableContainer.style.overflow;
        tableContainer.style.overflow = 'visible';
    }

    // 3. Expand textareas
    const textareas = document.querySelectorAll('textarea');
    const savedHeights = [];
    textareas.forEach(t => {
        savedHeights.push(t.style.height);
        t.style.height = 'auto';
        t.style.height = (t.scrollHeight + 4) + 'px';
    });

    // 4. Force body to full scroll width (unconstrain table)
    const savedBodyMaxWidth = document.body.style.maxWidth;
    const savedBodyWidth = document.body.style.width;
    document.body.style.maxWidth = 'none';
    document.body.style.width = 'max-content';

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
