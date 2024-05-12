import Filter from 'bad-words';
import { NoteColor } from '../types/IThought';

const filter = new Filter();

const isTextValid = (text: string, minLength = 0) => {
  minLength--;
  minLength = minLength < 0 ? 0 : minLength;
  return text.trim().length > minLength;
};

const containsUrl = (message: string) => {
  const urlRegex =
    /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;
  return urlRegex.test(message);
};

const filterText = (text: string) => {
  try {
    return filter.clean(text);
  } catch (error) {
    return text;
  }
};

const getColorFallback = (color: NoteColor) => {
  return Object.values(NoteColor).includes(color) ? color : NoteColor.Yellow;
};

export { isTextValid, containsUrl, filterText, getColorFallback };
