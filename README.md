# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Book-based AI quizzes

The Books tab has a dropdown containing all 46 programs. Select a course to see its free learning resources; related programs may share foundational open textbooks.

Quizzes are generated on the server from the public book or chapter URL selected in the app. Each quiz must contain at least 20 distinct questions. The source must be publicly accessible over HTTPS and hosted on the selected book's domain; direct chapter pages and PDFs work better than book landing pages.

For local development, create a root `.env.local` file with a Groq API key:

```env
GROQ_API_KEY=your_groq_api_key
```

`.env.local` is ignored by Git. Never put this key in an `EXPO_PUBLIC_` variable or in client code. Run `npm start`; the app calls the `src/app/api/generate-quiz+api.ts` server route. Production deployments must configure `GROQ_API_KEY` as a server-side secret on the hosting provider. The route uses Groq's `openai/gpt-oss-20b` model with browser search; an optional `GROQ_MODEL` server variable can override the model with one that supports Groq browser search. Add authentication and rate limiting before exposing quiz generation publicly.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
"# adaptiveLRS" 
"# adaptiveLRS" 
