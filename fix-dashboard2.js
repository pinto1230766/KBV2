const fs = require('fs');

const content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
const lines = content.split(/\r?\n/);

// Fix lines 396-408 (array index 395-407)
// The corrupted lines are around the Button component
const fixedLines = [
  ...lines.slice(0, 395),  // Keep lines 1-395
  '                    <Button',
  '                      variant="secondary"',
  '                      size="sm"',
  '                      onClick={(e) => {',
  '                        e.stopPropagation();',
  '                        handleVisitActionClick(visit, \'status\');',
  '                      }}',
  '                    >',
  '                      Traiter',
  '                    </Button>',
  '                  </div>',
  '                </div>',
  ...lines.slice(409)  // Keep lines 410+
];

const newContent = fixedLines.join('\r\n');
fs.writeFileSync('src/pages/Dashboard.tsx', newContent, 'utf8');
console.log('Fixed Dashboard.tsx successfully');
