class AppError extends Error {
  public status: string;
  public statusCode: number;
  public error: unknown;
  constructor(
    status: string,
    statusCode: number,
    message: string,
    eror: unknown,
  ) {
    super(message);
    this.status = status;
    this.statusCode = statusCode;
    this.error = eror;
  }
}

export const isAppEror = (err: any): boolean => {
  return err instanceof AppError;
};

export const createError = (
  statusCode: number,
  message: string,
  error: unknown = null,
) => {
  return new AppError("failed", statusCode, message, error);
};
