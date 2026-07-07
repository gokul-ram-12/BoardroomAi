import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { clientTransport } from './servers/BoardroomServer';

export class MCPClientManager {
  private static instance: MCPClientManager;
  private client: Client;
  private connected = false;

  private constructor() {
    this.client = new Client({
      name: 'BoardroomAI-Client',
      version: '1.0.0',
    }, {
      capabilities: {}
    });
  }

  public static getInstance(): MCPClientManager {
    if (!MCPClientManager.instance) {
      MCPClientManager.instance = new MCPClientManager();
    }
    return MCPClientManager.instance;
  }

  public async connect(): Promise<Client> {
    if (this.connected) return this.client;
    
    await this.client.connect(clientTransport);
    this.connected = true;
    return this.client;
  }
}

export const mcpClientManager = MCPClientManager.getInstance();
