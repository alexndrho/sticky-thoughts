import { Box, Text, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { NoteColor } from '../types/IThought';

const useStyles = createStyles((theme) => ({
  card: {
    width: '100%',
    aspectRatio: '9 / 10',
    padding: '0.75em',

    color: theme.colors.dark[9],
    overflowWrap: 'break-word',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

interface NoteProps {
  message: string;
  author: string;
  color?: NoteColor;
}

const Thought = ({ message, author, color = NoteColor.Yellow }: NoteProps) => {
  const { classes } = useStyles();
  const [colorResult, setColorResult] = useState<string>(color);

  useEffect(() => {
    const validColor = Object.values(NoteColor).includes(color)
      ? color
      : NoteColor.Yellow;
    setColorResult(validColor);
  }, [color]);

  return (
    <Box bg={`${colorResult}.5`} className={classes.card}>
      <Text>{message}</Text>
      <Text ta="right">{`-${author}`}</Text>
    </Box>
  );
};

export default Thought;
