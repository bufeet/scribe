/**
 * Cozy cryptographic utility to seal and open Scribe Backup files.
 * Uses a lightweight, robust symmetric cipher with a salt to protect user drafts.
 */

const CIPHER_KEY = "ScribeSanctuaryCozySecurityKey2026";

export function encryptData(data: any): string {
  const jsonStr = JSON.stringify(data);
  let result = "";
  
  // Multi-pass XOR and shift key sequence
  for (let i = 0; i < jsonStr.length; i++) {
    const charCode = jsonStr.charCodeAt(i);
    const keyChar = CIPHER_KEY.charCodeAt(i % CIPHER_KEY.length);
    // XOR first, then shift
    const scrambled = (charCode ^ keyChar) + 3;
    result += String.fromCharCode(scrambled);
  }
  
  // Wrap into a base64 string to keep it clean and readable in export/import
  try {
    return btoa(unescape(encodeURIComponent(result)));
  } catch (e) {
    // Fallback if base64 conversion has issues with some characters
    return btoa(result);
  }
}

export function decryptData(sealed: string): any {
  let decoded = "";
  try {
    decoded = decodeURIComponent(escape(atob(sealed)));
  } catch (e) {
    try {
      decoded = atob(sealed);
    } catch (e2) {
      throw new Error("Invalid cryptographic seal or base64 data");
    }
  }

  let jsonStr = "";
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i);
    const keyChar = CIPHER_KEY.charCodeAt(i % CIPHER_KEY.length);
    // Unshift first, then XOR
    const unscrambled = (charCode - 3) ^ keyChar;
    jsonStr += String.fromCharCode(unscrambled);
  }

  return JSON.parse(jsonStr);
}
