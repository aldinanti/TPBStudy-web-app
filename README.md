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

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## iOS: Build and Submit (recommended: EAS)

Quick steps to produce an iOS build and upload to TestFlight using EAS:

1. Install EAS CLI and login:
```bash
npm install -g eas-cli
eas login
```

2. Ensure dependencies are installed:
```bash
npm install
```

3. Configure credentials during the build (EAS can manage them for you):
```bash
eas build --platform ios --profile production
```

4. Submit the most recent build to App Store Connect / TestFlight:
```bash
eas submit -p ios --latest
```

Notes and troubleshooting:
- `app.json` contains `expo.ios.bundleIdentifier` set to `com.leticiaaldina.TPBStudy` and `buildNumber` set to `1.0.0`.
- If you prefer a local Xcode build, run `expo prebuild` (if needed), `cd ios && npx pod-install`, then open `ios/TPBStudy.xcworkspace` in Xcode.
- You must have an Apple Developer account to distribute via TestFlight/App Store; EAS can request access and handle signing if you grant it.

## CI: Automated EAS iOS builds and TestFlight submission

A GitHub Actions workflow is included at `.github/workflows/eas-build.yml`. It performs an EAS iOS build and optionally submits the latest build to TestFlight.

Required repository secrets (set these in GitHub Settings → Secrets):

- `EAS_TOKEN` — create with `eas token:create` locally and add the token as a secret.
- `APP_STORE_CONNECT_API_KEY_BASE64` — base64-encoded contents of your App Store Connect API key `.p8` file. Create by running:
```bash
base64 -w0 AuthKey_MYKEYID.p8 > asc_key_base64.txt
```
and copy the file contents into the secret value.
- `APP_STORE_CONNECT_ISSUER_ID` — your App Store Connect API issuer ID.
- `APP_STORE_CONNECT_KEY_ID` — the key ID for the `.p8` key.

How the workflow is triggered:
- On push to `main`.
- Manually via `Actions → EAS iOS Build & Submit → Run workflow`.

If you don't want automated submission, omit the App Store Connect secrets and the workflow will only build.
