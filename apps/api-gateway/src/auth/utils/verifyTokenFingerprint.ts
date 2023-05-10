import * as crypto from 'crypto';
export const verifyTokenFingerprint = (
  fingerprint: string,
  fingerprintHash: string,
) => {
  const fingerprintHashCheck: string = crypto
    .createHash('sha256')
    .update(fingerprint)
    .digest('hex');
  if (fingerprintHash !== fingerprintHashCheck) return false;
  return true;
};
