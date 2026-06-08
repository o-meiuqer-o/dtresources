import re

with open("prototyping.html", "r", encoding="utf-8") as f:
    content = f.read()

# Fix duplicated glossary
glossary_pattern = re.compile(r'<div class="modal-overlay" id="modal-glossary">.*?</div>\s*</div>\s*</div>', re.DOTALL)
matches = glossary_pattern.findall(content)
if len(matches) > 1:
    # Keep the first, replace the others with empty
    for i in range(1, len(matches)):
        content = content.replace(matches[i], '')

# Fix double tool-strip, there might be one at the top still if my regex failed.
# It seems there is a tool-strip at the top still inside <section id="cover"> in prototyping.html?
# Let's check the lines from previous view_file. Yes, it was there at line 48!
# Wait, why did the python script not remove it?
# Because the python regex was faulty.

# Let's write a clean version.

with open("prototyping.html", "w", encoding="utf-8") as f:
    f.write(content)
