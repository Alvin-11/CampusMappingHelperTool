const fs = require('fs');
const path = require('path');

const prefix = 'H9'; // put ANY number of characters here

function transformIds(input) {
  return input.replace(/'E(\d+)'/g, `'${prefix}E$1'`);
}
const inputFile = process.argv[2];

if (!inputFile) {
  console.error('Usage: node transform_ids.js <input_file>');
  process.exit(1);
}

const ext = path.extname(inputFile);
const base = path.basename(inputFile, ext);
const dir = path.dirname(inputFile);
const outputFile = path.join(dir, `${base}_updated${ext}`);

const input = fs.readFileSync(inputFile, 'utf8');
const output = transformIds(input);
fs.writeFileSync(outputFile, output);

console.log(`Done! Output written to: ${outputFile}`);