const fs = require('fs');
let content = fs.readFileSync('marketing/05_CONTENT_CALENDAR_TEMPLATE.md', 'utf8');

const dateMatches = [...content.matchAll(/### (.*)/g)];
console.log(dateMatches.map(m => m[1]));
