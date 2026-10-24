/**
 * Public API base URL.
 *
 * The Android CI workflow can override this value at build time for test
 * environments. Use HTTPS for any publicly distributed APK. The hostname is
 * a planned endpoint; DNS, TLS and backend availability must be verified
 * separately before expecting network requests to succeed.
 */
export const API_BASE_URL = 'https://api.yarsalam.top';
