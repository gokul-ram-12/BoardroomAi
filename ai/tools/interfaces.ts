export interface ToolSchemaProperty {
  type: string;
  description?: string;
  enum?: string[];
}

export interface ToolSchema {
  type: 'object';
  properties: Record<string, ToolSchemaProperty>;
  required?: string[];
}

export interface Tool {
  name: string;
  description: string;
  schema: ToolSchema;
  execute: (input: unknown, context?: unknown) => Promise<unknown>;
}
