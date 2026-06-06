import io

with io.open('mech_prototyping.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace all slider maxes to 18.84 (3 rotations)
html = html.replace('max="6.28"', 'max="18.84"')

with io.open('mech_prototyping.html', 'w', encoding='utf-8') as f:
    f.write(html)
