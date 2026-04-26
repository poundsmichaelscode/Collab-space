declare module 'multer' {
  import { RequestHandler } from 'express';

  export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  }

  export type StorageEngine = unknown;

  export interface DiskStorageOptions {
    destination?: (
      req: import('express').Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void
    ) => void;
    filename?: (
      req: import('express').Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void
    ) => void;
  }

  export interface Multer {
    single(fieldName: string): RequestHandler;
  }

  export interface MulterStatic {
    (options?: Record<string, unknown>): Multer;
    diskStorage(options: DiskStorageOptions): StorageEngine;
  }

  const multer: MulterStatic;
  export default multer;
}

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }

    interface Request {
      file?: Multer.File;
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
    }
  }
}

export {};
