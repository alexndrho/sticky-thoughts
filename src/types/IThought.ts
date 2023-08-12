import firebase from 'firebase/compat/app';

enum NoteColor {
  Yellow = 'yellow',
  Blue = 'blue',
  Red = 'red',
  Violet = 'violet',
  Green = 'green',
  Pink = 'pink',
}

interface IThought {
  id: string;
  author: string;
  lowerCaseAuthor: string;
  message: string;
  color: NoteColor;
  createdAt: firebase.firestore.Timestamp;
}

export default IThought;
export { NoteColor };
