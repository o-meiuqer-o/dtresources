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


// --- Math Utility for Intersecting Circles ---
function circleIntersect(p1, r1, p2, r2, sign) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const d = Math.sqrt(dx*dx + dy*dy);
    if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) return {x: p1.x, y: p1.y}; // fallback if binds
    
    const a = (r1*r1 - r2*r2 + d*d) / (2*d);
    const h = Math.sqrt(Math.max(0, r1*r1 - a*a));
    const cx = p1.x + a * (p2.x - p1.x) / d;
    const cy = p1.y + a * (p2.y - p1.y) / d;
    
    // sign determines which intersection point to pick (+1 or -1)
    return {
        x: cx + sign * h * (p2.y - p1.y) / d,
        y: cy - sign * h * (p2.x - p1.x) / d
    };
}

class JansenGait extends Mechanism {
    constructor(canvasId) {
        super(canvasId);
        this.slider = document.getElementById('mech-four-bar-slider');
        if (this.slider) {
            this.slider.addEventListener('input', (e) => {
                this.isPlaying = false;
                this.theta = parseFloat(e.target.value);
                this.draw();
            });
        }
    }
    
    draw() {
        super.draw();
        
        // Scale and offset
        const scale = 2.5;
        const ox = this.width / 2;
        const oy = this.height / 2 - 50;

        // Theo Jansen's Magic Numbers
        const l = {
            a: 15 * scale, b: 41.5 * scale, c: 39.3 * scale, d: 40.1 * scale,
            e: 55.8 * scale, f: 39.4 * scale, g: 36.7 * scale, h: 65.7 * scale,
            i: 49 * scale, j: 50 * scale, k: 61.9 * scale, l: 7.8 * scale, m: 15 * scale
        };

        // Fixed points
        const O = { x: ox, y: oy }; // Crank center
        const P = { x: ox - l.a - l.l, y: oy - l.m }; // Ground pivot

        // Crank point
        // Note: driving it backwards makes it walk forwards visually on the right
        const crankAngle = -this.theta;
        const A = { x: O.x + l.a * Math.cos(crankAngle), y: O.y + l.a * Math.sin(crankAngle) };

        // Solve joints
        // Lower triangle
        const B = circleIntersect(A, l.j, P, l.b, 1);
        const C = circleIntersect(A, l.k, P, l.c, -1);
        
        // Upper triangle
        const D = circleIntersect(B, l.e, P, l.d, 1);
        
        // Leg joints
        const E = circleIntersect(C, l.f, B, l.e, -1); // Wait, Jansen geometry has specific pairs. Let's use standard simplified 11-bar.
        // Actually, the exact standard intersections:
        // p1 (crank) = A
        // p2 = intersect(P, b, A, j, -1) -> B
        // p3 = intersect(P, c, A, k, 1) -> C
        // p4 = intersect(B, e, P, d, -1) -> D
        // p5 = intersect(C, f, B, e, 1) -> E
        // foot = intersect(D, h, E, g, -1) -> F

        // Let's re-calculate with proper signs for a right-facing leg walking left.
        const p1 = A;
        const p2 = circleIntersect(P, l.b, p1, l.j, -1);
        const p3 = circleIntersect(P, l.c, p1, l.k, 1);
        const p4 = circleIntersect(p2, l.e, P, l.d, -1);
        const p5 = circleIntersect(p3, l.f, p2, l.e, 1); // wait, link e connects p2 to p5? In Jansen it's often a solid triangle. Let's assume a solid triangle or just intersections.
        const foot = circleIntersect(p4, l.h, p5, l.g, -1);

        // Ground plane
        this.drawLine(0, oy + 120, this.width, oy + 120, THEME.lines, 2);

        // Draw Links
        this.drawLine(O.x, O.y, P.x, P.y, THEME.lines, 8); // Ground frame
        
        // Crank
        this.drawCircle(O.x, O.y, l.a, THEME.shapes, THEME.dark);
        this.drawLine(O.x, O.y, p1.x, p1.y, THEME.dark, 4);

        // Linkages
        const linkColor = THEME.dark;
        const linkW = 4;
        
        this.drawLine(p1.x, p1.y, p2.x, p2.y, linkColor, linkW); // j
        this.drawLine(p1.x, p1.y, p3.x, p3.y, linkColor, linkW); // k
        
        this.drawLine(P.x, P.y, p2.x, p2.y, linkColor, linkW); // b
        this.drawLine(P.x, P.y, p3.x, p3.y, linkColor, linkW); // c
        this.drawLine(P.x, P.y, p4.x, p4.y, linkColor, linkW); // d
        
        this.drawLine(p2.x, p2.y, p4.x, p4.y, linkColor, linkW); // e
        this.drawLine(p2.x, p2.y, p5.x, p5.y, linkColor, linkW); // ? (often part of a rigid triangle)
        
        this.drawLine(p3.x, p3.y, p5.x, p5.y, linkColor, linkW); // f
        
        this.drawLine(p4.x, p4.y, foot.x, foot.y, linkColor, linkW); // h
        this.drawLine(p5.x, p5.y, foot.x, foot.y, linkColor, linkW); // g

        // Draw solid triangles for aesthetics (optional)
        this.ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
        this.ctx.beginPath();
        this.ctx.moveTo(P.x, P.y); this.ctx.lineTo(p2.x, p2.y); this.ctx.lineTo(p4.x, p4.y); this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y); this.ctx.lineTo(p2.x, p2.y); this.ctx.lineTo(p3.x, p3.y); this.ctx.fill();

        // Joints
        this.drawCircle(O.x, O.y, 6, THEME.dark, null);
        this.drawCircle(P.x, P.y, 6, THEME.dark, null);
        this.drawCircle(p1.x, p1.y, 5, THEME.accent, null);
        this.drawCircle(p2.x, p2.y, 4, THEME.dark, null);
        this.drawCircle(p3.x, p3.y, 4, THEME.dark, null);
        this.drawCircle(p4.x, p4.y, 4, THEME.dark, null);
        this.drawCircle(p5.x, p5.y, 4, THEME.dark, null);
        
        // Foot
        this.drawCircle(foot.x, foot.y, 8, THEME.accent, THEME.dark);
    }
}
// Initialization
const anims = [];

document.addEventListener('DOMContentLoaded', () => {
    anims.push(new SliderCrank('mech-slider-crank'));
    anims.push(new FourBar('mech-four-bar'));
    anims.push(new QuickReturn('mech-quick-return'));
    anims.push(new RackPinion('mech-rack-pinion'));
    anims.push(new CamTiming('mech-cam-timing'));\n    anims.push(new JansenGait('mech-jansen-gait'));

    function loop() {
        anims.forEach(anim => anim.update());
        requestAnimationFrame(loop);
    }
    loop();
});
