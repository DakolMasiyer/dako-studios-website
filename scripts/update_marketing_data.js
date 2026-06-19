const fs = require('fs');

const file = 'src/utils/marketing-data.ts';
let content = fs.readFileSync(file, 'utf8');

// Update interfaces
content = content.replace(
  'export interface CalendarPost {',
  'export type PostStatus = \'todo\' | \'inprogress\' | \'done\';\n\nexport interface CalendarPost {\n  status?: PostStatus;\n  publishedUrl?: string;'
);

content = content.replace(
  'export interface CopyAsset {\n  id: string',
  'export interface CopyAsset {\n  id: string\n  status?: PostStatus;\n  publishedUrl?: string;'
);

// Add ContentState tracking
const stateFunctions = `
export interface ContentState {
  [id: string]: { status: PostStatus; publishedUrl: string };
}

export function getContentState(): ContentState {
  try {
    const filePath = path.join(process.cwd(), 'content/post-status.json');
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

export function saveContentState(state: ContentState): boolean {
  try {
    const filePath = path.join(process.cwd(), 'content/post-status.json');
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
}
`;

content = content.replace('// Fallback Mocks', stateFunctions + '\n// Fallback Mocks');

// Merge state into getCalendarData
content = content.replace(
  '    if (posts.length > 0) return posts',
  `    const state = getContentState();
    posts.forEach(p => {
      if (state['post_' + p.id]) {
        p.status = state['post_' + p.id].status;
        p.publishedUrl = state['post_' + p.id].publishedUrl;
      } else {
        p.status = 'todo';
        p.publishedUrl = '';
      }
    });
    if (posts.length > 0) return posts`
);

// Merge state into getCopyBankData
content = content.replace(
  '    if (assets.length > 0) return assets',
  `    const state = getContentState();
    assets.forEach(a => {
      if (state['copy_' + a.id]) {
        a.status = state['copy_' + a.id].status;
        a.publishedUrl = state['copy_' + a.id].publishedUrl;
      } else {
        a.status = 'todo';
        a.publishedUrl = '';
      }
    });
    if (assets.length > 0) return assets`
);

fs.writeFileSync(file, content);
console.log("Updated marketing-data.ts");
