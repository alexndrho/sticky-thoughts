export type systemCode = "unknown-error" | "not-found";

export type authCode = "auth/unauthorized";

export type validationCode =
  | "validation/unique-constraint"
  | "validation/invalid-input"
  | "validation/too-large";

export type forumCode = "forum/title-already-exists";

export type errorCode = systemCode | authCode | validationCode | forumCode;

export default interface IError {
  errors: {
    code: errorCode;
    message: string;
  }[];
}
