import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create NestJS application context (no HTTP server needed for MCP stdio)
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'], // Only log errors/warnings to stderr
  });

  // The MCP service will initialize and connect via stdio in onModuleInit
  // Keep the process alive
  process.on('SIGINT', async () => {
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await app.close();
    process.exit(0);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});

