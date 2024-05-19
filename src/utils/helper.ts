import { Profanity, ProfanityOptions } from '@2toad/profanity';
import badwords from '../config/badwords.json';
import { NoteColor } from '../types/IThought';

const options = new ProfanityOptions();
options.grawlix = '*****';

const profanity = new Profanity(options);
profanity.addWords([...badwords.filipino]);

const urlRegex =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/gi;

const formatTime = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
});

const formatDayTime = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
});

const formatDateTime = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
});

const isTextValid = (text: string, minLength = 0) => {
  minLength--;
  minLength = minLength < 0 ? 0 : minLength;
  return text.trim().length > minLength;
};

const containsUrl = (message: string) => {
  return urlRegex.test(message);
};

const filterText = (text: string) => {
  try {
    return profanity.censor(text);
  } catch (error) {
    return text;
  }
};

const getFormattedDate = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneWeekAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);

  if (date > today) {
    return formatTime.format(date);
  } else if (date > oneWeekAgo) {
    return formatDayTime.format(date);
  } else {
    return formatDateTime.format(date);
  }
};

const getColorFallback = (color: NoteColor) => {
  return Object.values(NoteColor).includes(color) ? color : NoteColor.Yellow;
};

export {
  isTextValid,
  containsUrl,
  filterText,
  getFormattedDate,
  getColorFallback,
};
