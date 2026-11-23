// The real values live in /firebase-config.js (editable without rebuilding).
export const firebaseConfig = window.WALLEH_FIREBASE_CONFIG || {};
export const isFirebaseConfigured = !!firebaseConfig.apiKey && !Object.values(firebaseConfig).some((v) => String(v).includes('PASTE_'));
