# In-app notifications (Yarsalam API + Socket.IO)

## Online delivery

- The mobile app connects to the authenticated Socket.IO namespace `/notification` using the current Yarsalam access token.
- Each notification is first stored in the Yarsalam backend inbox, then emitted to the recipient's private Socket.IO room when connected.
- Incoming events invalidate the notification, unread-count, interaction, system-notification and badge queries.
- Socket reconnect and app foreground transitions also refresh those query projections from the Yarsalam API.
- A bounded in-memory ID set prevents duplicate realtime toasts/local notifications during one authenticated socket session.

## Offline delivery and reconciliation

- A notification created while the user is offline remains stored and unread in the backend database.
- On the next authenticated Socket.IO connection, the client invalidates notification queries. The active notification queries refetch from the backend; screens opened later also fetch the invalidated cache.
- The API returns the most recent 500 records for the authenticated user. Read and click operations remain scoped to the authenticated user.
- No remote-push token is collected, stored or revoked by the mobile client.

## Platform limitation

Socket.IO requires the app process to be running and able to maintain a network connection. If Android or iOS fully suspends or terminates the app, the server cannot wake it or promise an immediate notification without the platform's remote-push infrastructure. Yarsalam does not use Firebase, FCM, APNs or another push provider. Stored notifications are retrieved when the app next reconnects.

## Local presentation

Notifee is retained only for local presentation of an event that reaches the running app over Socket.IO while the app is backgrounded. It is not a delivery service, does not register a remote token and cannot wake a terminated app.
