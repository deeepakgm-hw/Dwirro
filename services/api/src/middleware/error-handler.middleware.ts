import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { logger } from '@aip/logger';
import { ErrorCode, ErrorCodeType } from '@aip/shared-types';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCodeType,
    message: string,
    public readonly statusCode: number = 400,
    public readonly details: unknown = null,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply) {
  const duration = request.startTime ? Date.now() - request.startTime : 0;
  const requestId = request.requestId || 'unknown';

  let statusCode = 500;
  let code: ErrorCodeType = ErrorCode.PROVIDER_ERROR;
  let message = 'An unexpected internal error occurred';
  let details: unknown = null;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
    details = error.details;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    code = ErrorCode.INVALID_DATA;
    message = 'Validation error occurred on request payload or parameters';
    details = error.errors;
  } else if ('validation' in error) {
    statusCode = 400;
    code = ErrorCode.INVALID_DATA;
    message = error.message;
    details = (error as unknown as { validation: unknown }).validation;
  } else if ('statusCode' in error && typeof (error as FastifyError).statusCode === 'number') {
    statusCode = (error as FastifyError).statusCode || 500;
    message = error.message;
  }

  logger.error({
    request_id: requestId,
    user_id: (request.headers['x-user-id'] as string) || 'anonymous',
    module: 'api',
    action: 'request_error',
    duration,
    status: statusCode,
    error_code: code,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  }, `Request failed with error: ${message}`);

  return reply.status(statusCode).send({
    error: {
      code,
      message,
      details,
      request_id: requestId,
    },
  });
}
