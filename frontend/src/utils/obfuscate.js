// Simple obfuscation utility to make URLs harder to find in DevTools
// This is NOT encryption, but prevents easy discovery of plaintext links

/**
 * Encodes a string into a Base64-like obfuscated format
 * @param {string} str - The string to encode
 * @returns {string} - The obfuscated string
 */
export const obfuscate = (str) => {
  if (!str) return '';
  try {
    // 1. Shift characters to prevent direct Base64 recognition
    const shifted = str.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('');
    // 2. Base64 encode
    return btoa(shifted);
  } catch (e) {
    console.error('Obfuscation failed:', e);
    return str;
  }
};

/**
 * Decodes an obfuscated string back to its original format
 * @param {string} str - The obfuscated string to decode
 * @returns {string} - The original string
 */
export const deobfuscate = (str) => {
  if (!str) return '';
  try {
    // 1. Decode Base64 
    const decoded = atob(str);
    // 2. Reverse shift
    return decoded.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('');
  } catch (e) {
    // If decoding fails, it might be a regular URL (backward compatibility)
    return str;
  }
};
