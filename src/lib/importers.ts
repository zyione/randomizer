import { Item, ItemList } from '@/types/randomizer';

export interface ParseOptions {
  removeDuplicates?: boolean;
  trimWhitespace?: boolean;
  defaultColor?: string;
}

const PRESET_COLORS = [
  '#00f2fe',
  '#8b5cf6',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#3b82f6',
  '#14b8a6',
  '#f43f5e',
  '#a855f7',
  '#6366f1',
];

export function getRandomColor(index?: number): string {
  if (typeof index === 'number') {
    return PRESET_COLORS[index % PRESET_COLORS.length];
  }
  return PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
}

export function parseCsvOrTxt(rawText: string, options: ParseOptions = {}): Item[] {
  const { removeDuplicates = true, trimWhitespace = true } = options;
  if (!rawText || !rawText.trim()) return [];

  // Split by line breaks (CRLF or LF)
  const lines = rawText.split(/\r\n|\n|\r/);
  const items: Item[] = [];
  const seenTexts = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (trimWhitespace) line = line.trim();
    if (!line) continue;

    let text = line;
    let subtitle: string | undefined = undefined;
    let weight = 1;

    // Check if line contains CSV delimiters (comma, semicolon, tab)
    // Handle simple quotes: "text", "subtitle", weight
    if (line.includes(',') || line.includes('\t') || line.includes(';')) {
      const delimiter = line.includes('\t') ? '\t' : line.includes(';') ? ';' : ',';
      
      // Regex for splitting respecting quotes
      const pattern = new RegExp(
        `(?:^|${delimiter})(?:"([^"]*(?:""[^"]*)*)"|([^"${delimiter}]*))`,
        'g'
      );
      
      const columns: string[] = [];
      let match;
      while ((match = pattern.exec(line)) !== null) {
        let val = match[1] ? match[1].replace(/""/g, '"') : match[2] || '';
        if (trimWhitespace) val = val.trim();
        columns.push(val);
      }

      if (columns.length > 0) {
        text = columns[0];
        if (columns.length > 1 && columns[1]) {
          subtitle = columns[1];
        }
        if (columns.length > 2) {
          const parsedWeight = parseFloat(columns[2]);
          if (!isNaN(parsedWeight) && parsedWeight > 0) {
            weight = parsedWeight;
          }
        }
      }
    } else {
      // Single line text without commas
      // Strip outer quotes if any
      if (text.startsWith('"') && text.endsWith('"') && text.length > 1) {
        text = text.slice(1, -1).replace(/""/g, '"');
      }
    }

    if (trimWhitespace) text = text.trim();
    if (!text) continue;

    const normalized = text.toLowerCase();
    if (removeDuplicates && seenTexts.has(normalized)) {
      continue;
    }
    seenTexts.add(normalized);

    items.push({
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${i}`,
      text,
      subtitle,
      weight,
      color: getRandomColor(items.length),
    });
  }

  return items;
}

export function exportListAsTxt(list: ItemList): void {
  const content = list.items.map((it) => it.text).join('\n');
  downloadFile(`${slugify(list.title)}.txt`, 'text/plain;charset=utf-8', content);
}

export function exportListAsCsv(list: ItemList): void {
  const header = 'Text,Subtitle,Weight\n';
  const rows = list.items
    .map((it) => {
      const escape = (str?: string) =>
        str ? `"${str.replace(/"/g, '""')}"` : '""';
      return `${escape(it.text)},${escape(it.subtitle)},${it.weight || 1}`;
    })
    .join('\n');

  downloadFile(`${slugify(list.title)}.csv`, 'text/csv;charset=utf-8', header + rows);
}

export function exportListAsJson(list: ItemList): void {
  const json = JSON.stringify(list, null, 2);
  downloadFile(`${slugify(list.title)}.json`, 'application/json;charset=utf-8', json);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'randomizer-list';
}

function downloadFile(filename: string, mimeType: string, content: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
