# MCP Inspector Setup Guide

## Quick Start

### 1. Start MCP Inspector

Run the following command in a terminal:

```bash
mcp-inspector
```

This will:
- Start the MCP Inspector proxy server on port 6277
- Generate an authentication token
- Provide a URL to open in your browser (usually `http://localhost:6274`)

### 2. Open the Web UI

Copy the URL provided in the terminal output (it will include an authentication token) and open it in your browser.

Example URL format:
```
http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=your_token_here
```

### 3. Configure Your MCP Server

In the MCP Inspector web UI:

1. **Find the Server Connection section** (usually on the left sidebar)

2. **Set Transport Type**: Select `stdio`

3. **Configure Server Command**:
   - **Command**: `node`
   - **Args**: `/Users/racitsolutions/Desktop/Presnoal_work/mcp/dist/main.js`
   
   OR use npm:
   - **Command**: `npm`
   - **Args**: `start`
   - **Working Directory**: `/Users/racitsolutions/Desktop/Presnoal_work/mcp`

4. **Click "Connect"** to establish connection

### 4. Test the search_file Tool

Once connected:

1. Navigate to the **Tools** tab
2. Find `search_file` in the list
3. Fill in the parameters:
   - **filePath**: `./src/main.ts`
   - **keyword**: `import`
   - **caseSensitive**: `false` (optional)
   - **contextLines**: `2` (optional)
4. Click **"Call Tool"** or **"Execute"**
5. View the results showing matches, line numbers, and context

## Example Test Cases

### Test 1: Simple Keyword Search
```json
{
  "filePath": "./src/main.ts",
  "keyword": "import",
  "caseSensitive": false,
  "contextLines": 2
}
```

### Test 2: Regex Pattern Search
```json
{
  "filePath": "./src/mcp/mcp.service.ts",
  "keyword": "^export",
  "caseSensitive": false,
  "contextLines": 3
}
```

### Test 3: Case-Sensitive Search
```json
{
  "filePath": "./package.json",
  "keyword": "NestJS",
  "caseSensitive": true,
  "contextLines": 1
}
```

## Troubleshooting

- **Connection fails**: Make sure the server path is correct and the project is built (`npm run build`)
- **Authentication error**: Use the exact URL with token provided by the Inspector
- **Tool not found**: Ensure the server connected successfully (check connection status)
- **File not found**: Use absolute paths or paths relative to the project root

## Screenshot for Submission

To capture your screenshot:
1. Open MCP Inspector
2. Connect to the server
3. Navigate to Tools → `search_file`
4. Fill in sample inputs (e.g., filePath: `./src/main.ts`, keyword: `import`)
5. Execute the tool
6. Capture screenshot showing both input parameters and output results

