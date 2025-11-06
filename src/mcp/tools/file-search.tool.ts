import * as fs from 'fs';
import * as path from 'path';

export interface SearchOptions {
  caseSensitive?: boolean;
  contextLines?: number;
}

export interface SearchMatch {
  lineNumber: number;
  line: string;
  matchIndex: number;
  matchLength: number;
}

export interface SearchResult {
  filePath: string;
  keyword: string;
  totalMatches: number;
  matches: SearchMatch[];
  context: Array<{
    lineNumber: number;
    line: string;
    isMatch: boolean;
  }>;
}

export class FileSearchTool {
  async search(
    filePath: string,
    keyword: string,
    options: SearchOptions = {},
  ): Promise<SearchResult> {
    const {
      caseSensitive = false,
      contextLines = 2,
    } = options;

    // Resolve file path
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File not found: ${resolvedPath}`);
    }

    // Check if it's a file (not a directory)
    const stats = fs.statSync(resolvedPath);
    if (!stats.isFile()) {
      throw new Error(`Path is not a file: ${resolvedPath}`);
    }

    // Read file content
    const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
    const lines = fileContent.split(/\r?\n/);

    // Determine if keyword is a regex pattern
    const isRegex = this.isRegexPattern(keyword);
    let regex: RegExp;

    if (isRegex) {
      try {
        regex = new RegExp(keyword, caseSensitive ? 'g' : 'gi');
      } catch (error) {
        throw new Error(`Invalid regex pattern: ${keyword}`);
      }
    } else {
      // Escape special regex characters for literal search
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regex = new RegExp(escapedKeyword, caseSensitive ? 'g' : 'gi');
    }

    // Find all matches
    const matches: SearchMatch[] = [];
    const contextMap = new Map<number, boolean>(); // Track which lines are matches

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const lineMatches = [...line.matchAll(regex)];

      lineMatches.forEach((match) => {
        if (match.index !== undefined) {
          matches.push({
            lineNumber,
            line,
            matchIndex: match.index,
            matchLength: match[0].length,
          });
          contextMap.set(lineNumber, true);
        }
      });
    });

    // Build context around matches
    const contextSet = new Set<number>();
    matches.forEach((match) => {
      for (
        let i = Math.max(1, match.lineNumber - contextLines);
        i <= Math.min(lines.length, match.lineNumber + contextLines);
        i++
      ) {
        contextSet.add(i);
      }
    });

    const context = Array.from(contextSet)
      .sort((a, b) => a - b)
      .map((lineNumber) => ({
        lineNumber,
        line: lines[lineNumber - 1],
        isMatch: contextMap.has(lineNumber),
      }));

    return {
      filePath: resolvedPath,
      keyword,
      totalMatches: matches.length,
      matches,
      context,
    };
  }

  private isRegexPattern(pattern: string): boolean {
    // Simple heuristic: if pattern contains regex metacharacters, treat as regex
    const regexMetacharacters = /[.*+?^${}()|[\]\\]/;
    return regexMetacharacters.test(pattern);
  }
}

