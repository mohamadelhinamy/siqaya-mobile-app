// Inspect TTF font metadata to find the exact PostScript and full names
// Usage: node scripts/inspect-fonts.js
const path = require('path');
const fs = require('fs');

async function run() {
  const fontkit = require('fontkit');
  const fontsDir = path.resolve(__dirname, '..', 'src', 'assets', 'fonts');
  const files = fs
    .readdirSync(fontsDir)
    .filter(f => f.toLowerCase().endsWith('.ttf'));
  if (!files.length) {
    console.error('No .ttf files found in', fontsDir);
    process.exit(1);
  }
  for (const file of files) {
    const fp = path.join(fontsDir, file);
    const font = fontkit.openSync(fp);
    console.log('—');
    console.log('File:', file);
    console.log('Full name:', font.fullName);
    console.log('PostScript name:', font.postscriptName);
    console.log('Family name:', font.familyName);
    console.log('Subfamily:', font.subfamilyName);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
