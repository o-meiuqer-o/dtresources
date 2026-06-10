import re

with open("prototyping.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Extract tool-strip
tool_strip_match = re.search(r'(<div class="tool-strip">.*?</div>\s*</div>\s*</div>)', content, re.DOTALL)
if tool_strip_match:
    tool_strip_html = tool_strip_match.group(1)
    content = content.replace(tool_strip_html, "")
else:
    # Let's try more robust extraction for tool-strip
    tool_strip_match = re.search(r'(<div class="tool-strip">.*?</div>\s*</div>\s*)</section>', content, re.DOTALL)
    if tool_strip_match:
        tool_strip_html = tool_strip_match.group(1)
        content = content.replace(tool_strip_html, "")
    else:
        print("Could not extract tool-strip")

# 2. Extract figma-workflow
workflow_match = re.search(r'(<!-- ══ 01: FIGMA PROTOTYPE WORKFLOW ══ -->.*?</section>)', content, re.DOTALL)
if workflow_match:
    workflow_html = workflow_match.group(1)
    content = content.replace(workflow_html, "")
else:
    print("Could not extract figma-workflow")

# 3. Modify cover section
cover_new = """        <!-- ══ COVER ══ -->
        <section id="cover">
            <div class="module-tag">Module 05 · Prototyping</div>
            <h1>The Scope of Prototyping</h1>
            <p style="color:#666; margin-top:1rem;">Prototyping is the act of making ideas tangible. The scope of prototyping is vast, spanning from digital interfaces to physical objects and electronic systems. While a few of these will be discussed in detail within our limitations, all serve the same goal: communicating intent and testing assumptions.</p>

            <div class="grid-container grid-3" style="margin-top: 2rem;">
                <div class="card pillar-card" style="cursor: default;">
                    <div class="pillar-image" style="background: #eef2ff; display:flex; align-items:center; justify-content:center; font-size:3rem; border-radius: 8px; height: 120px; margin-bottom: 1rem;">💻</div>
                    <h3 style="color: var(--accent-color);">Software Prototyping</h3>
                    <p>Digital interfaces and interactions.</p>
                </div>
                <div class="card pillar-card" onclick="window.location.href='mech_prototyping.html'" style="cursor: pointer;">
                    <div class="pillar-image" style="background: #fff5f5; display:flex; align-items:center; justify-content:center; font-size:3rem; border-radius: 8px; height: 120px; margin-bottom: 1rem;">⚙️</div>
                    <h3 style="color: var(--accent-color);">Mechanical Prototyping</h3>
                    <p>Physical mechanisms and kinematics. →</p>
                </div>
                <div class="card pillar-card">
                    <div class="pillar-image" style="background: #f5f5f5; display:flex; align-items:center; justify-content:center; font-size:3rem; border-radius: 8px; height: 120px; margin-bottom: 1rem; filter: grayscale(1); opacity: 0.5;">⚡</div>
                    <h3 style="color: #666;">Electronics Prototyping</h3>
                    <p>Coming Soon...</p>
                </div>
            </div>
        </section>

        <!-- ══ SOFTWARE COVER ══ -->
        <section id="software-cover" style="padding-top: 4rem;">
            <h2>Software Prototyping</h2>
            <p style="margin-bottom: 2rem;">Two tools, one goal — turning your digital design into something a real user can interact with. Figma for click-through prototypes. Antigravity for coded ones.</p>
        </section>"""

content = re.sub(r'<!-- ══ COVER ══ -->.*?</section>', cover_new, content, flags=re.DOTALL)

# 4. Insert figma-workflow before smart-animate
if workflow_match:
    content = content.replace('<!-- ══ 04: SMART ANIMATE ══ -->', workflow_html + '\n\n        <!-- ══ 04: SMART ANIMATE ══ -->')

# 5. Insert tool-strip at the end of antigravity-guide
if tool_strip_match:
    content = content.replace('<!-- ══ FIGMA COMPREHENSIVE GUIDE ══ -->', tool_strip_html + '\n        </section>\n\n        <!-- ══ FIGMA COMPREHENSIVE GUIDE ══ -->')
    # wait, the antigravity-guide ends with </section>.
    content = content.replace('</section>\n\n                <!-- ══ FIGMA COMPREHENSIVE GUIDE ══ -->', tool_strip_html + '\n        </section>\n\n                <!-- ══ FIGMA COMPREHENSIVE GUIDE ══ -->')

# 6. Remove Figma Masterclass
content = re.sub(r'<!-- ══ FIGMA COMPREHENSIVE GUIDE ══ -->.*?</section>', '', content, flags=re.DOTALL)

# 7. Update Next button
#     <a href="mech_prototyping.html" class="nav-pill" style="font-size: 1.1rem; padding: 12px 24px;">Module 06: Mechanical Prototyping →</a>
next_btn = '<a href="mech_prototyping.html" class="primary-btn" style="margin-top: 2rem;">Next: Module 05.2: Mechanical Prototyping →</a>'
content = re.sub(r'<a href="mech_prototyping\.html" class="nav-pill".*?</a>', next_btn, content)

with open("prototyping.html", "w", encoding="utf-8") as f:
    f.write(content)
