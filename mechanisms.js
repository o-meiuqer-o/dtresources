/**
 * mechanisms.js
 * Canvas-based mechanical kinematic animations in a Dieter Rams minimalist aesthetic.
 */

const THEME = {
    bg: '#f9f9f9',
    lines: '#cccccc',
    shapes: '#e0e0e0',
    dark: '#333333',
    accent: '#f15a22', // Braun orange
    strokeWidth: 2
};

class Mechanism {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.theta = 0; // Driving angle
        this.speed = 0.03;
        this.isPlaying = true;
        
        // Interaction setup
        const sliderId = canvasId + '-slider';
        this.slider = document.getElementById(sliderId);
        if (this.slider) {
            this.slider.addEventListener('input', (e) => {
                this.isPlaying = false;
                this.theta = parseFloat(e.target.value);
                this.draw();
            });
            
            // Resume play on mouse up (optional, leaving it manual scrub for now)
            // this.slider.addEventListener('change', () => { this.isPlaying = true; });
        }
    }

    update() {
        if (this.isPlaying) {
            this.theta += this.speed;
            if (this.theta > Math.PI * 2) this.theta -= Math.PI * 2;
            if (this.slider) {
                this.slider.value = this.theta;
            }
        }
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = THEME.bg;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawCircle(x, y, r, fill, stroke) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        if (fill) { this.ctx.fillStyle = fill; this.ctx.fill(); }
        if (stroke) { 
            this.ctx.lineWidth = THEME.strokeWidth;
            this.ctx.strokeStyle = stroke; 
            this.ctx.stroke(); 
        }
    }

    drawLine(x1, y1, x2, y2, color, width = THEME.strokeWidth) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.stroke();
    }

    drawRectCentered(x, y, w, h, fill, stroke) {
        this.ctx.beginPath();
        this.ctx.rect(x - w/2, y - h/2, w, h);
        if (fill) { this.ctx.fillStyle = fill; this.ctx.fill(); }
        if (stroke) { 
            this.ctx.lineWidth = THEME.strokeWidth;
            this.ctx.strokeStyle = stroke; 
            this.ctx.stroke(); 
        }
    }
}

class SliderCrank extends Mechanism {
    draw() {
        super.draw();
        const cx = 150, cy = this.height / 2;
        const r = 60; // Crank radius
        const l = 200; // Rod length

        // Kinematics
        const px = cx + r * Math.cos(this.theta);
        const py = cy + r * Math.sin(this.theta);
        // sx = cx + r*cos(theta) + sqrt(l^2 - (r*sin(theta))^2)
        const sx = cx + r * Math.cos(this.theta) + Math.sqrt(l*l - Math.pow(r * Math.sin(this.theta), 2));
        const sy = cy;

        // Draw track
        this.drawLine(cx, cy, this.width - 50, cy, THEME.lines, 1);
        
        // Draw crank
        this.drawCircle(cx, cy, r, THEME.shapes, THEME.dark); // crank disk
        this.drawLine(cx, cy, px, py, THEME.dark, 4); // crank arm
        
        // Draw rod
        this.drawLine(px, py, sx, sy, THEME.dark, 6);
        
        // Draw slider
        this.drawRectCentered(sx, sy, 60, 40, THEME.shapes, THEME.dark);
        
        // Joints
        this.drawCircle(cx, cy, 6, THEME.dark, null);
        this.drawCircle(px, py, 6, THEME.accent, null);
        this.drawCircle(sx, sy, 6, THEME.dark, null);
    }
}

