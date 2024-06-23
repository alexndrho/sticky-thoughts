import { useRef, useState } from 'react';
import {
  Button,
  CheckIcon,
  ColorSwatch,
  Group,
  Modal,
  Switch,
  Text,
  TextInput,
  Textarea,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useForm } from '@mantine/form';
import { useThrottledCallback } from '@mantine/hooks';
import queryClient from '../queryClient';
import {
  MAX_AUTHOR_LENGTH,
  MAX_MESSAGE_LENGTH,
  submitThought,
} from '../utils/thought';
import { NoteColor } from '../types/IThought';
import { containsUrl, isTextValid } from '../utils/helper';
import classes from '../styles/SendThoughtModal.module.css';
import { IconDiceFilled } from '@tabler/icons-react';

const ANONYMOUS_AUTHOR = 'Anonymous';

interface SendThoughtModalProps {
  open: boolean;
  onClose: () => void;
}

const SendThoughtModal = ({ open, onClose }: SendThoughtModalProps) => {
  const theme = useMantineTheme();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const randomButtonRef = useRef<HTMLButtonElement>(null);

  const form = useForm({
    initialValues: {
      message: '',
      author: '',
      color: NoteColor.Yellow,
    },

    validate: {
      author: (value) => {
        if (!(isAnonymous || isTextValid(value, 2))) {
          return 'Author is too short';
        } else if (containsUrl(value)) {
          return 'Author cannot contain URLs';
        }

        return null;
      },
      message: (value) => {
        if (!isTextValid(value, 5)) {
          return 'Message is too short';
        } else if (containsUrl(value)) {
          return 'Message cannot contain URLs';
        }

        return null;
      },
      color: (value) =>
        Object.values(NoteColor).includes(value) ? null : 'Invalid color',
    },
  });

  const handleRandomColor = useThrottledCallback(() => {
    randomButtonRef.current?.classList.add(classes['random-button--clicked']);

    setTimeout(() => {
      randomButtonRef.current?.classList.remove(
        classes['random-button--clicked'],
      );
    }, 500);

    // Get all colors except the current one.
    const colors = Object.values(NoteColor).filter(
      (color) => color !== form.values.color,
    );

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    form.setFieldValue('color', randomColor);
  }, 500);

  const mutation = useMutation({
    mutationFn: (values: typeof form.values) =>
      submitThought({
        ...values,
        author: isAnonymous ? ANONYMOUS_AUTHOR : values.author,
      }),
    onError: (error) => {
      console.error(error);

      notifications.show({
        title: 'Failed to submit thought',
        message: 'An error occurred while submitting your thought.',
        color: 'red',
      });
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ['thoughts'] })
        .catch(console.error);

      notifications.show({
        title: 'Thought submitted!',
        message: 'Your thought has been successfully submitted.',
        color: `${form.values.color}.6`,
      });
      onClose();
      form.reset();
      setIsAnonymous(false);
    },
  });

  const handleAnonymousChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsAnonymous(event.currentTarget.checked);
    form.clearFieldError('author');
  };

  return (
    <Modal opened={open} onClose={onClose} title="Share a thought" centered>
      <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
        <TextInput
          mb="md"
          label="Author:"
          withAsterisk
          maxLength={MAX_AUTHOR_LENGTH}
          disabled={isAnonymous || mutation.isPending}
          {...form.getInputProps('author')}
          value={isAnonymous ? ANONYMOUS_AUTHOR : form.values.author}
        />

        <Textarea
          label={'Message:'}
          withAsterisk
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={mutation.isPending}
          {...form.getInputProps('message')}
        />

        <Text
          mb="sm"
          size="sm"
          ta="right"
          c={form.values.message.length >= MAX_MESSAGE_LENGTH ? 'red' : ''}
        >{`${form.values.message.length}/${MAX_MESSAGE_LENGTH}`}</Text>

        <Switch
          mb="sm"
          label="Anonymous"
          checked={isAnonymous}
          disabled={mutation.isPending}
          onChange={(e) => handleAnonymousChange(e)}
        />

        <Group justify="center">
          <Tooltip label="Randomize color" position="left">
            {/* Use a span to prevent tooltip jittering. */}
            <span>
              <UnstyledButton
                ref={randomButtonRef}
                className={classes['random-button']}
                onClick={handleRandomColor}
              >
                <IconDiceFilled className={classes['dice-icon']} />
              </UnstyledButton>
            </span>
          </Tooltip>

          {Object.values(NoteColor).map((color) => (
            <ColorSwatch
              aria-label={`thought-theme-${color}`}
              type="button"
              key={color}
              component="button"
              color={theme.colors[color][5]}
              disabled={mutation.isPending}
              onClick={() => form.setFieldValue('color', color)}
              styles={(theme) => ({
                root: {
                  cursor: 'pointer',
                  color: theme.colors.gray[0],
                },
              })}
            >
              {color === form.values.color && <CheckIcon width="0.75em" />}
            </ColorSwatch>
          ))}
        </Group>

        <Group justify="right" mt="md">
          <Button type="submit" loading={mutation.isPending}>
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default SendThoughtModal;
