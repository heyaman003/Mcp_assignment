# Quick Start Guide - MCP Inspector

## ✅ Installation Complete!

MCP Inspector is installed and ready to use.

## 🚀 Start MCP Inspector

**Option 1: Use the helper script**
```bash
./start-inspector.sh
```

**Option 2: Run directly**
```bash
mcp-inspector
```

This will start the Inspector and display:
- An authentication token
- A URL to open in your browser (usually `http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=...`)

## 🔧 Configure Your Server

Once the Inspector web UI opens:

1. **Transport Type**: Select `stdio`

2. **Server Configuration**:
   - **Command**: `node`
   - **Args**: `/Users/racitsolutions/Desktop/Presnoal_work/mcp/dist/main.js`
   
   OR:
   - **Command**: `npm`
   - **Args**: `start`
   - **Working Directory**: `/Users/racitsolutions/Desktop/Presnoal_work/mcp`

3. Click **"Connect"**

## 🧪 Test the Tool

1. Go to **Tools** tab
2. Select `search_file`
3. Enter test values:
   - **filePath**: `./src/main.ts`
   - **keyword**: `import`
   - **caseSensitive**: `false`
   - **contextLines**: `2`
4. Click **"Call Tool"**
5. View results!

## 📸 For Your Screenshot

Capture a screenshot showing:
- The input parameters (filePath, keyword, etc.)
- The output results (matches, line numbers, context)

---

**Note**: Keep the Inspector terminal window open while testing. Press Ctrl+C to stop it.

