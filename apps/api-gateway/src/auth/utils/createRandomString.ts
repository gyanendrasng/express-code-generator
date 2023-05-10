import * as crypto from 'crypto';
export const createRandomString = (size: number) => {
  const randomString = crypto.randomBytes(size).toString('hex');
  return randomString;
};
