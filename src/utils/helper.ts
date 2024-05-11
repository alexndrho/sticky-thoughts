const containsUrl = (message: string) => {
  const urlRegex =
    /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;
  return urlRegex.test(message);
};

export { containsUrl };
