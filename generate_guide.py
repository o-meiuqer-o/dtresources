import re
import sys

content = """Part III: A Guide to Figma
This section documents the successful steps for getting started with UX design in Figma, from understanding the interface to building advanced interactive prototypes.

Module 1: Getting Started
1.1: Core UX Principles
Logic: To design effectively, you must understand the goals of User Experience (UX). It's not just about looks, but about creating products that are functional and enjoyable.
Usability: Is the design easy to use and understand?
Accessibility: Can people with different abilities use it?
Desirability: Is the design pleasant and enjoyable to use?

1.2: The Figma Workspace
Logic: Knowing your workspace is the first step to using any tool effectively. Figma has four main areas.
Steps:
- Identify the Canvas (center): Your main design area.
- Identify the Layers Panel (left): Organizes every object in your design.
- Identify the Properties Panel (right): Controls the appearance of any selected object.
- Identify the Toolbar (top/bottom): Contains your primary tools (shapes, text, etc.).

Sub-Step: Understanding Pages
Logic: For large projects, a single canvas can become messy. Pages allow you to organize your work into different sections within the same file (e.g., one page for wireframes, another for final designs).
Action: Pages can be created and managed within the Layers Panel.

Sub-Step: Troubleshooting the Interface
Logic: If the interface doesn't look as expected, it's crucial to identify the environment you're in. A bottom toolbar on a computer is the key indicator of a FigJam file.
Action: Check the browser's address bar. figma.com/file/... is a Figma Design File (Correct for our lessons). figma.com/jam/... is a FigJam File (A digital whiteboard with a different interface).

1.3: Canvas Navigation
Logic: You must be able to move around your design quickly and efficiently.
Steps:
- Zoom: Hold Ctrl (Windows) or Cmd (Mac) and scroll your mouse wheel.
- Pan (Move): Hold the Spacebar (your cursor becomes a hand) and drag your mouse.

Module 2: Your First UI Element
2.1: Understanding Frames
Logic: You must always design within a defined screen size. A Frame acts as the container for each screen of your design (e.g., an iPhone screen).
Steps:
- Select the Frame tool (# icon) from the toolbar.
- In the Properties Panel on the right, choose a preset size (e.g., iPhone 14).

2.2: Creating & Styling Shapes
Logic: The appearance of every object is controlled from the Properties Panel.
Steps:
- Select the Rectangle tool from the toolbar and draw a shape on your canvas.
- To Change Color: With the shape selected, find the Fill section in the Properties Panel, click the color swatch, and choose a new color.
- To Add a Border: Find the Stroke section and click the + icon. You can then change its color and thickness.
- To Add a Shadow: Find the Effects section and click the + icon. The default is "Drop shadow," which adds depth.

2.3: Adding & Styling Text
Logic: Text is a fundamental part of any design. It is created with the Text tool and styled similarly to shapes.
Steps:
- Select the Text tool (T icon).
- Click on the canvas and type your text.
- With the text box selected, use the Text section in the Properties Panel to change properties like font size and weight (e.g., "Bold").

Sub-Step: Troubleshooting Style Changes
Logic: If style changes aren't applying, it's because Figma is in "typing mode" instead of "object selection mode." You must select the entire object to style it.
Action: Click your text, then press the Esc (Escape) key. A blue box will appear around the text, confirming the object is selected. Now you can apply styles from the Properties Panel.

2.4: Aligning Elements
Logic: For a professional look, elements must be perfectly centered, not aligned by eye.
Steps:
- Select the first object (e.g., your text).
- Hold the Shift key and select the second object (e.g., your rectangle).
- In the Properties Panel, a new section of alignment tools will appear at the top. Click "Align horizontal centers" and "Align vertical centers".

Module 3: Building Smart Components with Auto Layout
3.1: The Correct Way to Build an Auto Layout Button
Logic: Auto Layout creates smart frames that automatically resize with their content. The most robust method is to build the component from the text outwards, making the background a property of the frame itself, not a separate object.
Steps:
- Start with only a text layer.
- Select the text layer and press Shift + A. This creates a new Auto Layout frame perfectly wrapped around the text.
- With the new frame selected, go to the Properties Panel and in the Fill section, click + to add a background color.
- Test it by double-clicking the text and changing its length. The frame will resize automatically.

3.2: Controlling Space: Padding
Logic: Padding creates "breathing room" between the content and the edge of its frame.
Steps:
- Select the Auto Layout frame.
- In the Properties Panel, find the Auto Layout section.
- Adjust the padding around items. This is typically split into two boxes: Horizontal Padding and Vertical Padding.

3.3: Controlling Space: Gap
Logic: The "Gap" (or "spacing between items") controls the distance between multiple items inside an Auto Layout frame.
Practice Steps:
- Create a new shape (e.g., a small circle using the Ellipse tool) to serve as an icon. Remember to hold Shift while drawing for a perfect circle.
- Drag this new shape into your Auto Layout button frame, next to the text. The frame will automatically resize to fit it.
- Select the main Auto Layout frame.
- In the Auto Layout section of the Properties Panel, change the value for "spacing between items" (the gap).

Module 4: Reusable Design with Components
4.1: Creating a Main Component
Logic: To avoid repetitive work and ensure design consistency, you create a single "master" element called a Main Component. Any changes made to this master will automatically apply to all its copies.
Steps:
- Select the finished element you want to reuse (e.g., your complete Auto Layout button).
- Click the "Create Component" icon (four diamonds in a square) in the top toolbar.
- Confirmation: The selected element's outline and its layer name in the Layers Panel will turn purple. This is now your Main Component.

4.2: Creating Instances
Logic: "Instances" are the linked copies of your Main Component that you use throughout your design.
Steps:
- Select the Main Component.
- Copy it (Ctrl + C or Cmd + C).
- Paste it (Ctrl + V) as many times as you need. These new copies are Instances.
- Identifying Layers: Main Component: Has a filled, four-diamond icon. Instance: Has a hollow, single-diamond icon [ ◇ ].

4.3: The Power of Centralized Editing
Logic: The primary benefit of components is that editing the master updates all linked copies instantly.
Steps:
- Select the Main Component (the purple one).
- Make any change to it (e.g., change the color).
- Observe that the change is immediately reflected in all of its Instances.

4.4: Overriding Instance Properties
Logic: Often, you need a variation of a component. Instead of creating a new component, you can "override" the properties of a specific instance without breaking its link to the master.
Steps:
- Select any Instance.
- Select an element inside that instance (e.g., the text layer).
- Change a property (e.g., edit the text content).
- Observation: Only the specific instance you edited will change.

Sub-Step: Renaming Layers for Clarity
Logic: When you override text content in an instance, Figma doesn't update the layer's name. It is good practice to rename it manually to keep your file organized.
Action: In the Layers Panel, double-click directly on the layer's name, type the new name, and press Enter.

Module 5: Interactive Prototyping
5.1: Preparing Your Screens
Logic: To create an interactive flow, you need a starting point and a destination. This means you must have at least two separate Frames (screens).
Steps:
- Select the entire screen Frame by clicking its name in the Layers Panel.
- Press Ctrl + D (or Cmd + D) to duplicate the Frame.
- Make a clear visual change to the second Frame (e.g., change its Fill color in the Properties Panel).

5.2: Creating a Prototype Connection
Logic: After preparing your screens, you need to switch to Prototype mode to tell Figma how to connect them.
Steps:
- In the Properties Panel, click the "Prototype" tab.
- On your first Frame, click the trigger element (e.g., your button).
- A small white circle will appear. Click and hold this circle.
- Drag the arrow that appears over to your second Frame and release.

5.3: Presenting and Testing
Logic: "Present" mode allows you to interact with your prototype from an end-user's perspective.
Steps:
- In the top-right corner, click the "Present" button (a ▶️ play icon).
- A new browser tab will open. Click on your trigger element.
- Confirmation: The screen should transition to your second Frame.

Module 6: Advanced Component Techniques
6.1: Creating Component Variants
Logic: Variants allow you to group and organize different states of a component into a single container called a "Component Set." This is essential for managing complex design systems.
Steps:
- Select your Main Component. In the Properties Panel, find Properties and click +, then choose "Variant".
- Rename the default "Property 1" to something descriptive, like "State".
- Select the variant inside the new dashed border and click the purple + icon to add a new variant.
- Style the new variant (e.g., a lighter color for a hover state).
- In the Properties Panel, rename its "State" value to something descriptive, like "Hover".
- Drag an Instance from the Assets Panel. Use the "State" dropdown in the Properties Panel to switch between your variants.

6.2: Creating Interactive Components
Logic: This feature allows you to build prototype interactions directly into the Main Component. As a result, all instances will automatically have that interactivity.
Steps:
- Work inside your purple dashed Component Set.
- Switch to the "Prototype" tab.
- Drag a connection handle from the "Default" variant to the "Hover" state variant.
- In the "Interaction details," change the trigger from "On click" to "While hovering".
- Test in Present Mode. Hovering over any instance will now trigger the state change.

Module 7: Advanced Prototyping and Animation
7.1: Smart Animate for Fluid Transitions
Logic: Smart Animate creates high-fidelity transitions by finding layers with matching names on two different frames and automatically animating the difference in their properties (position, size, color, etc.).
Steps:
- Set up two identical frames with an instance of a component in each.
- Change a property of the instance on the second frame (e.g., move it).
- In the "Prototype" tab, drag a connection from the first frame to the second.
- In the "Interaction details," change the animation from "Instant" to "Smart animate".

7.2: Prototyping with Overlays
Logic: Overlays are used for elements that appear on top of an existing screen, such as pop-up modals or menus.
Steps:
- Design your pop-up as a separate Frame on the canvas.
- Drag a prototype connection from a trigger element on your main screen to the overlay frame.
- In the "Interaction details," change the action from "Navigate To" to "Open overlay".
- Configure the position and check "Add background behind overlay" to dim the screen.

Module 8: Creating Scrolling Content
8.1: Building the Scrolling Row
Logic: Create a long, horizontal row of components that is wider than the screen to create the need for scrolling.
Steps:
- On your main design screen, drag multiple instances of a component (e.g., a card).
- Select all instances and apply Auto Layout (Shift + A).
- Set the direction to Horizontal and adjust the gap.

8.2: Creating the Viewport and Enabling Scrolling
Logic: The key to scrolling is to place your long content inside a smaller frame (the "viewport") and then enable scrolling on that viewport.
Steps:
- Use the Frame tool (#) to draw a viewport frame that defines the visible area.
- In the Layers Panel, drag the long Auto Layout row of cards inside this new viewport frame.
- Select the viewport frame. In the Properties Panel, ensure "Clip content" is ticked.
- Switch to the "Prototype" tab, and with the viewport frame selected, set "Overflow" to "Horizontal scrolling".

Module 9: Advanced Scrolling Techniques
9.1: Creating a Vertically Scrolling Page
Logic: To make a page scroll, the main frame's height must be longer than the device's viewport.
Steps:
- Create a standard device Frame.
- In the Properties Panel, increase its Height (H).
- Place content that extends beyond the initial view.
- Select the entire long frame, switch to the "Prototype" tab, and set "Overflow" to "Vertical scrolling".

9.2: Creating a Fixed ("Sticky") Element
Logic: To make an element like a header stay in one place while the rest of the page scrolls, change its position property to "Fixed".
Steps:
- Design your header and place it at the top of your long frame.
- Select the header element.
- Switch to the "Prototype" tab.
- Find the "Position" section and change the setting to "Fixed (stay in place)".

Module 10: Creating a Style System
10.1: Creating Color and Text Styles
Logic: Saving colors and text properties as "Styles" allows you to reuse them globally, ensuring consistency. If the style is updated, every element linked to it will also update.
Steps:
- Select an object with the color/text properties you want to save.
- In the Properties Panel (Fill or Text section), click the four-dot Style icon.
- Click the plus + icon to "Create a new style".
- Give the style a semantic name (e.g., brand/primary or headings/h1) and click "Create style".

Module 11: Creating and Using Color Palettes
11.1: Creating a Palette with a Naming Convention
Logic: Use a forward slash (/) in your style names to automatically group them into folders in the Styles menu, creating an organized palette.
Steps:
- Create a new color style.
- In the name field, type the folder name, a slash, and then the color name (e.g., genre/action).
- Repeat for other colors, keeping the folder name consistent (e.g., genre/comedy).

Module 12: Professional Design Handoff
12.1: Part 1 - Cleaning & Organizing Your File
Logic: Before sharing, the file must be clean, organized, and easy to navigate. This builds confidence, saves the engineer time, and prevents mistakes that can arise from a messy or confusing file.

Step 1.1: Consistent and Logical Naming
Logic: Layer names are critical because they directly inform the engineer what to name the components in the code. A clear naming convention (Primary Button - Login) is infinitely more useful than a default name (Frame 1028).
Action: Go through the Layers Panel and systematically rename all layers, groups, and frames to be descriptive of their content and function.

Step 1.2: Ungroup Unnecessary Groups
Logic: Overly nested layers (a group inside a group inside a frame) make the design structure unnecessarily complex for an engineer to read. A flatter, simpler layer hierarchy is easier to translate into code.
Action: Identify any group or frame that contains only a single item. Select this unnecessary container and ungroup it using the shortcut Ctrl + Shift + G (or Cmd + Shift + G on a Mac) to simplify the structure.

Step 1.3: Organize Pages and Delete Unused Elements
Logic: The file's structure should guide the engineer directly to the final, approved designs, hiding all drafts and explorations to avoid confusion.
Action:
- Create a clear page structure. A professional standard includes pages like "✅ Final Designs", "Components", and an "Archived/WIP" page.
- Move your final, cleaned-up screens to the "✅ Final Designs" page.
- In the Layers Panel of your final screens, find any hidden layers (eye icon with a slash). If they are not being used for a prototype animation, delete them to reduce clutter.

12.2: Part 2 - Annotating & Specifying
Logic: An engineer cannot know the designer's intent for non-visual details like animations or specific behaviors. Annotations provide these explicit instructions directly within the design file.

Step 2.1: Visually Documenting User Flows
Logic: While prototype links show the connection between screens, adding text labels makes the user flow immediately obvious without needing to enter Present mode.
Action: Use the Text tool (T) to place a label next to each prototype arrow ("noodle") that clearly describes the interaction (e.g., "On Tap: Successful Login").

Step 2.2: Marking Assets for Export
Logic: Engineers need clean, high-quality assets (icons, logos, images) to build the UI. You must mark which layers are exportable so they can be easily downloaded.
Action:
- Select the layer that needs to be an asset (e.g., an icon).
- In the Properties Panel, scroll to the bottom and find the "Export" section.
- Click the plus + icon.
- Choose the appropriate format (e.g., SVG for icons and logos, PNG or JPG for images).

Step 2.3: Adding Written Specifications
Logic: Details about animations, validation rules, or other specific behaviors must be written down to ensure they are built correctly.
Action: Use the Text tool (T) to add notes on the canvas next to the relevant elements. For example, next to an animation, write "Animation: Smart Animate, Ease Out, 600ms".

12.3: Part 3 - Sharing & Inspecting
Logic: The final step is to share the file with the correct permissions and understand the "Inspect" mode that engineers will use to get technical details from your design.

Step 3.1: Sharing the File with the Right Permissions
Logic: Engineers should have "view" access, not "edit" access. This allows them to see all specifications and export assets without the risk of accidentally changing the designs.
Action:
- Click the blue "Share" button in the top-right corner.
- Set the sharing permission to "Anyone with the link can view".
- Click "Copy link" to get the shareable URL.

Step 3.2: Understanding the "Inspect" Mode
Logic: The "Inspect" mode is the bridge between your visual design and the engineer's code. It allows them to get all the technical details they need (sizes, colors, fonts, spacing) without having to ask.
Action:
- In the right-side panel, click the "Inspect" tab.
- Click on any element in your design.
- Observe the panel. It will display all the relevant properties (dimensions, colors, typography), provide code snippets (CSS, Swift, XML), and show a "Download" button for any assets you marked for export.

Appendix A: Common UI Elements
A visual glossary for the standard components that act as the building blocks of any digital interface.

Glossary
- UI (User Interface): The visual part of an application that the user interacts with.
- Component: A reusable, self-contained piece of the UI, like a button or a search bar.
- State: The visual appearance of a component based on user interaction (e.g., hover, disabled).

A.1 Element: Buttons
What they are: Clickable elements that allow a user to trigger an action, like submitting a form, confirming a choice, or navigating.
Best Practices:
- The most important action on a page should be the most prominent button (Primary).
- Button labels should be clear, action-oriented verbs (e.g., "Save," "Submit," "Cancel").
- Ensure buttons have clear 'hover' and 'disabled' states.

A.2 Element: Input Fields
What they are: Form elements that allow users to enter information, such as text, numbers, or selections.
Best Practices:
- Always use a clear label for each input field.
- Use placeholder text as a hint, not as a label.
- Use the correct input type for the required data (e.g., 'password' type to mask text).

A.3 Element: Navigation
What they are: A collection of links and components that help users move between different sections of an application.

A.4 Element: Cards
What they are: Rectangular containers that group related information into a digestible chunk. They are a common way to display a collection of items.

A.5 Element: Modals (Pop-ups)
What they are: A dialog box or pop-up window that appears on top of the main page content, requiring the user to interact with it before they can return to the page.
Best Practices:
- Use them sparingly, as they interrupt the user's flow.
- They are best used for critical actions, confirmations, or short forms.
- Always provide a clear way to close the modal (an 'X' button or a 'Cancel' button).

A.6 Grid & Sizing Conventions
A quick reference guide to the standard conventions for creating clean, consistent, and user-friendly mobile interfaces.

Grid & Layout
- 8-Point Grid System: All sizes, margins, and padding should be in multiples of 8 (e.g., 8, 16, 24, 32pt).
- Columns: Mobile designs typically use a 4-column grid.
- Margins: Space on the left/right edges. Standard is 16pt.
- Gutters: Space *between* columns. Standard is 16pt.

Sizing & Spacing (Tap Targets)
- Minimum Tap Target: Any interactive element must have a minimum tappable area of 44 x 44pt.
- Buttons (Height): 44pt, 48pt, or 56pt.
- Icons (Visual Size): 24 x 24pt (but ensure the tappable area is at least 44x44pt).

Appendix B: Further Reading & References

The Design of Everyday Things
by Don Norman
Why it's essential: This is the foundational book for the entire field. It explains the core principles of good design using real-world examples.

Don't Make Me Think, Revisited
by Steve Krug
Why it's essential: The most practical, common-sense guide to web usability ever written. It's short, witty, and packed with actionable advice.

Rocket Surgery Made Easy
by Steve Krug
Why it's essential: The companion to *Don't Make Me Think*. It's a step-by-step handbook on how to conduct your own usability tests simply and effectively.

Information Architecture (The Polar Bear Book)
by Louis Rosenfeld, Peter Morville, & Jorge Arango
Why it's essential: The definitive textbook on Information Architecture, covering everything from organizing principles to creating sitemaps.

Refactoring UI
by Adam Wathan & Steve Schoger
Why it's essential: A highly tactical and visual book full of before-and-after examples that teach you how to improve layouts, typography, and color.

Google Material Design Guidelines
by Google
Why it's essential: The official, exhaustive documentation for Google's design system. The primary source for understanding Material Design.

Apple Human Interface Guidelines (HIG)
by Apple
Why it's essential: The official documentation for designing for Apple's ecosystem. Essential reading for anyone designing for iOS or macOS.
"""

