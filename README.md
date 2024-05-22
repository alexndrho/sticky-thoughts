# Sticky Thoughts

Sticky Thoughts is a wall to share your thoughts, opinions, and experiences anonymously or not. Whether you're looking to vent about your day, share your political views, or connect with other people.

## Setup

1. Clone this repo
2. Run `npm install`
3. Create a Firebase project. You can follow the instructions [here](https://firebase.google.com/docs/web/setup#create-project).
4. Create a `.env.local` file in the root directory and add the following:

```
VITE_FIREBASE_API_KEY=<YOUR_API_KEY>
VITE_FIREBASE_AUTH_DOMAIN=<YOUR_AUTH_DOMAIN>
VITE_FIREBASE_PROJECT_ID=<YOUR_PROJECT_ID>
VITE_FIREBASE_STORAGE_BUCKET=<YOUR_STORAGE_BUCKET>
VITE_FIREBASE_MESSAGING_SENDER_ID=<YOUR_MESSAGING_SENDER_ID>
VITE_FIREBASE_APP_ID=<YOUR_APP_ID>
VITE_FIREBASE_MEASUREMENT_ID=<YOUR_MEASUREMENT_ID>
```

Replace the placeholders with the values from your Firebase project.

5. Run `npm run dev`
6. Navigate to `localhost:5173`
7. 🎉

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Mantine](https://mantine.dev/)
- [Tabler Icons](https://tabler-icons.io/)

## License

[GPL-3.0](LICENSE)
