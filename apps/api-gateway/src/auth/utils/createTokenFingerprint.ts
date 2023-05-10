import * as crypto from 'crypto';
import { createRandomString } from './createRandomString';
export const createTokenFingerprint = () => {
  const fingerprint = createRandomString(32);
  const fingerprintHash = crypto
    .createHash('sha256')
    .update(fingerprint)
    .digest('hex');
  return {
    fingerprint,
    fingerprintHash,
  };
};
