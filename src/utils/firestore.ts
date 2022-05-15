import fbAdmin from 'firebase-admin';
import {
  default as infinityServiceAccount,
  default as pixelScoreServiceAccount
} from '../../creds/pixelscore-firebase-creds.json';

export const fsAdminPixelScore = fbAdmin.initializeApp(
  {
    credential: fbAdmin.credential.cert(pixelScoreServiceAccount as fbAdmin.ServiceAccount)
  },
  'pixelscore'
);

export const fsAdminInfinity = fbAdmin.initializeApp(
  {
    credential: fbAdmin.credential.cert(infinityServiceAccount as fbAdmin.ServiceAccount)
  },
  'infinity'
);

export const pixelScoreDb = fsAdminPixelScore.firestore();
export const infinityDb = fsAdminInfinity.firestore();
