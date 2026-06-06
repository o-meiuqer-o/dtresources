import io
import re

# 1. Update mechanisms.js
with io.open('mechanisms.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

belts_code = """
class BeltDrive extends Mechanism {
    constructor(canvasId, crossed = false) {
        super(canvasId);
        this.crossed = crossed;
        this.slider = document.getElementById('mech-belts-slider');
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
        
        const cx1 = 100;
        const cy = this.height / 2;
        const r1 = 50;
        
        const cx2 = 250;
        const r2 = 30;
        
        const angle1 = this.theta;
        const ratio = r1 / r2;
        const angle2 = this.crossed ? -this.theta * ratio : this.theta * ratio;
        
        // Belt Path
        this.ctx.beginPath();
        if (this.crossed) {
            // Crossed belt (figure 8)
            // Approximate tangent angles
            const dist = cx2 - cx1;
            const theta = Math.asin((r1 + r2) / dist);
            
            // From top left to bottom right
            this.ctx.moveTo(cx1 + r1 * Math.sin(theta), cy - r1 * Math.cos(theta));
            this.ctx.lineTo(cx2 - r2 * Math.sin(theta), cy + r2 * Math.cos(theta));
            
            // From bottom left to top right
            this.ctx.moveTo(cx1 + r1 * Math.sin(theta), cy + r1 * Math.cos(theta));
            this.ctx.lineTo(cx2 - r2 * Math.sin(theta), cy - r2 * Math.cos(theta));
            
            this.ctx.strokeStyle = THEME.dark;
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
            
            // We just draw the straight segments as crossed lines, then the pulleys over top.
        } else {
            // Standard parallel belt
            this.ctx.moveTo(cx1, cy - r1);
            this.ctx.lineTo(cx2, cy - r2);
            this.ctx.moveTo(cx1, cy + r1);
            this.ctx.lineTo(cx2, cy + r2);
            this.ctx.strokeStyle = THEME.dark;
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
        }
        
        // Pulleys
        const drawPulley = (x, y, r, angle) => {
            this.drawCircle(x, y, r, THEME.shapes, THEME.dark);
            this.drawCircle(x, y, r - 5, THEME.bg, THEME.lines);
            // Spindle/shaft
            this.drawCircle(x, y, 6, THEME.dark, null);
            // Visual rotation marker
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle);
            this.drawCircle(r - 12, 0, 4, THEME.accent, THEME.dark);
            this.ctx.restore();
        };
        
        drawPulley(cx1, cy, r1, angle1);
        drawPulley(cx2, cy, r2, angle2);
    }
}

class ChainDrive extends Mechanism {
    constructor(canvasId) {
        super(canvasId);
        this.slider = document.getElementById('mech-belts-slider');
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
        
        const cx1 = 100;
        const cy = this.height / 2;
        const r1 = 50;
        const teeth1 = 16;
        
        const cx2 = 250;
        const r2 = 30;
        const teeth2 = 10;
        
        const angle1 = this.theta;
        const ratio = r1 / r2;
        const angle2 = this.theta * ratio;
        
        // Sprockets
        const drawSprocket = (x, y, r, teeth, angle) => {
            for(let i = 0; i < teeth; i++) {
                const a = i * (Math.PI * 2 / teeth);
                this.ctx.save();
                this.ctx.translate(x, y);
                this.ctx.rotate(angle + a);
                this.ctx.beginPath();
                this.ctx.moveTo(r-2, -3);
                this.ctx.lineTo(r+4, -2);
                this.ctx.lineTo(r+4, 2);
                this.ctx.lineTo(r-2, 3);
                this.ctx.fillStyle = THEME.dark;
                this.ctx.fill();
                this.ctx.restore();
            }
            this.drawCircle(x, y, r - 2, THEME.shapes, THEME.dark);
            this.drawCircle(x, y, r - 10, THEME.bg, THEME.lines);
            this.drawCircle(x, y, 6, THEME.dark, null);
            
            // Visual rotation marker
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle);
            this.drawCircle(r - 16, 0, 4, THEME.accent, THEME.dark);
            this.ctx.restore();
        };
        
        // Simple Chain lines (top and bottom)
        this.ctx.beginPath();
        // Top line
        this.ctx.moveTo(cx1, cy - r1 - 2);
        this.ctx.lineTo(cx2, cy - r2 - 2);
        // Bottom line
        this.ctx.moveTo(cx1, cy + r1 + 2);
        this.ctx.lineTo(cx2, cy + r2 + 2);
        
        this.ctx.strokeStyle = THEME.lines;
        this.ctx.lineWidth = 6;
        this.ctx.stroke();
        
        // Draw tiny chain links on the top and bottom lines to simulate chain
        // We'll just draw a dashed line on top for chain texture
        this.ctx.beginPath();
        this.ctx.moveTo(cx1, cy - r1 - 2);
        this.ctx.lineTo(cx2, cy - r2 - 2);
        this.ctx.moveTo(cx1, cy + r1 + 2);
        this.ctx.lineTo(cx2, cy + r2 + 2);
        this.ctx.strokeStyle = THEME.dark;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([8, 4]); // dash, space
        // animate dash offset
        this.ctx.lineDashOffset = -this.theta * r1;
        this.ctx.stroke();
        this.ctx.setLineDash([]); // reset
        
        drawSprocket(cx1, cy, r1, teeth1, angle1);
        drawSprocket(cx2, cy, r2, teeth2, angle2);
    }
}
"""

if "class BeltDrive extends Mechanism" not in js_content:
    insert_pos = js_content.find('// Initialization')
    js_content = js_content[:insert_pos] + belts_code + js_content[insert_pos:]
    
    init_str = "    anims.push(new Hydraulics('mech-hydraulics'));"
    new_init_str = init_str + "\\n    anims.push(new BeltDrive('mech-belt-standard', false));\\n    anims.push(new BeltDrive('mech-belt-crossed', true));\\n    anims.push(new ChainDrive('mech-chain'));"
    js_content = js_content.replace(init_str, new_init_str)

with io.open('mechanisms.js', 'w', encoding='utf-8') as f:
    f.write(js_content)


# 2. Update mech_prototyping.html
with io.open('mech_prototyping.html', 'r', encoding='utf-8') as f:
    html = f.read()

card_html = """
                    <div class="concept-card" data-modal="modal-belts">
                        <div class="cc-icon">⛓️</div>
                        <h3>Belts & Chains</h3>
                        <p>Distance transmission. Connecting shafts safely and securely.</p>
                        <div class="cc-cta">View Animation →</div>
                    </div>
"""
# Insert after Gears card
target_card = """                    <div class="concept-card" data-modal="modal-gears">
                        <div class="cc-icon">⚙️</div>
                        <h3>Gears & Ratios</h3>
                        <p>Speed vs. Torque. The foundation of mechanical advantage.</p>
                        <div class="cc-cta">View Animation →</div>
                    </div>"""
new_cards = target_card + card_html
html = html.replace(target_card, new_cards)

modal_html = """
    <div class="modal-overlay" id="modal-belts">
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>Belts and Chains</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body" style="padding:0;">
                <div style="display:flex; border-bottom: 1px solid #eaeaea;">
                    <div style="flex:1; border-right: 1px solid #eaeaea; padding-bottom: 10px;">
                        <div style="text-align:center; font-size:0.7rem; font-weight:bold; color:#666; padding-top:10px;">STANDARD BELT (Same Direction)</div>
                        <canvas id="mech-belt-standard" width="350" height="200" style="width: 100%; display: block;"></canvas>
                    </div>
                    <div style="flex:1; border-right: 1px solid #eaeaea; padding-bottom: 10px;">
                        <div style="text-align:center; font-size:0.7rem; font-weight:bold; color:#666; padding-top:10px;">CROSSED BELT (Reverse Direction)</div>
                        <canvas id="mech-belt-crossed" width="350" height="200" style="width: 100%; display: block;"></canvas>
                    </div>
                    <div style="flex:1; padding-bottom: 10px;">
                        <div style="text-align:center; font-size:0.7rem; font-weight:bold; color:#666; padding-top:10px;">CHAIN DRIVE (No Slippage)</div>
                        <canvas id="mech-chain" width="350" height="200" style="width: 100%; display: block;"></canvas>
                    </div>
                </div>
                <div style="padding: 10px 20px; background: #eee; border-bottom: 1px solid #ddd; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 0.8rem; font-weight: 600; color: #666;">MANUAL SCRUB</span>
                    <input type="range" id="mech-belts-slider" min="0" max="6.28" step="0.01" value="0" style="flex: 1;">
                </div>
                <div style="padding: 2rem;">
                    <p>When you need to transfer power between two shafts that are far apart, gears become impractical. <strong>Belts and Chains</strong> are used to span distances.</p>
                    <h4 style="margin-top: 1rem;">Key Differences:</h4>
                    <ul style="margin-top: 0.5rem; margin-bottom: 1rem; padding-left: 1.2rem;">
                        <li><strong>Standard Belt:</strong> Smooth and quiet. Output shaft rotates in the <em>same</em> direction as the input. Belts can intentionally slip if the system jams, acting as a mechanical fuse.</li>
                        <li><strong>Crossed Belt:</strong> By twisting the belt in a Figure-8, the output shaft will rotate in the <em>opposite</em> direction, eliminating the need for an idler gear.</li>
                        <li><strong>Chain Drive:</strong> Uses interlocking teeth (sprockets) and chain links. Chains are louder and require lubrication, but they provide <em>positive engagement</em> (zero slippage), making them perfect for high-torque applications like bicycles or motorcycles.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
"""

html = html.replace('<!-- ══ MODALS ══ -->', '<!-- ══ MODALS ══ -->\\n' + modal_html)

with io.open('mech_prototyping.html', 'w', encoding='utf-8') as f:
    f.write(html)
