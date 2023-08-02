import { Button, createStyles } from '@mantine/core';
import { IconArrowBigUpFilled } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

const useStyles = createStyles(() => ({
  button: {
    position: 'fixed',
    right: 20,
    bottom: 20,
    zIndex: 90,

    width: '3.5rem',
    height: '3.5rem',
    padding: 0,
  },
}));

const ScrollUpButton = () => {
  const { classes } = useStyles();
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
          className={classes.button}
          onClick={handleScrollUp}
        >
          <IconArrowBigUpFilled />
        </Button>
      )}
    </>
  );
};

export default ScrollUpButton;
