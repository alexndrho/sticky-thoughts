import { Box, Text } from '@mantine/core';
import { NoteColor } from '../types/IThought';
import classes from '../styles/Thought.module.css';

interface NoteProps {
  message: string;
  author: string;
  color?: NoteColor;
}

const Thought = ({ message, author, color = NoteColor.Yellow }: NoteProps) => {
  return (
    <Box role="article" bg={`${color}.6`} className={classes.thought}>
      <Text lineClamp={9}>{message}</Text>
      <Text ta="right" lineClamp={1}>{`-${author}`}</Text>
    </Box>
  );
};

export default Thought;
