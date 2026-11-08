# Android production release signing

The normal Android test workflow deliberately uses the repository debug key and is **not** suitable for public distribution. Production APKs are built only by `.github/workflows/android-production-release.yml` and require the same private keystore for every future update.

## 1. Generate the release keystore once

Run this on a trusted machine. Keep the keystore and passwords in a secure password manager / encrypted backup. Do not commit the keystore or send it in chat.

```bash
keytool -genkeypair -v \
  -keystore yarsalam-release.jks \
  -alias yarsalam-release \
  -keyalg RSA -keysize 2048 \
  -validity 10000
```

Use a strong keystore password and key password. Record the exact alias. Do not generate a new key for each release: Android updates must remain signed with the same app-signing identity.

## 2. Add GitHub Actions repository secrets

In `yarsalam/mobile`, open **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret name | Value |
|---|---|
| `ANDROID_RELEASE_KEYSTORE_BASE64` | Base64-encoded contents of `yarsalam-release.jks` |
| `ANDROID_RELEASE_STORE_PASSWORD` | Keystore password |
| `ANDROID_RELEASE_KEY_ALIAS` | `yarsalam-release` (or the alias you chose) |
| `ANDROID_RELEASE_KEY_PASSWORD` | Key password |

On Linux, produce the Base64 value without line wrapping:

```bash
base64 -w 0 yarsalam-release.jks
```

Paste that output directly into the GitHub secret value. Never paste the keystore or passwords into an issue, PR, source file, or this conversation.

## 3. Build the signed APK

After the signing secrets exist and this PR has been merged to `main`, open **Actions → Android production signed release → Run workflow**. Confirm the API origin is `https://api.yarsalam.top`.

The workflow validates the HTTPS API URL, installs locked dependencies, runs strict lint on the changed release features and Jest, builds both ARM variants, verifies APK signatures, and uploads APKs plus checksums as a 14-day artifact. It does not publish a public GitHub release or deploy files to `yarsalam.top`.

## 4. Website handoff

The final APKs still need to be linked from the public website's actual source repository and its release/deployment pipeline. The mobile repository alone cannot update the public website. Keep the release keystore backed up offline; loss of the key can prevent in-place upgrades of the published Android app.
