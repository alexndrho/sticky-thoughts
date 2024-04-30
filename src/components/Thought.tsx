import Filter from 'bad-words';
import { Box, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { NoteColor } from '../types/IThought';
import classes from '../styles/Thought.module.css';

interface NoteProps {
  message: string;
  author: string;
  color?: NoteColor;
}

const Thought = ({ message, author, color = NoteColor.Yellow }: NoteProps) => {
  const [colorResult, setColorResult] = useState<NoteColor>(color);
  const filter = new Filter();

  const filterText = (text: string) => {
    try {
      return filter.clean(text);
    } catch (error) {
      return text;
    }
  };

  useEffect(() => {
    const validColor = Object.values(NoteColor).includes(color)
      ? color
      : NoteColor.Yellow;
    setColorResult(validColor);
  }, [color]);

  return (
    <Box role="article" bg={`${colorResult}.6`} className={classes.thought}>
      <Text lineClamp={9}>{filterText(message)}</Text>
      <Text ta="right" lineClamp={1}>{`-${filterText(author)}`}</Text>
    </Box>
  );
};

export default Thought;
