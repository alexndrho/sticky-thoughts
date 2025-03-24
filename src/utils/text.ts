import { Profanity, ProfanityOptions } from "@2toad/profanity";
import badwords from "@/config/badwords.json";

const options = new ProfanityOptions();
options.grawlix = "*****";

const profanity = new Profanity(options);
profanity.addWords([...badwords.filipino]);

const urlRegex =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/gi;

export const isTextValid = (text: string, minLength = 0) => {
  minLength--;
  minLength = minLength < 0 ? 0 : minLength;
  return text.trim().length > minLength;
};

export const containsUrl = (message: string) => {
  return urlRegex.test(message);
};

export const filterText = (text: string) => {
  try {
    return profanity.censor(text);
  } catch (error) {
    console.error(error);
    return text;
  }
};
