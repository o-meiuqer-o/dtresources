import io

# 1. Update mechanisms.js
with io.open('mechanisms.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

hydro_code = """
class Hydraulics extends Mechanism {
    draw() {
        super.draw();
        
        const cx = this.width / 2;
        const cy = this.height / 2;
        
        // Settings
        const w1 = 30; // Area 1 (input)
        const w2 = 120; // Area 2 (output)
        const h1 = 150; // Max depth 1
        const h2 = 150; // Max depth 2
        
        // Piston positions (mapped to slider: sin wave)
        const stroke1 = (Math.sin(this.theta - Math.PI/2) + 1) / 2 * 100; // 0 to 100
        const stroke2 = stroke1 * (w1 / w2); // Pascal's principle: stroke inversely proportional to area
        
        const px1 = cx - 100;
        const py1 = cy - 20; // top of cylinder 1
        
        const px2 = cx + 100;
        const py2 = cy - 20; // top of cylinder 2
        
        // Draw fluid
        this.ctx.fillStyle = '#0696D7'; // Blue fluid
        this.ctx.beginPath();
        // Left column
        this.ctx.moveTo(px1 - w1/2, py1 + stroke1);
        this.ctx.lineTo(px1 + w1/2, py1 + stroke1);
        this.ctx.lineTo(px1 + w1/2, py1 + h1);
        // Connect to right
        this.ctx.lineTo(px2 - w2/2, py2 + h2);
        this.ctx.lineTo(px2 - w2/2, py2 + h2 - stroke2);
        this.ctx.lineTo(px2 + w2/2, py2 + h2 - stroke2);
        this.ctx.lineTo(px2 + w2/2, py2 + h2);
        // Bottom pipe
        this.ctx.lineTo(px2 + w2/2, py2 + h2 + 30);
        this.ctx.lineTo(px1 - w1/2, py1 + h1 + 30);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw Cylinders & Pipes (outline)
        this.ctx.beginPath();
        this.ctx.moveTo(px1 - w1/2, py1 - 20);
        this.ctx.lineTo(px1 - w1/2, py1 + h1 + 30);
        this.ctx.lineTo(px2 + w2/2, py2 + h2 + 30);
        this.ctx.lineTo(px2 + w2/2, py2 - 20);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = THEME.dark;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(px1 + w1/2, py1 - 20);
        this.ctx.lineTo(px1 + w1/2, py1 + h1);
        this.ctx.lineTo(px2 - w2/2, py2 + h2);
        this.ctx.lineTo(px2 - w2/2, py2 - 20);
        this.ctx.stroke();
        
        // Draw Input Piston
        this.drawRectCentered(px1, py1 + stroke1 - 10, w1, 20, THEME.dark, null);
        this.drawRectCentered(px1, py1 + stroke1 - 40, 6, 60, THEME.shapes, THEME.dark); // shaft
        
        // Draw Output Piston
        this.drawRectCentered(px2, py2 + h2 - stroke2 - 10, w2, 20, THEME.dark, null);
        this.drawRectCentered(px2, py2 + h2 - stroke2 - 40, 20, 60, THEME.shapes, THEME.dark); // shaft
        
        // Draw "Car" Weight on Output
        const carY = py2 + h2 - stroke2 - 80;
        this.drawRectCentered(px2, carY, 100, 40, THEME.shapes, THEME.dark); // car body
        this.drawRectCentered(px2, carY - 30, 60, 20, THEME.shapes, THEME.dark); // car top
        this.drawCircle(px2 - 30, carY + 20, 10, THEME.dark, null); // wheel
        this.drawCircle(px2 + 30, carY + 20, 10, THEME.dark, null); // wheel
        
        // Force Vectors (Arrows) to illustrate advantage
        const drawArrow = (x, y, len, width, color) => {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + len);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = width;
            this.ctx.stroke();
            // Arrowhead
            this.ctx.beginPath();
            if (len > 0) { // pointing down
                this.ctx.moveTo(x - width*1.5, y + len - 8);
                this.ctx.lineTo(x + width*1.5, y + len - 8);
                this.ctx.lineTo(x, y + len + 2);
            } else { // pointing up
                this.ctx.moveTo(x - width*1.5, y + len + 8);
                this.ctx.lineTo(x + width*1.5, y + len + 8);
                this.ctx.lineTo(x, y + len - 2);
            }
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
        
        // Input force (small arrow down)
        drawArrow(px1, py1 - 80, 40, 3, THEME.accent);
        
        // Output force (large arrow up)
        drawArrow(px2, py2 - 20 - stroke2, -80, 8, THEME.accent);
    }
}
"""

if "class Hydraulics extends Mechanism" not in js_content:
    insert_pos = js_content.find('// Initialization')
    js_content = js_content[:insert_pos] + hydro_code + js_content[insert_pos:]
    
    init_str = "    anims.push(new CamTiming('mech-cam-timing'));"
    new_init_str = init_str + "\\n    anims.push(new Hydraulics('mech-hydraulics'));"
    js_content = js_content.replace(init_str, new_init_str)

with io.open('mechanisms.js', 'w', encoding='utf-8') as f:
    f.write(js_content)


# 2. Update mech_prototyping.html
with io.open('mech_prototyping.html', 'r', encoding='utf-8') as f:
    html = f.read()

card_html = """
                    <div class="concept-card" data-modal="modal-hydraulics">
                        <div class="cc-icon">💧</div>
                        <h3>Hydraulics</h3>
                        <p>Fluid power. Trading distance for massive physical force.</p>
                        <div class="cc-cta">View Animation →</div>
                    </div>
"""
html = html.replace('<!-- ══ MOVEMENT CONVERSIONS (CONCEPT CARDS) ══ -->', '<!-- ══ MOVEMENT CONVERSIONS (CONCEPT CARDS) ══ -->\\n' + card_html)
# Wait, replacing that comment puts it outside the grid.
# Find the exact insertion point for the card: after the Gears card in the grid.
# Better to replace the Gears card definition with itself + the new card.
target_card = """                    <div class="concept-card" data-modal="modal-gears">
                        <div class="cc-icon">⚙️</div>
                        <h3>Gears & Ratios</h3>
                        <p>Speed vs. Torque. The foundation of mechanical advantage.</p>
                        <div class="cc-cta">View Animation →</div>
                    </div>"""
new_cards = target_card + card_html
html = html.replace(target_card, new_cards)

modal_html = """
    <div class="modal-overlay" id="modal-hydraulics">
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h3>Hydraulic Force Transmission</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body" style="padding:0;">
                <canvas id="mech-hydraulics" width="700" height="400" style="width: 100%; display: block; border-bottom: 1px solid #eaeaea;"></canvas>
                <div style="padding: 10px 20px; background: #eee; border-bottom: 1px solid #ddd; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 0.8rem; font-weight: 600; color: #666;">MANUAL PUMP</span>
                    <input type="range" id="mech-hydraulics-slider" min="0" max="6.28" step="0.01" value="0" style="flex: 1;">
                </div>
                <div style="padding: 2rem;">
                    <p><strong>Hydraulics</strong> use incompressible fluids to transmit force. They act as a fluid gear system, obeying Pascal's Principle: pressure applied to a confined fluid is transmitted undiminished in every direction.</p>
                    <h4 style="margin-top: 1rem;">How it works:</h4>
                    <ul style="margin-top: 0.5rem; margin-bottom: 1rem; padding-left: 1.2rem;">
                        <li><strong>Input (Small Area):</strong> A small force is applied to a small piston. It pushes the fluid a very <em>long</em> distance.</li>
                        <li><strong>Output (Large Area):</strong> The displaced fluid pushes against a much larger piston. Because the area is larger, the resulting lifting force is massive, but the piston only moves a <em>short</em> distance.</li>
                    </ul>
                    <p class="source">Examples: Car brakes, heavy excavators, hydraulic car lifts, robotic actuators.</p>
                </div>
            </div>
        </div>
    </div>
"""

html = html.replace('<!-- ══ MODALS ══ -->', '<!-- ══ MODALS ══ -->\\n' + modal_html)

with io.open('mech_prototyping.html', 'w', encoding='utf-8') as f:
    f.write(html)
