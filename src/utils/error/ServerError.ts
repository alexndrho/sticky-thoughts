import type IError from "@/types/error";

export default class ServerError extends Error {
  errors: IError["errors"];

  constructor(message: string, errors: IError["errors"]) {
    super(message);
    this.name = "ServerError";
    this.errors = errors;

    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export function toServerError(
  message: string,
  errors: IError["errors"],
): ServerError {
  return new ServerError(message, errors);
}
