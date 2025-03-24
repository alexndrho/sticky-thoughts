"use client";

import { Affix, Button, Transition } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowBigUpFilled } from "@tabler/icons-react";

export default function ScrollUpButton() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ bottom: 20, right: 20 }} zIndex={90}>
      <Transition transition="slide-up" mounted={scroll.y > 0}>
        {(transitionStyles) => (
          <Button
            aria-label="Scroll to top"
            w="3.5rem"
            h="3.5rem"
            style={{ ...transitionStyles }}
            onClick={() => scrollTo({ y: 0 })}
          >
            <IconArrowBigUpFilled />
          </Button>
        )}
      </Transition>
    </Affix>
  );
}
