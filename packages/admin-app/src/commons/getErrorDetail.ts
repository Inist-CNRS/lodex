// The message of an error, whatever was thrown: the API answers with a
// translation key
export const getErrorDetail = (error: unknown): string =>
    error instanceof Error
        ? error.message
        : typeof error === 'object' && error && 'message' in error
          ? String(error.message)
          : String(error);
