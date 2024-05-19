import { Box, Text, Tooltip } from '@mantine/core';
import { Timestamp } from 'firebase/firestore';
import {
  filterText,
  getColorFallback,
  getFormattedDate,
} from '../utils/helper';
import { NoteColor } from '../types/IThought';
import classes from '../styles/Thought.module.css';

interface NoteProps {
  message: string;
  author: string;
  color?: NoteColor;
  createdAt: Timestamp;
}

const Thought = ({
  message,
  author,
  color = NoteColor.Yellow,
  createdAt,
}: NoteProps) => {
  return (
    <Tooltip label={getFormattedDate(createdAt?.toDate())}>
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
};

export default Thought;
