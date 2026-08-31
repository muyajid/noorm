class AppError extends Error {
  public status: string;
  public statusCode: number;
  public eror: unknown;
  constructor(
    status: string,
    statusCode: number,
    message: string,
    eror: unknown,
  ) {
    super(message);
    this.status = status;
    this.statusCode = statusCode;
    this.eror = eror;
  }
}

export const isAppEror = (err: any): boolean => {
  return err instanceof AppError;
};

export const createError = (
  statusCode: number,
  message: string,
  eror: unknown = null,
) => {
  return new AppError("failed", statusCode, message, eror);
};
