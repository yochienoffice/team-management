import crypto from "crypto";

const algorithm = "aes-256-cbc";

export function encodeHSInfo(key: Buffer, iv: Buffer, value: string) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decodeHSInfo(key: Buffer, iv: Buffer, value: string) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(value, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
