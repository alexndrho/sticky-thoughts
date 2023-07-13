import { Box, createStyles } from '@mantine/core';

import Thought from './Thought';
import IThought from '../types/IThought';

const useStyles = createStyles(() => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 16.5rem)',
    justifyContent: 'center',
    gridGap: '1rem',
  },
}));

interface ThoughtsProps {
  thoughts: IThought[];
}

const Thoughts = ({ thoughts }: ThoughtsProps) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.grid}>
      {thoughts.map((thought) => (
        <Thought
          key={thought.id}
          message={thought.message}
          author={thought.author}
          color={thought.color}
        />
      ))}
    </Box>
  );
};

export default Thoughts;
