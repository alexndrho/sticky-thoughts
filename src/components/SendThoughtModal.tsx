import { useState } from 'react';
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
  useMantineTheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import {
  MAX_AUTHOR_LENGTH,
  MAX_MESSAGE_LENGTH,
  submitThought,
} from '../services/thought';
import IThought, { NoteColor } from '../types/IThought';

const ANONYMOUS_AUTHOR = 'Anonymous';

interface SendThoughtModalProps {
  open: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

const SendThoughtModal = ({
  open,
  onSubmit,
  onClose,
}: SendThoughtModalProps) => {
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const isTextValid = (text: string) => text.trim().length > 0;

  const form = useForm({
    initialValues: {
      message: '',
      author: '',
      color: NoteColor.Yellow,
    },

    validate: {
      author: (value) =>
        isTextValid(value) || isAnonymous ? null : 'Invalid author',
      message: (value) => (isTextValid(value) ? null : 'Invalid message'),
      color: (value) =>
        Object.values(NoteColor).includes(value) ? null : 'Invalid color',
    },
  });

  const handleClose = () => {
    onClose();

    form.reset();
    setIsAnonymous(false);
  };

  const handleFormSubmit = async (
    values: Pick<IThought, 'author' | 'message' | 'color'>
  ) => {
    setLoading(true);

    if (isAnonymous) values.author = ANONYMOUS_AUTHOR;

    try {
      await submitThought(values);

      onSubmit();

      notifications.show({
        title: 'Thought submitted!',
        message: 'Your thought has been successfully submitted.',
        color: values.color,
      });
      onClose();
      form.reset();
      setIsAnonymous(false);

      setLoading(false);
    } catch (error) {
      console.error(error);

      notifications.show({
        title: 'Failed to submit thought',
        message: 'An error occurred while submitting your thought.',
        color: 'red',
      });

      setLoading(false);
    }
  };

  const handleAnonymousChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsAnonymous(event.currentTarget.checked);
    form.clearFieldError('author');
  };

  return (
    <Modal opened={open} onClose={handleClose} title="Share a thought" centered>
      <form
        onSubmit={form.onSubmit((values) => {
          void handleFormSubmit(values);
        })}
      >
        <TextInput
          mb="md"
          label="Author:"
          withAsterisk
          maxLength={MAX_AUTHOR_LENGTH}
          disabled={isAnonymous || loading}
          {...form.getInputProps('author')}
          value={isAnonymous ? ANONYMOUS_AUTHOR : form.values.author}
        />

        <Textarea
          label={'Message:'}
          withAsterisk
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={loading}
          {...form.getInputProps('message')}
        />

        <Text
          mb="sm"
          size="sm"
          ta="right"
        >{`${form.values.message.length}/${MAX_MESSAGE_LENGTH}`}</Text>

        <Switch
          mb="sm"
          label="Anonymous"
          checked={isAnonymous}
          disabled={loading}
          onChange={(e) => handleAnonymousChange(e)}
        />

        <Group justify="center">
          {Object.values(NoteColor).map((color) => (
            <ColorSwatch
              aria-label={`thought-theme-${color}`}
              type="button"
              key={color}
              component="button"
              color={theme.colors[color][5]}
              disabled={loading}
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
          <Button type="submit" loading={loading}>
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default SendThoughtModal;
