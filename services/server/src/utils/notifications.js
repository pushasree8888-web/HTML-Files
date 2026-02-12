const admin = require('firebase-admin');

function initFirebase() {
  if (admin.apps.length) return;
  const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credsJson) return;
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(credsJson))
    });
  } catch (e) {
    // ignore for local dev
  }
}

async function sendNotification(token, title, body, data = {}) {
  if (!admin.apps.length) return;
  try {
    await admin.messaging().send({ token, notification: { title, body }, data });
  } catch (e) {
    // ignore errors for now
  }
}

module.exports = { initFirebase, sendNotification };
