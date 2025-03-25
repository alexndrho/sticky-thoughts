import type { Thought as ThoughtType } from "@prisma/client";
import { Box } from "@mantine/core";
import Thought from "./Thought";
import classes from "@/styles/thoughts.module.css";

export interface ThoughtsProps {
  thoughts: ThoughtType[];
}

export default function Thoughts({ thoughts }: ThoughtsProps) {
  return (
    <Box className={classes.thoughts}>
      {thoughts.map((thought) => (
        <Thought
          key={thought.id}
          message={thought.message}
          author={thought.author}
          color={thought.color}
          createdAt={thought.createdAt}
        />
      ))}
    </Box>
  );
}
