import { FieldValue, Timestamp } from "firebase/firestore";

enum NoteColor {
  Yellow = "yellow",
  Blue = "blue",
  Red = "red",
  Violet = "violet",
  Green = "green",
  Pink = "pink",
}

interface IThought {
  id: string;
  author: string;
  lowerCaseAuthor: string;
  message: string;
  color: NoteColor;
  createdAt: Timestamp;
}

interface IThoughtSubmit extends Omit<IThought, "id" | "createdAt"> {
  createdAt: FieldValue;
}

export default IThought;
export type { IThoughtSubmit };
export { NoteColor };
