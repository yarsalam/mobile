# Firebase Cloud Messaging setup for Yarsalam

## Current implementation

The mobile app uses React Native Firebase 26.4.2 for native FCM registration and the backend FCM HTTP v1 sender.

- The app requests notification permission after a permanent authenticated session is present.
- It obtains the native FCM registration token and sends it to the authenticated `POST /user-device` endpoint with the app's device ID, platform, app version and IANA timezone.
- Token refresh events update the server record.
- Logout calls `DELETE /user-device/push` for the current device (best-effort; local logout is never blocked by network failure).
- Foreground FCM messages are displayed through Notifee.
- Tapping a remote notification opens the notifications screen and sends a click event to the backend.
- The existing authenticated WebSocket and local unread-notification fallback stay enabled.

The Android test APK can compile without a Firebase project file, but remote push is not configured until the owner adds the Firebase app configuration. In that state the app logs a development-only warning and continues with existing WebSocket/local fallback notifications.

## Firebase project owner actions

1. Create/select the Firebase project used by Yarsalam.
2. Register the Android application with package name `com.yarsalam`.
3. Download that app's `google-services.json` and add it at `android/app/google-services.json`. Do not commit private service-account JSON.
4. Decide and configure the permanent iOS bundle identifier in the Xcode target. The repository currently contains a React Native template bundle-ID placeholder; do not create an iOS Firebase app until that is replaced with the owner-approved identifier.
5. Register the iOS app in the same Firebase project using the approved bundle identifier. Add `GoogleService-Info.plist` to the Xcode app target (not merely the folder).
6. Upload an APNs authentication key in Firebase Console for iOS push delivery.
7. Provide a backend service account with FCM send permission. Store its complete JSON as the runtime secret `FIREBASE_SERVICE_ACCOUNT_JSON` in the backend secret store. Never place the private key in this repository, the mobile app, or a client-side environment variable.

## Staging acceptance

Before enabling any production push campaign, verify on real devices:

- permission granted, denied and later revoked
- Android foreground, background and app-terminated delivery
- iOS foreground, background and app-terminated delivery
- token refresh and logout/revoke
- invalid/unregistered token cleanup
- app open/click attribution
- user is not sent a re-engagement push while online
- no re-engagement delivery outside 09:00–21:00 local device time
- no more than three automated re-engagement reminders in a rolling 30-day window

The server migration must be reviewed and applied in staging before testing device registration. Keep TypeORM `DB_SYNC=false`; do not rely on automatic schema synchronization.
