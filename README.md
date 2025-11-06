# MCP File Search Server

A Model Context Protocol (MCP) server built with NestJS that provides a tool to search for keywords or patterns within files.

## Features

-  **Keyword Search**: Search for literal keywords or regex patterns in files
-  **Line Numbers**: Returns exact line numbers for each match
-  **Context**: Includes surrounding lines for better context
-  **Case Sensitivity**: Optional case-sensitive or case-insensitive search
-  **Regex Support**: Supports both literal keywords and regex patterns

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

## Running the Server

The MCP server runs on stdio (standard input/output) and is designed to be used with MCP clients like MCP Inspector.

```bash
npm start
```

For development with auto-reload:
```bash
npm run start:dev
```

## MCP Inspector Setup

To use this server with MCP Inspector, you need to configure it in your MCP client settings.

### Installing MCP Inspector

If you don't have MCP Inspector installed, you can install it via:

```bash
npm install -g @modelcontextprotocol/inspector
```

Or use it directly with npx:
```bash
npx @modelcontextprotocol/inspector
```

### Configuration

Add this server to your MCP client configuration (typically in `~/.config/mcp.json` or similar):

```json
{
  "mcpServers": {
    "file-search-server": {
      "command": "node",
      "args": ["/absolute/path/to/mcp/dist/main.js"]
    }
  }
}
```

Or if running from the project directory:
```json
{
  "mcpServers": {
    "file-search-server": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/absolute/path/to/mcp"
    }
  }
}
```

## Tool: search_file

### Description
Search for a keyword or pattern within a file. Returns line numbers, context, and match details.

### Parameters

- **filePath** (required): The path to the file to search in (absolute or relative)
- **keyword** (required): The keyword or regex pattern to search for. Use regex syntax for pattern matching (e.g., `^import` for lines starting with import)
- **caseSensitive** (optional): Whether the search should be case-sensitive (default: `false`)
- **contextLines** (optional): Number of context lines to include before and after each match (default: `2`)

### Example Usage

#### Example 1: Simple keyword search
```json
{
  "filePath": "./src/main.ts",
  "keyword": "import",
  "caseSensitive": false,
  "contextLines": 2
}
```

#### Example 2: Regex pattern search
```json
{
  "filePath": "./src/mcp/mcp.service.ts",
  "keyword": "^export",
  "caseSensitive": false,
  "contextLines": 3
}
```

#### Example 3: Case-sensitive search
```json
{
  "filePath": "./package.json",
  "keyword": "NestJS",
  "caseSensitive": true,
  "contextLines": 1
}
```

### Response Format

The tool returns a JSON object with the following structure:

```json
{
  "filePath": "/absolute/path/to/file",
  "keyword": "search term",
  "totalMatches": 5,
  "matches": [
    {
      "lineNumber": 10,
      "line": "import { Module } from '@nestjs/common';",
      "matchIndex": 0,
      "matchLength": 6
    }
  ],
  "context": [
    {
      "lineNumber": 8,
      "line": "// Previous line",
      "isMatch": false
    },
    {
      "lineNumber": 10,
      "line": "import { Module } from '@nestjs/common';",
      "isMatch": true
    },
    {
      "lineNumber": 12,
      "line": "// Next line",
      "isMatch": false
    }
  ]
}
```

## Project Structure

```
mcp/
├── src/
│   ├── main.ts                 # NestJS bootstrap
│   ├── app.module.ts           # Root module
│   └── mcp/
│       ├── mcp.module.ts       # MCP module
│       ├── mcp.service.ts      # MCP server implementation
│       └── tools/
│           └── file-search.tool.ts  # File search tool logic
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## Development

### Building
```bash
npm run build
```

### Running in Development Mode
```bash
npm run start:dev
```

### Running in Production Mode
```bash
npm run start:prod
```

## Testing with MCP Inspector

### Step 1: Build the Project
```bash
npm install
npm run build
```

### Step 2: Install MCP Inspector (if not already installed)
```bash
npm install -g @modelcontextprotocol/inspector
```

### Step 3: Run MCP Inspector
```bash
mcp-inspector
```

Or use npx:
```bash
npx @modelcontextprotocol/inspector
```

### Step 4: Configure the Server in MCP Inspector

When MCP Inspector starts, you'll need to add this server. The configuration should point to the built server:

**Option A: Using absolute path**
```json
{
  "mcpServers": {
    "file-search-server": {
      "command": "node",
      "args": ["/Users/racitsolutions/Desktop/Presnoal_work/mcp/dist/main.js"]
    }
  }
}
```

**Option B: Using npm script (from project directory)**
```json
{
  "mcpServers": {
    "file-search-server": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/Users/racitsolutions/Desktop/Presnoal_work/mcp"
    }
  }
}
```

### Step 5: Test the Tool

Once connected, use the `search_file` tool with these sample inputs:

**Example 1: Search for imports**
```json
{
  "filePath": "./src/main.ts",
  "keyword": "import",
  "caseSensitive": false,
  "contextLines": 2
}
```

**Example 2: Search with regex pattern**
```json
{
  "filePath": "./src/mcp/mcp.service.ts",
  "keyword": "^export",
  "caseSensitive": false,
  "contextLines": 3
}
```

**Example 3: Case-sensitive search**
```json
{
  "filePath": "./package.json",
  "keyword": "NestJS",
  "caseSensitive": true,
  "contextLines": 1
}
```
