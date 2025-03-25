export type systemCode = "unknown-error" | "not-found";

export type validationCode =
  | "validation/unique-constraint"
  | "validation/invalid-input";

export type errorCode = systemCode | validationCode;

export default interface IError {
  errors: {
    code: errorCode;
    message: string;
  }[];
}
