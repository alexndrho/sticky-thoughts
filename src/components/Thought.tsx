import { Box, Text, Tooltip } from '@mantine/core';
import { Timestamp } from 'firebase/firestore';
import { getFormattedDate } from '../utils/helper';
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
      <Box role="article" bg={`${color}.6`} className={classes.thought}>
        <Text lineClamp={9}>{message}</Text>
        <Text ta="right" lineClamp={1}>{`-${author}`}</Text>
      </Box>
    </Tooltip>
  );
};

export default Thought;
