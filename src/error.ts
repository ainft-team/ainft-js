import { ErrorCode } from './types';

export class AinftError extends Error {
  readonly code: ErrorCode;
  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.message = message;
  }
}
