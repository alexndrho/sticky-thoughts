import { Box, Text, Tooltip } from "@mantine/core";

import { getFormattedDate } from "@/utils/date";
import { getColorFallback } from "@/utils/color";
import { filterText } from "@/utils/text";
import classes from "@/styles/thought.module.css";

export interface NoteProps {
  message: string;
  author: string;
  color: string;
  createdAt: Date;
}

export default function Thought({
  message,
  author,
  color,
  createdAt,
}: NoteProps) {
  return (
    <Tooltip label={getFormattedDate(createdAt)}>
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
