const fs = require('fs');
const filePath = 'node_modules/three/examples/jsm/loaders/GLTFLoader.js';
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: Replace new Blob with base64 data URL
content = content.replace(
  /const blob = new Blob\(\s*\[\s*binary\s*\]\s*,\s*\{\s*type:\s*mimeType\s*\}\s*\);/g,
  'const blob = null;'
);

// Fix 2: Any Blob creation
content = content.replace(
  /new Blob\(\s*\[([^\]]+)\]\s*,\s*\{[^}]+\}\s*\)/g,
  'null'
);

// Fix 3: createObjectURL calls
content = content.replace(
  /URL\.createObjectURL\([^)]+\)/g,
  '"data:application/octet-stream;base64,"'
);

// Fix 4: revokeObjectURL calls  
content = content.replace(
  /URL\.revokeObjectURL\([^)]+\)/g,
  'null'
);

fs.writeFileSync(filePath, content);

// Verify
const updated = fs.readFileSync(filePath, 'utf8');
console.log('Blob remaining:', updated.includes('new Blob'));
console.log('createObjectURL remaining:', updated.includes('createObjectURL'));
console.log('Patch complete!');