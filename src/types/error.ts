export type systemCode = "unknown-error" | "not-found";

export type authCode = "auth/unauthorized";

export type validationCode =
  | "validation/unique-constraint"
  | "validation/invalid-input"
  | "validation/too-large";

export type errorCode = systemCode | authCode | validationCode;

export default interface IError {
  errors: {
    code: errorCode;
    message: string;
  }[];
}
