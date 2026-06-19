const fs = require('fs');
const content = fs.readFileSync('marketing/05_CONTENT_CALENDAR_TEMPLATE.md', 'utf8');
const postMatches = content.matchAll(/\*\*POST\s+(\d+)\s+—\s+([^\·]+)\s*·\s*([^\*]+)\*\*\r?\n\*\*Pillar:\*\*\s+([^\r\n]+)\r?\n\*\*Format:\*\*\s+([^\r\n]+)(?:\r?\n\*\*Asset[^:]*:\*\*\s+([^\r\n]+))?[\s\S]*?```([\s\S]*?)```/g);
const posts = [];
for (const match of postMatches) {
  posts.push(match[1]);
}
console.log("Matched:", posts.join(', '));
console.log("Total matched:", posts.length);
