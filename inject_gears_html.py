import io

with io.open('mech_prototyping.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add Concept Card
card_html = """
                    <div class="concept-card" data-modal="modal-gears">
                        <div class="cc-icon">⚙️</div>
                        <h3>Gears & Ratios</h3>
                        <p>Speed vs. Torque. The foundation of mechanical advantage.</p>
                        <div class="cc-cta">View Animation →</div>
                    </div>
"""
# Insert after `<div class="concept-row">`
html = html.replace('<div class="concept-row">', '<div class="concept-row">\n' + card_html)

# Add Modal HTML
modal_html = """
    <div class="modal-overlay" id="modal-gears">
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>Gears, Speed, and Torque</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body" style="padding:0;">
                <div style="display:grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #eaeaea;">
                    <div style="border-right: 1px solid #eaeaea; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">
                        <div style="text-align:center; font-size:0.7rem; font-weight:bold; color:#666; padding-top:10px;">1:1 TRANSFER</div>
                        <canvas id="mech-gear-1to1" width="400" height="200" style="width: 100%; display: block;"></canvas>
                    </div>
                    <div style="border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">
                        <div style="text-align:center; font-size:0.7rem; font-weight:bold; color:#666; padding-top:10px;">IDLER GEAR (Same Direction)</div>
                        <canvas id="mech-gear-idler" width="400" height="200" style="width: 100%; display: block;"></canvas>
                    </div>
                    <div style="border-right: 1px solid #eaeaea; padding-bottom: 10px;">
                        <div style="text-align:center; font-size:0.7rem; font-weight:bold; color:#666; padding-top:10px;">SPEED UP (Lose Torque)</div>
                        <canvas id="mech-gear-speed" width="400" height="200" style="width: 100%; display: block;"></canvas>
                    </div>
                    <div style="padding-bottom: 10px;">
                        <div style="text-align:center; font-size:0.7rem; font-weight:bold; color:#666; padding-top:10px;">TORQUE UP (Lose Speed)</div>
                        <canvas id="mech-gear-torque" width="400" height="200" style="width: 100%; display: block;"></canvas>
                    </div>
                </div>
                <div style="padding: 10px 20px; background: #eee; border-bottom: 1px solid #ddd; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 0.8rem; font-weight: 600; color: #666;">MANUAL SCRUB</span>
                    <input type="range" id="mech-gears-slider" min="0" max="6.28" step="0.01" value="0" style="flex: 1;">
                </div>
                <div style="padding: 2rem;">
                    <p><strong>Gears</strong> are the most fundamental way to transfer rotational motion and alter the mechanical advantage of a system.</p>
                    <h4 style="margin-top: 1rem;">Core Rules of Gears:</h4>
                    <ul style="margin-top: 0.5rem; margin-bottom: 1rem; padding-left: 1.2rem;">
                        <li><strong>Direction:</strong> Two meshing gears always spin in <em>opposite</em> directions. To make the output gear spin the same way as the input, you must insert an <strong>Idler Gear</strong> in the middle.</li>
                        <li><strong>The Golden Trade-off:</strong> You cannot increase both speed and power (torque) at the same time.</li>
                        <li><strong>Speed Up:</strong> A large driving gear turning a small driven gear makes the small gear spin very fast, but with very little force.</li>
                        <li><strong>Torque Up:</strong> A small driving gear turning a large driven gear makes the large gear spin very slowly, but with immense crushing force.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
"""
# Insert before `<!-- ══ MODALS ══ -->` or just before `<script src="mechanisms.js">`
html = html.replace('<script src="mechanisms.js"></script>', modal_html + '\n    <script src="mechanisms.js"></script>')

with io.open('mech_prototyping.html', 'w', encoding='utf-8') as f:
    f.write(html)
