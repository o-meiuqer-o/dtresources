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

function printToPDF() {
    window.print();
}

// Image handling logic
function setupImagePlaceholders() {
    const placeholders = document.querySelectorAll('.image-placeholder');
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
        <button class="btn-control btn-primary" onclick="printToPDF()">🖨️ Print to PDF</button>
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
