import createResponse from './createResponse';

type CreateErrorResponseOptions = {
  error?: unknown;
  message?: string;
  statusCode?: number;
  statusText?: string;
};

const createErrorResponse = ({
  error,
  message,
  statusCode = 400,
  statusText,
}: CreateErrorResponseOptions) => {
  if (error instanceof Error) {
    return createResponse({
      statusCode,
      statusText,
      body: {
        message,
        error,
      },
    });
  }
  return createResponse({
    statusCode,
    statusText,
    body: { message, error },
  });
};

export default createErrorResponse;