class FourBar extends Mechanism {
    draw() {
        super.draw();
        // Grashof Crank-Rocker
        // O2=(cx, cy), O4=(cx+d, cy)
        const cx = 150, cy = 250;
        const a = 50;  // crank
        const b = 180; // coupler
        const c = 120; // rocker
        const d = 160; // ground

        // Crank Pin A
        const Ax = cx + a * Math.cos(this.theta);
        const Ay = cy + a * Math.sin(this.theta);

        // Distance from A to O4
        const O4x = cx + d;
        const O4y = cy;
        const h = Math.sqrt(Math.pow(O4x - Ax, 2) + Math.pow(O4y - Ay, 2));
        
        // Angles for Rocker Pin B
        const phi = Math.atan2(Ay - O4y, Ax - O4x);
        // Law of cosines: b^2 = h^2 + c^2 - 2hc*cos(gamma)
        let cosGamma = (h*h + c*c - b*b) / (2 * h * c);
        // Constrain domain to prevent NaN if mechanism binds (shouldn't with these lengths)
        cosGamma = Math.max(-1, Math.min(1, cosGamma)); 
        const gamma = Math.acos(cosGamma);
        
        // Assembly mode determines sign of gamma
        const Bx = O4x + c * Math.cos(phi - gamma);
        const By = O4y + c * Math.sin(phi - gamma);

        // Draw ground
        this.drawLine(cx, cy, O4x, O4y, THEME.lines, 8);
        this.drawRectCentered(cx, cy + 10, 30, 20, THEME.shapes, THEME.dark);
        this.drawRectCentered(O4x, O4y + 10, 30, 20, THEME.shapes, THEME.dark);

        // Draw links
        this.drawLine(cx, cy, Ax, Ay, THEME.dark, 6); // Crank
        this.drawLine(Ax, Ay, Bx, By, THEME.dark, 6); // Coupler
        this.drawLine(O4x, O4y, Bx, By, THEME.dark, 6); // Rocker

        // Joints
        this.drawCircle(cx, cy, 6, THEME.dark, null);
        this.drawCircle(O4x, O4y, 6, THEME.dark, null);
        this.drawCircle(Ax, Ay, 6, THEME.accent, null);
        this.drawCircle(Bx, By, 6, THEME.dark, null);
    }
}

class QuickReturn extends Mechanism {
    draw() {
        super.draw();
        // Crank and Slotted Lever
        const cx = 200, cy = 250; // Pivot of lever (O4)
        const O2y = cy - 80; // Pivot of crank (O2)
        const r = 40; // crank radius
        
        // Crank pin A
        const Ax = cx + r * Math.cos(this.theta);
        const Ay = O2y + r * Math.sin(this.theta);

        // Lever angle
        const alpha = Math.atan2(Ay - cy, Ax - cx);
        
        // Lever length and ram pin B
        const L = 220; 
        const Bx = cx + L * Math.cos(alpha);
        const By = cy + L * Math.sin(alpha);

        // Ram constraints
        const ramY = cy - L + 20; 
        const rodL = 100;
        // Bx + sqrt(rodL^2 - (ramY - By)^2)
        const val = rodL*rodL - Math.pow(ramY - By, 2);
        let ramX = Bx;
        if(val > 0) {
            ramX = Bx + Math.sqrt(val);
        }

        // Draw guide rails
        this.drawLine(100, ramY+20, 500, ramY+20, THEME.lines, 2);

        // Draw crank
        this.drawCircle(cx, O2y, r, THEME.shapes, THEME.dark);
        this.drawLine(cx, O2y, Ax, Ay, THEME.dark, 4);

        // Draw slotted lever
        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate(alpha);
        this.ctx.beginPath();
        this.ctx.roundRect(-10, -10, L + 20, 20, 10);
        this.ctx.fillStyle = THEME.shapes;
        this.ctx.fill();
        this.ctx.lineWidth = THEME.strokeWidth;
        this.ctx.strokeStyle = THEME.dark;
        this.ctx.stroke();
        
        // Draw slot
        this.ctx.beginPath();
        this.ctx.moveTo(30, 0);
        this.ctx.lineTo(L, 0);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = THEME.bg;
        this.ctx.stroke();
        this.ctx.restore();

        // Draw connecting rod to ram
        this.drawLine(Bx, By, ramX, ramY, THEME.dark, 6);

        // Draw Ram
        this.drawRectCentered(ramX, ramY, 80, 40, THEME.shapes, THEME.dark);

        // Joints
        this.drawCircle(cx, cy, 8, THEME.dark, null); // Lever pivot
        this.drawCircle(cx, O2y, 6, THEME.dark, null); // Crank pivot
        this.drawCircle(Ax, Ay, 6, THEME.accent, null); // sliding pin
        this.drawCircle(Bx, By, 6, THEME.dark, null); // lever end
        this.drawCircle(ramX, ramY, 6, THEME.dark, null); // ram joint
    }
}

