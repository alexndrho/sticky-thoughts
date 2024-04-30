import { Box } from '@mantine/core';
import Thought from './Thought';
import IThought from '../types/IThought';
import classes from '../styles/Thoughts.module.css';

interface ThoughtsProps {
  thoughts: IThought[];
}

const Thoughts = ({ thoughts }: ThoughtsProps) => {
  return (
    <Box className={classes.thoughts}>
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
