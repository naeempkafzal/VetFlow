import * as core from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request extends core.Request {}
    interface Response extends core.Response {}
  }
}

declare module 'express';