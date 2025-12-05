const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Fix the corrupted Button component at lines 396-408
const corruptedPattern = /(\s+)<Button\r?\n\s+variant="secondary"\r?\n\s+size="\r?\n\s+sm\r?\n\s+onClick=\{[^}]+handleVisitActionClick\(visit,\s*\r?\n\\{0,2}status\\['"\]?\);[^}]*\}\r?\n\s+>\r?\n\s+Traiter\r?\n\s+<\/Button>\r?\n\s+<\/div>/g;

const replacement = `$1<Button
$1  variant="secondary"
$1  size="sm"
$1  onClick={(e) => {
$1    e.stopPropagation();
$1    handleVisitActionClick(visit, 'status');
$1  }}
$1>
$1  Traiter
$1</Button>
$1</div>`;

content = content.replace(corruptedPattern, replacement);

// Write back
fs.writeFileSync('src/pages/Dashboard.tsx', content, 'utf8');
console.log('Dashboard.tsx fixed successfully');
