import crypto from "crypto";

export function createPostCheckSumHeader(
  requestData: string,
  salt: string | undefined,
  keyIndex?: string
) {
  let saltKey = salt || "";
  
  // Calculate sha256 hash for the data + salt
  if (!saltKey) {
    throw new Error("Salt key is required");
  }
  
  const payload = requestData + saltKey;
  const hash = crypto.createHash("sha256").update(payload).digest("hex");
  
  // Return checksum with optional keyIndex
  return {
    checksum: hash.toString() + (keyIndex ? "#" + keyIndex : ""),
  };
} 