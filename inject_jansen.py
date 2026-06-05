import io

with io.open('mechanisms.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

jansen_code = """
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
"""

if "class JansenGait extends Mechanism" not in js_content:
    # Insert right before the Initialization
    insert_pos = js_content.find('// Initialization')
    js_content = js_content[:insert_pos] + jansen_code + js_content[insert_pos:]
    
    # Also add it to the anims list
    init_str = "    anims.push(new CamTiming('mech-cam-timing'));"
    new_init_str = init_str + "\\n    anims.push(new JansenGait('mech-jansen-gait'));"
    js_content = js_content.replace(init_str, new_init_str)

with io.open('mechanisms.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
