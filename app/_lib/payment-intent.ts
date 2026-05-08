
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const SECRET = process.env.PAYMENT_INTENT_SECRET!;

export function generateReference(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(4).toString("hex");
  return `FV_${timestamp}_${random}`.toUpperCase();
}

export function createSignature(reference: string, amountKobo: number): string {
  return createHmac("sha256", SECRET)
    .update(`${reference}:${amountKobo}`)
    .digest("hex");
}

export function verifySignature(
  reference: string,
  amountKobo: number,
  signature: string
): boolean {
  const expected = createSignature(reference, amountKobo);
  try {
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}