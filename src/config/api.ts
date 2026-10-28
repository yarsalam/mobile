/**
 * Single source of truth for REST and Socket.IO connections.
 *
 * Public APKs must use the public HTTPS API hostname reachable by users'
 * devices. Never embed a developer LAN address (for example, 192.168.x.x):
 * phones outside that private network cannot route to it.
 *
 * DNS, TLS and backend availability still need to be verified separately.
 */
export const API_BASE_URL = 'https://api.yarsalam.top';
