import { Button } from '@mantine/core';
import { IconArrowBigUpFilled } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

const ScrollUpButton = () => {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showButton && (
        <Button
          aria-label="Scroll to top"
          w="3.5rem"
          h="3.5rem"
          pos="fixed"
          bottom="1.75rem"
          right="2rem"
          style={{ zIndex: 90 }}
          onClick={handleScrollUp}
        >
          <IconArrowBigUpFilled />
        </Button>
      )}
    </>
  );
};

export default ScrollUpButton;
