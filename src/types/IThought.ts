import firebase from 'firebase/compat/app';

enum NoteColor {
  Yellow = 'yellow',
  Blue = 'blue',
  Green = 'green',
  Red = 'red',
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
