export abstract class BaseError extends Error {
  constructor(public readonly errorMessage: string) {
    super(errorMessage);
  }
}
