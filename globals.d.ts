declare module 'express';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
  }
}

declare var process: NodeJS.Process;