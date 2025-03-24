import { NoteColor } from "@/types/thought";

export const getColorFallback = (color: NoteColor) => {
  return Object.values(NoteColor).includes(color) ? color : NoteColor.Yellow;
};
