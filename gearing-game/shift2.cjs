const fs = require('fs');
let content = fs.readFileSync('src/levels.js', 'utf8');

content = content.replace(/x:\s*(\d+)/g, (match, p1) => `x: ${parseInt(p1) + 100}`);
content = content.replace(/startX:\s*(\d+)/g, (match, p1) => `startX: ${parseInt(p1) + 100}`);

fs.writeFileSync('src/levels.js', content);
console.log('Shifted all x coordinates by another +100 in levels.js');