class RackPinion extends Mechanism {
    draw() {
        super.draw();
        const cx = this.width / 2;
        const cy = this.height / 2;
        const r = 60;
        const teeth = 16;

        // Pinion angle
        const angle = this.theta;
        
        // Rack translation: arc length = r * theta
        // We will loop the translation to keep it on screen
        const maxTranslation = 200;
        let translation = (r * angle) % (maxTranslation * 2);
        if (translation > maxTranslation) translation = translation - maxTranslation * 2;

        const rackY = cy + r;
        
        // Draw guide
        this.drawLine(50, rackY + 30, this.width - 50, rackY + 30, THEME.lines, 2);

        // Draw Rack
        this.ctx.beginPath();
        this.ctx.rect(100 + translation, rackY, 400, 30);
        this.ctx.fillStyle = THEME.shapes;
        this.ctx.fill();
        this.ctx.lineWidth = THEME.strokeWidth;
        this.ctx.strokeStyle = THEME.dark;
        this.ctx.stroke();

        // Rack teeth
        const rackPitch = (2 * Math.PI * r) / teeth;
        for(let i = 0; i < 400; i += rackPitch) {
            this.drawLine(100 + translation + i, rackY, 100 + translation + i, rackY - 8, THEME.dark, 2);
        }

        // Draw Pinion
        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate(angle);
        
        this.drawCircle(0, 0, r, THEME.shapes, THEME.dark);
        
        // Pinion teeth
        for(let i=0; i<teeth; i++) {
            const a = i * (Math.PI*2/teeth);
            this.drawLine(r * Math.cos(a), r * Math.sin(a), (r+8) * Math.cos(a), (r+8) * Math.sin(a), THEME.dark, 2);
        }
        
        // Pinion accent
        this.drawCircle(r/2, 0, 6, THEME.accent, null);
        
        this.ctx.restore();
        this.drawCircle(cx, cy, 8, THEME.dark, null);
    }
}

class CamTiming extends Mechanism {
    draw() {
        super.draw();
        const cx = this.width / 2;
        const cy = 250;
        const rBase = 50;
        const rLobe = 100;
        
        // Draw guide for follower
        this.drawLine(cx - 20, 50, cx - 20, 150, THEME.lines, 2);
        this.drawLine(cx + 20, 50, cx + 20, 150, THEME.lines, 2);

        // Draw Cam (eccentric circle or teardrop)
        // We'll construct a teardrop cam path
        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate(this.theta);
        
        this.ctx.beginPath();
        for(let i=0; i<=Math.PI*2; i+=0.1) {
            // Formula for egg/teardrop cam
            const rad = rBase + (rLobe - rBase) * Math.exp(-5 * Math.pow(i - Math.PI, 2));
            const x = rad * Math.cos(i);
            const y = rad * Math.sin(i);
            if(i===0) this.ctx.moveTo(x,y);
            else this.ctx.lineTo(x,y);
        }
        this.ctx.closePath();
        this.ctx.fillStyle = THEME.shapes;
        this.ctx.fill();
        this.ctx.lineWidth = THEME.strokeWidth;
        this.ctx.strokeStyle = THEME.dark;
        this.ctx.stroke();
        
        // Cam center
        this.ctx.restore();
        this.drawCircle(cx, cy, 8, THEME.dark, null);
        this.drawCircle(cx, cy, rBase, null, '#eee'); // base circle reference

        // Calculate Follower Height
        // The follower rests exactly at the top of the cam at angle (3pi/2 - theta)
        let camAngleAtTop = Math.PI * 1.5 - this.theta;
        while(camAngleAtTop < 0) camAngleAtTop += Math.PI*2;
        while(camAngleAtTop > Math.PI*2) camAngleAtTop -= Math.PI*2;
        
        const followerRadius = rBase + (rLobe - rBase) * Math.exp(-5 * Math.pow(camAngleAtTop - Math.PI, 2));
        const followerY = cy - followerRadius;

        // Draw Follower
        this.drawRectCentered(cx, followerY - 60, 20, 120, THEME.shapes, THEME.dark);
        this.drawCircle(cx, followerY, 10, THEME.accent, THEME.dark); // roller
    }
}

// Initialization
const anims = [];

document.addEventListener('DOMContentLoaded', () => {
    anims.push(new SliderCrank('mech-slider-crank'));
    anims.push(new FourBar('mech-four-bar'));
    anims.push(new QuickReturn('mech-quick-return'));
    anims.push(new RackPinion('mech-rack-pinion'));
    anims.push(new CamTiming('mech-cam-timing'));

    function loop() {
        anims.forEach(anim => anim.update());
        requestAnimationFrame(loop);
    }
    loop();
});
