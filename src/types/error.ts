export type systemCode = "unknown-error" | "not-found";

export type databaseCode = "database/unique-constraint";

export type authCode = "auth/unauthorized";

export type userCode = "user/username-too-frequent";

export type validationCode =
  | "validation/unique-constraint"
  | "validation/invalid-input";

export type errorCode =
  | systemCode
  | databaseCode
  | authCode
  | userCode
  | validationCode;

export default interface IError {
  errors: {
    code: errorCode;
    message: string;
  }[];
}
