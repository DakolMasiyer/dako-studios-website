const fs = require('fs');

let content = fs.readFileSync('marketing/05_CONTENT_CALENDAR_TEMPLATE.md', 'utf8');

// Replace dates in the markdown text
const replacements = [
  ['Friday June 20', 'Friday June 19'],
  ['Saturday June 21', 'Saturday June 20'],
  ['Sunday June 22', 'Sunday June 21'],
  ['Monday June 23', 'Monday June 22'],
  ['Tuesday June 24', 'Tuesday June 23'],
  ['Wednesday June 25', 'Wednesday June 24'],
  ['Thursday June 26', 'Thursday June 25'],
  ['Friday June 27', 'Friday June 26'],
  ['Saturday June 28', 'Saturday June 27'],
  ['Monday June 30', 'Monday June 29'],
  ['Tuesday July 1', 'Tuesday June 30'],
  ['Wednesday July 2', 'Wednesday July 1'],
  ['Thursday July 3', 'Thursday July 2'],
  ['Friday July 4', 'Friday July 3'],
  ['Saturday July 5', 'Saturday July 4'],
  ['Monday July 7', 'Monday July 6'],
  ['Tuesday July 8', 'Tuesday July 7'],
  ['Wednesday July 9', 'Wednesday July 8'],
  ['Thursday July 10', 'Thursday July 9'],
  ['Friday July 11', 'Friday July 10'],
  ['Saturday July 12', 'Saturday July 11'],
  ['Monday July 14', 'Monday July 13'],
  ['Tuesday July 15', 'Tuesday July 14'],
  ['Wednesday July 16', 'Wednesday July 15'],
  ['Thursday July 17', 'Thursday July 16'],
  ['Friday July 18', 'Friday July 17']
];

for (const [oldDate, newDate] of replacements) {
  content = content.replaceAll(oldDate, newDate);
}

// Also update the Period definition at the top
content = content.replace('**Period:** June 20 – July 19, 2026', '**Period:** June 19 – July 18, 2026');
content = content.replace('Jun 20–26', 'Jun 19–25');
content = content.replace('Jun 27–Jul 3', 'Jun 26–Jul 2');
content = content.replace('Jul 4–10', 'Jul 3–9');
content = content.replace('Jul 11–17', 'Jul 10–16');
content = content.replace('Jul 18–19', 'Jul 17–18');

fs.writeFileSync('marketing/05_CONTENT_CALENDAR_TEMPLATE.md', content, 'utf8');
console.log('Dates updated in 05_CONTENT_CALENDAR_TEMPLATE.md');
