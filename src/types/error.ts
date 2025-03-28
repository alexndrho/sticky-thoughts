export type systemCode = "unknown-error" | "not-found";

export type authCode =
  | "auth/invalid-input"
  | "auth/invalid-username"
  | "auth/invalid-email"
  | "auth/invalid-password";

export type validationCode =
  | "validation/unique-constraint"
  | "validation/invalid-input";

export type errorCode = systemCode | authCode | validationCode;

export default interface IError {
  errors: {
    code: errorCode;
    message: string;
  }[];
}
