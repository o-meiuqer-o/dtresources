import io

with io.open('mech_prototyping.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replacements
html = html.replace(
    '<img src="assets/mechanisms/circular_reciprocating.png" alt="Slider Crank Mechanism Diagram" style="width: 100%; display: block;">',
    '<canvas id="mech-slider-crank" width="600" height="400" style="width: 100%; display: block;"></canvas>\n                    <div style="padding: 10px 20px; background: #eee; border-top: 1px solid #ddd; display: flex; align-items: center; gap: 10px;">\n                        <span style="font-size: 0.8rem; font-weight: 600; color: #666;">MANUAL SCRUB</span>\n                        <input type="range" id="mech-slider-crank-slider" min="0" max="6.28" step="0.01" value="0" style="flex: 1;">\n                    </div>'
)

html = html.replace(
    '<img src="assets/mechanisms/circular_oscillation.png" alt="Four-Bar Linkage Diagram" style="width: 100%; display: block;">',
    '<canvas id="mech-four-bar" width="600" height="400" style="width: 100%; display: block;"></canvas>\n                    <div style="padding: 10px 20px; background: #eee; border-top: 1px solid #ddd; display: flex; align-items: center; gap: 10px;">\n                        <span style="font-size: 0.8rem; font-weight: 600; color: #666;">MANUAL SCRUB</span>\n                        <input type="range" id="mech-four-bar-slider" min="0" max="6.28" step="0.01" value="0" style="flex: 1;">\n                    </div>'
)

html = html.replace(
    '<img src="assets/mechanisms/quick_return.png" alt="Quick Return Mechanism Diagram" style="width: 100%; display: block;">',
    '<canvas id="mech-quick-return" width="600" height="400" style="width: 100%; display: block;"></canvas>\n                    <div style="padding: 10px 20px; background: #eee; border-top: 1px solid #ddd; display: flex; align-items: center; gap: 10px;">\n                        <span style="font-size: 0.8rem; font-weight: 600; color: #666;">MANUAL SCRUB</span>\n                        <input type="range" id="mech-quick-return-slider" min="0" max="6.28" step="0.01" value="0" style="flex: 1;">\n                    </div>'
)

html = html.replace(
    '<img src="assets/mechanisms/circular_linear.png" alt="Rack and Pinion Diagram" style="width: 100%; display: block;">',
    '<canvas id="mech-rack-pinion" width="600" height="400" style="width: 100%; display: block;"></canvas>\n                    <div style="padding: 10px 20px; background: #eee; border-top: 1px solid #ddd; display: flex; align-items: center; gap: 10px;">\n                        <span style="font-size: 0.8rem; font-weight: 600; color: #666;">MANUAL SCRUB</span>\n                        <input type="range" id="mech-rack-pinion-slider" min="0" max="6.28" step="0.01" value="0" style="flex: 1;">\n                    </div>'
)

html = html.replace(
    '<img src="assets/mechanisms/cam_timing.png" alt="Cam and Follower Diagram" style="width: 100%; display: block;">',
    '<canvas id="mech-cam-timing" width="600" height="400" style="width: 100%; display: block;"></canvas>\n                    <div style="padding: 10px 20px; background: #eee; border-top: 1px solid #ddd; display: flex; align-items: center; gap: 10px;">\n                        <span style="font-size: 0.8rem; font-weight: 600; color: #666;">MANUAL SCRUB</span>\n                        <input type="range" id="mech-cam-timing-slider" min="0" max="6.28" step="0.01" value="0" style="flex: 1;">\n                    </div>'
)

# Inject mechanisms.js script tag
if '<script src="mechanisms.js"></script>' not in html:
    html = html.replace('<script src="script.js"></script>', '<script src="mechanisms.js"></script>\n    <script src="script.js"></script>')

with io.open('mech_prototyping.html', 'w', encoding='utf-8') as f:
    f.write(html)
