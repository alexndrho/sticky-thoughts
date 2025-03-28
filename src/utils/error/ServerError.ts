import type IError from "@/types/error";

export default class ServerError extends Error {
  issues: IError;

  constructor(message: string, issues: IError) {
    super(message);
    this.name = "ServerError";
    this.issues = issues;

    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
