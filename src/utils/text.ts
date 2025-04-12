import { Profanity, ProfanityOptions } from "@2toad/profanity";

import badwords from "@/config/badwords.json";
import { urlRegex } from "@/config/text";

const options = new ProfanityOptions();
options.grawlix = "*****";

const profanity = new Profanity(options);
profanity.addWords([...badwords.filipino]);

export const containsUrl = (text: string) => {
  return urlRegex.test(text);
};

export const filterText = (text: string) => {
  try {
    return profanity.censor(text);
  } catch (error) {
    console.error(error);
    return text;
  }
};

export const extractKeyFromUrl = (url: string) => {
  const urlObj = new URL(url);
  return decodeURIComponent(urlObj.pathname.slice(1));
};
