import io

with io.open('figma_guide_formatted.html', 'r', encoding='utf-8') as f:
    fresh_guide = f.read()

modal_html = """
    <div class="modal-overlay" id="modal-glossary">
        <div class="modal-content">
            <div class="modal-header">
                <h3>📖 Glossary of Terms</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body" style="max-height: 70vh; overflow-y: auto; text-align: left;">
                <h4>Glossary</h4>
                <ul>
                    <li><strong>UI (User Interface):</strong> The visual part of an application that the user interacts with.</li>
                    <li><strong>Component:</strong> A reusable, self-contained piece of the UI, like a button or a search bar.</li>
                    <li><strong>State:</strong> The visual appearance of a component based on user interaction (e.g., hover, disabled).</li>
                </ul>
                <hr>
                <h4>A.1 Element: Buttons</h4>
                <p>Clickable elements that allow a user to trigger an action, like submitting a form, confirming a choice, or navigating.</p>
                <ul>
                    <li>The most important action on a page should be the most prominent button (Primary).</li>
                    <li>Button labels should be clear, action-oriented verbs (e.g., "Save", "Submit", "Cancel").</li>
                    <li>Ensure buttons have clear 'hover' and 'disabled' states.</li>
                </ul>
                <hr>
                <h4>A.2 Element: Input Fields</h4>
                <p>Form elements that allow users to enter information, such as text, numbers, or selections.</p>
                <ul>
                    <li>Always use a clear label for each input field.</li>
                    <li>Use placeholder text as a hint, not as a label.</li>
                    <li>Use the correct input type for the required data (e.g., 'password' type to mask text).</li>
                </ul>
                <hr>
                <h4>A.3 Element: Navigation</h4>
                <p>A collection of links and components that help users move between different sections of an application.</p>
                <hr>
                <h4>A.4 Element: Cards</h4>
                <p>Rectangular containers that group related information into a digestible chunk. They are a common way to display a collection of items.</p>
                <hr>
                <h4>A.5 Element: Modals (Pop-ups)</h4>
                <p>A dialog box or pop-up window that appears on top of the main page content, requiring the user to interact with it before they can return to the page.</p>
                <ul>
                    <li>Use them sparingly, as they interrupt the user's flow.</li>
                    <li>They are best used for critical actions, confirmations, or short forms.</li>
                    <li>Always provide a clear way to close the modal (an 'X' button or a 'Cancel' button).</li>
                </ul>
                <hr>
                <h4>A.6 Grid & Sizing Conventions</h4>
                <p><strong>Grid & Layout:</strong></p>
                <ul>
                    <li><strong>8-Point Grid System:</strong> All sizes, margins, and padding should be in multiples of 8 (e.g., 8, 16, 24, 32pt).</li>
                    <li><strong>Columns:</strong> Mobile designs typically use a 4-column grid.</li>
                    <li><strong>Margins:</strong> Space on the left/right edges. Standard is 16pt.</li>
                    <li><strong>Gutters:</strong> Space *between* columns. Standard is 16pt.</li>
                </ul>
                <p><strong>Sizing & Spacing (Tap Targets):</strong></p>
                <ul>
                    <li><strong>Minimum Tap Target:</strong> Any interactive element must have a minimum tappable area of 44 x 44pt.</li>
                    <li><strong>Buttons (Height):</strong> 44pt, 48pt, or 56pt.</li>
                    <li><strong>Icons (Visual Size):</strong> 24 x 24pt (but ensure the tappable area is at least 44x44pt).</li>
                </ul>
            </div>
        </div>
    </div>
"""

concept_card_html = """                <div class="concept-card" data-modal="modal-glossary">
                    <div class="cc-icon">📖</div>
                    <h3>Glossary of Terms</h3>
                    <p>A quick reference guide for common UI elements, grids, sizing conventions, and design components.</p>
                    <div class="cc-cta">Learn more →</div>
                </div>
            </div>"""

with io.open('prototyping.html', 'r', encoding='utf-8') as f:
    proto_html = f.read()

start_marker = '<!-- ══ FIGMA COMPREHENSIVE GUIDE ══ -->'
end_marker = '<!-- ══ 07: COMING SOON ══ -->'

idx1 = proto_html.find(start_marker)
idx2 = proto_html.find(end_marker)

if idx1 != -1 and idx2 != -1:
    proto_html = proto_html[:idx1] + fresh_guide + '\n\n        ' + proto_html[idx2:]

proto_html = proto_html.replace(
    '<div class="concept-card" data-modal="modal-components">\n                    <div class="cc-icon">🧩</div>\n                    <h3>Interactive Components</h3>\n                    <p>Components with variants can swap states — toggles, checkboxes, hover states — without navigating to a new frame at all.</p>\n                    <div class="cc-cta">Learn more →</div>\n                </div>\n            </div>',
    '<div class="concept-card" data-modal="modal-components">\n                    <div class="cc-icon">🧩</div>\n                    <h3>Interactive Components</h3>\n                    <p>Components with variants can swap states — toggles, checkboxes, hover states — without navigating to a new frame at all.</p>\n                    <div class="cc-cta">Learn more →</div>\n                </div>\n' + concept_card_html
)

proto_html = proto_html.replace('</body>', modal_html + '\n</body>')

with io.open('prototyping.html', 'w', encoding='utf-8') as f:
    f.write(proto_html)

print('Updated prototyping.html successfully!')
