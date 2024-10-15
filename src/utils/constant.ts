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
export interface ErrorResponse<T> {
  success: false;    // Indicates failure
  message: string;  // Optional message (if any)
  error?: T;     // The error
  code?: number;     // Optional error code
}

// Define endpoint version
export const ApiEndpointVersion = {
  version: '/api/v1'
}