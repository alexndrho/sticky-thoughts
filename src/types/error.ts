export type systemCode = "unknown-error" | "not-found";

export type databaseCode = "database/unique-constraint";

export type authCode = "auth/unauthorized";

export type validationCode =
  | "validation/unique-constraint"
  | "validation/invalid-input";

export type errorCode = systemCode | databaseCode | authCode | validationCode;

export default interface IError {
  errors: {
    code: errorCode;
    message: string;
  }[];
}
