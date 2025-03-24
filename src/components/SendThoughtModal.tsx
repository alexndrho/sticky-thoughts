"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useThrottledCallback } from "@mantine/hooks";
import { IconDiceFilled } from "@tabler/icons-react";

import { getQueryClient } from "@/app/providers";
import {
  MAX_AUTHOR_LENGTH,
  MAX_MESSAGE_LENGTH,
  submitThought,
} from "@/services/thought";
import { containsUrl, isTextValid } from "@/utils/text";
import { NoteColor } from "@/types/thought";
import classes from "@/styles/send-thought-modal.module.css";

const ANONYMOUS_AUTHOR = "Anonymous";

export interface SendThoughtModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SendThoughtModal({
  open,
  onClose,
}: SendThoughtModalProps) {
  const theme = useMantineTheme();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const randomColorButtonRef = useRef<HTMLButtonElement>(null);
  const randomColorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm({
    initialValues: {
      message: "",
      author:
        typeof window !== "undefined"
          ? localStorage.getItem("author") || ""
          : "",
      color: NoteColor.Yellow,
    },

    validate: {
      author: (value) => {
        if (!(isAnonymous || isTextValid(value, 2))) {
          return "Author is too short";
        } else if (containsUrl(value)) {
          return "Author cannot contain URLs";
        }

        return null;
      },
      message: (value) => {
        if (!isTextValid(value, 5)) {
          return "Message is too short";
        } else if (containsUrl(value)) {
          return "Message cannot contain URLs";
        }

        return null;
      },
      color: (value) =>
        Object.values(NoteColor).includes(value) ? null : "Invalid color",
    },

    transformValues: (values) => ({
      ...values,
      author: isAnonymous ? ANONYMOUS_AUTHOR : values.author,
    }),
  });

  const handleRandomColor = useThrottledCallback(() => {
    if (randomColorTimeoutRef.current) {
      randomColorButtonRef.current?.classList.remove(
        classes["random-button--clicked"],
      );
      clearTimeout(randomColorTimeoutRef.current);
    }

    randomColorButtonRef.current?.classList.add(
      classes["random-button--clicked"],
    );

    const randomColorTimeout = setTimeout(() => {
      randomColorButtonRef.current?.classList.remove(
        classes["random-button--clicked"],
      );

      randomColorTimeoutRef.current = null;
    }, 500);

    randomColorTimeoutRef.current = randomColorTimeout;

    // Get all colors except the current one.
    const colors = Object.values(NoteColor).filter(
      (color) => color !== form.values.color,
    );

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    form.setFieldValue("color", randomColor);
  }, 750);

  const mutation = useMutation({
    mutationFn: (values: typeof form.values) => {
      if (!isAnonymous) {
        localStorage.setItem("author", values.author);
        form.setInitialValues({
          message: "",
          author: values.author,
          color: NoteColor.Yellow,
        });
      }

      return submitThought({
        ...values,
      });
    },
    onError: (error) => {
      console.error(error);

      notifications.show({
        title: "Failed to submit thought",
        message: "An error occurred while submitting your thought.",
        color: "red",
      });
    },
    onSuccess: () => {
      getQueryClient()
        .invalidateQueries({ queryKey: ["thoughts"] })
        .catch(console.error);

      notifications.show({
        title: "Thought submitted!",
        message: "Your thought has been successfully submitted.",
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
    form.clearFieldError("author");
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
          {...form.getInputProps("author")}
          value={isAnonymous ? ANONYMOUS_AUTHOR : form.values.author}
        />

        <Textarea
          label={"Message:"}
          withAsterisk
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={mutation.isPending}
          {...form.getInputProps("message")}
        />

        <Text
          mb="sm"
          size="sm"
          ta="right"
          c={form.values.message.length >= MAX_MESSAGE_LENGTH ? "red" : ""}
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
                ref={randomColorButtonRef}
                className={classes["random-button"]}
                onClick={handleRandomColor}
              >
                <IconDiceFilled className={classes["dice-icon"]} />
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
              onClick={() => form.setFieldValue("color", color)}
              styles={(theme) => ({
                root: {
                  cursor: "pointer",
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
            Stick it!
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