html_out = []
html_out.append('        <!-- ══ FIGMA COMPREHENSIVE GUIDE ══ -->')
html_out.append('        <section id="figma-guide" style="padding-top: 4rem; padding-bottom: 4rem;">')
html_out.append('            <span class="section-label">Figma Masterclass</span>')
html_out.append('            <h2>A Guide to Figma</h2>')
html_out.append('            <p style="margin-bottom: 2rem;">This section documents the successful steps for getting started with UX design in Figma, from understanding the interface to building advanced interactive prototypes.</p>')

lines = content.split('\\n')
i = 0
in_list = False

while i < len(lines):
    line = lines[i].strip()
    i += 1
    
    if not line:
        continue
        
    if line.startswith('Part III') or line.startswith('This section documents'):
        continue

    if line.startswith('Module ') or line.startswith('Appendix '):
        if in_list:
            html_out.append('                </ul>')
            in_list = False
        html_out.append(f'            <div class="card" style="text-align:left; width:100%; max-width:860px; margin-top:2rem;">')
        html_out.append(f'                <h3 style="color:var(--figma-purple); margin-bottom:1rem; font-size:1.4rem;">{line}</h3>')
    
    elif re.match(r'^[\d\.]+:|Step [\d\.]+:', line) or line.startswith('A.') or line == 'Glossary' or line == 'Grid & Layout' or line == 'Sizing & Spacing (Tap Targets)':
        if in_list:
            html_out.append('                </ul>')
            in_list = False
        html_out.append(f'                <h4 style="margin-top:1.5rem; margin-bottom:0.5rem; font-size:1.1rem; border-bottom:1px solid #eee; padding-bottom:0.5rem;">{line}</h4>')
    
    elif line.startswith('- '):
        if not in_list:
            html_out.append('                <ul style="font-size:0.9rem; line-height:1.6; margin-left:1.5rem; margin-bottom:1rem; color:#555;">')
            in_list = True
        line_clean = line[2:]
        line_clean = re.sub(r'\*\*(.*?)\*\*', r'<strong>\\1</strong>', line_clean)
        html_out.append(f'                    <li>{line_clean}</li>')
        
    elif line.startswith('by '):
        if in_list:
            html_out.append('                </ul>')
            in_list = False
        html_out.append(f'                <p style="font-size:0.8rem; color:#888; margin-top:-0.5rem; margin-bottom:0.5rem;"><em>{line}</em></p>')
        
    elif line.startswith('The Design of ') or line.startswith("Don't Make Me ") or line.startswith('Rocket Surgery ') or line.startswith('Information Architecture ') or line.startswith('Refactoring UI') or line.startswith('Google Material ') or line.startswith('Apple Human '):
        if in_list:
            html_out.append('                </ul>')
            in_list = False
        html_out.append(f'                <h4 style="margin-top:1.5rem; margin-bottom:0.5rem; font-size:1.1rem; color:#333;">{line}</h4>')
        
    else:
        if in_list:
            html_out.append('                </ul>')
            in_list = False
            
        # bold logic/action
        for prefix in ['Logic:', 'Action:', 'Steps:', 'Practice Steps:', 'Sub-Step:', 'Confirmation:', 'Observation:', 'What they are:', 'Best Practices:', "Why it's essential:"]:
            if line.startswith(prefix):
                line = line.replace(prefix, f'<strong>{prefix}</strong>', 1)
                
        html_out.append(f'                <p style="font-size:0.95rem; line-height:1.6; color:#444; margin-bottom:1rem; max-width:100%; text-align:left;">{line}</p>')

    # Add closing div before next Module
    if i < len(lines) and (lines[i].strip().startswith('Module ') or lines[i].strip().startswith('Appendix ')):
        if in_list:
            html_out.append('                </ul>')
            in_list = False
        html_out.append('            </div>')

if in_list:
    html_out.append('                </ul>')
html_out.append('            </div>')
html_out.append('        </section>')

with open('figma_guide_formatted.html', 'w', encoding='utf-8') as f:
    f.write('\\n'.join(html_out))

print('Done generating HTML')
