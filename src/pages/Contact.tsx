import { Button, Container, Text, Title, createStyles } from '@mantine/core';
import { useEffect } from 'react';
import Footer from '../components/FooterBar';
import { IconMail } from '@tabler/icons-react';

interface IContact {
  title: string;
}

const useStyles = createStyles(() => ({
  main: {
    paddingTop: '7.5rem',
    paddingBottom: '7.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  email: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25em',
  },
}));

const Contact = ({ title }: IContact) => {
  const { classes } = useStyles();

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <Container role="main" size="lg" className={classes.main}>
        <Title align="center" color="blue">
          Get in Touch
        </Title>

        <Text span fz="xl" fs="italic" align="center" display="block">
          We would love to hear from you.
        </Text>

        <Text fz="xl" align="center">
          If you have any questions, please feel free to reach out.
        </Text>

        <Text fz="xl" my="md" className={classes.email}>
          <IconMail size="1.25em" />
          ho.alexander.g@gmail.com
        </Text>

        <Button component="a" href="mailto:ho.alexander.g@gmail.com">
          Send a Mail
        </Button>
      </Container>

      <Footer />
    </>
  );
};

export default Contact;
