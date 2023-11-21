import {
  Anchor,
  Box,
  Container,
  Image,
  Text,
  Title,
  createStyles,
} from '@mantine/core';
import Footer from '../components/FooterBar';
import noteImg from '../assets/note.svg';

const useStyles = createStyles((theme) => ({
  main: {
    paddingTop: '7.5rem',
    paddingBottom: '7.5rem',
    display: 'flex',
    gap: '2.5rem',

    [theme.fn.smallerThan('lg')]: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '5rem',
      paddingBottom: '5rem',
    },
  },

  secondaryTitle: {
    display: 'block',
  },

  logoImage: {
    alignSelf: 'center',

    [theme.fn.smallerThan('lg')]: {
      display: 'none',
    },
  },
}));

const About = () => {
  const { classes } = useStyles();

  return (
    <>
      <Container role="main" size="lg" className={classes.main}>
        <Box>
          <Title>
            Sticky
            <Text span c="blue.6" inherit>
              Thoughts
            </Text>
            <Text span fz="xl" fs="italic" className={classes.secondaryTitle}>
              A place to share your thoughts.
            </Text>
          </Title>
          <Text mt="lg" fz="lg">
            Sticky Thoughts offers a platform where you can freely express
            yourself and share your thoughts and experiences with others. You
            have the option to remain anonymous or not. You can post anything
            that you want including your thoughts, experiences, and even your
            secrets. You can also read other people's notes. The notes can be
            customized by using different colors, and you can search for other
            people's notes by their names. There is no limit to the number of
            notes you can add.
          </Text>
          <Text mt="lg" fz="lg"></Text>
          <Text mt="lg" fz="lg">
            StickyThoughts is a project by{' '}
            <Anchor href="https://alexndrho.dev" target="_blank" inherit>
              Alexander Gabriel Ho
            </Anchor>
            . This online freedom wall serves as a platform to provide an
            emotional outlet for its users.
          </Text>
        </Box>

        <Image src={noteImg} maw={350} className={classes.logoImage} />
      </Container>

      <Footer />
    </>
  );
};

export default About;
