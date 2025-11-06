import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { FileSearchTool } from './tools/file-search.tool';

@Injectable()
export class McpService implements OnModuleInit {
  private server: Server;
  private fileSearchTool: FileSearchTool;

  constructor() {
    this.server = new Server(
      {
        name: 'file-search-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.fileSearchTool = new FileSearchTool();
    this.setupHandlers();
  }

  async onModuleInit() {
    await this.start();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_file',
            description:
              'Search for a keyword or pattern within a file. Returns line numbers, context, and match details.',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'The path to the file to search in (absolute or relative)',
                },
                keyword: {
                  type: 'string',
                  description:
                    'The keyword or regex pattern to search for. Use regex syntax for pattern matching (e.g., "^import" for lines starting with import)',
                },
                caseSensitive: {
                  type: 'boolean',
                  description: 'Whether the search should be case-sensitive (default: false)',
                  default: false,
                },
                contextLines: {
                  type: 'number',
                  description:
                    'Number of context lines to include before and after each match (default: 2)',
                  default: 2,
                },
              },
              required: ['filePath', 'keyword'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === 'search_file') {
        try {
          const result = await this.fileSearchTool.search(
            args.filePath as string,
            args.keyword as string,
            {
              caseSensitive: args.caseSensitive as boolean | undefined,
              contextLines: args.contextLines as number | undefined,
            },
          );

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            isError: true,
          };
        }
      }

      throw new Error(`Unknown tool: ${name}`);
    });
  }

  private async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP File Search Server running on stdio');
  }
}

