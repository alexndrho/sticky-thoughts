import { Timestamp } from "firebase/firestore";
import { Box, Text, Tooltip } from "@mantine/core";

import { getFormattedDate } from "@/utils/date";
import { getColorFallback } from "@/utils/color";
import { filterText } from "@/utils/text";
import classes from "@/styles/thought.module.css";
import { NoteColor } from "@/types/thought";

export interface NoteProps {
  message: string;
  author: string;
  color?: NoteColor;
  createdAt: Timestamp;
}

export default function Thought({
  message,
  author,
  color = NoteColor.Yellow,
  createdAt,
}: NoteProps) {
  return (
    <Tooltip label={getFormattedDate(createdAt?.toDate())} withArrow>
      <Box
        role="article"
        bg={`${getColorFallback(color)}.6`}
        className={classes.thought}
      >
        <Text lineClamp={9}>{filterText(message)}</Text>
        <Text ta="right" lineClamp={1}>{`-${filterText(author)}`}</Text>
      </Box>
    </Tooltip>
  );
}
