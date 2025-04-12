"use client";

import { createTheme, Menu, Tooltip } from "@mantine/core";

export const theme = createTheme({
  cursorType: "pointer",
  components: {
    Menu: Menu.extend({
      defaultProps: {
        withArrow: true,
      },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        withArrow: true,
      },
    }),
  },
});
