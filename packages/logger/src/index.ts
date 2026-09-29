import pino, { Logger as PinoLogger, LoggerOptions } from 'pino';

export interface LogContext {
  request_id?: string;
  user_id?: string;
  module?: string;
  action?: string;
  duration?: number;
  status?: string | number;
  [key: string]: unknown;
}

const defaultOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

export const rootLogger: PinoLogger = pino(defaultOptions);

export function createChildLogger(bindings: LogContext): PinoLogger {
  return rootLogger.child(bindings);
}

export const logger = rootLogger;
export default {};
