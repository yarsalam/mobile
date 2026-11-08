# Android signed production release

The regular `Android test APK` workflow builds debug-signed test artifacts only. Those files must not be distributed as production releases.

## One-time owner setup

Use the existing production Android signing keystore if one already exists. Do not generate a replacement if the app has previously been distributed under a different signing certificate.

If no production keystore exists and this is the first public release, create and securely back up a new keystore using the Android/Java `keytool` utility. Store the keystore and its passwords in an approved password manager and offline backup. Never commit the keystore or passwords.

In GitHub repository Settings → Secrets and variables → Actions, add these repository secrets:

- `ANDROID_KEYSTORE_BASE64`: Base64 encoding of the complete keystore file (one line).
- `ANDROID_KEYSTORE_PASSWORD`: keystore password.
- `ANDROID_KEY_ALIAS`: signing key alias.
- `ANDROID_KEY_PASSWORD`: signing key password.

Do not paste any of these values into issues, pull requests, chat, workflow logs, or repository files.

## Release workflow

After the reviewed mobile PR is merged and the signing secrets are configured, run the manual workflow **Android signed production release**:
- Select the exact reviewed source ref (prefer the approved `main` commit).
- Set API origin to `https://api.yarsalam.top`.
- The workflow builds ABI-specific release APKs, verifies each signature with `apksigner`, records SHA-256 checksums and the source commit, and uploads a 30-day release-candidate artifact.
- It does not create a public GitHub Release or publish to an app store.

Before distribution, independently verify the signing certificate fingerprint against the previously approved certificate and retain the keystore securely. Changing the keystore after the first release can prevent users from upgrading the installed app.
