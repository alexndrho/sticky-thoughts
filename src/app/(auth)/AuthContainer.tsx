import { Paper } from "@mantine/core";

export function AuthContainer({ children }: { children?: React.ReactNode }) {
  return (
    <Paper w="100%" maw={420} p={30} shadow="md" radius="md" withBorder>
      {children}
    </Paper>
  );
}
