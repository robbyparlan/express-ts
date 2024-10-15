export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export interface CustomError extends Error {
  status?: number;
  code?: string;
  syscall?: string;
}

// Define the structure for a success response
export interface SuccessResponse<T> {
  success: true;     // Indicates success
  data: T;           // Generic type to hold the actual response data
  message?: string;  // Optional message (if any)
}

// Define the structure for a failed response
export interface ErrorResponse {
  success: false;    // Indicates failure
  message: string;  // Optional message (if any)
  error?: any;     // The error
  code?: number;     // Optional error code
}

// Define endpoint version
export const ApiEndpointVersion = {
  version: '/api/v1'
}