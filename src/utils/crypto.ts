// ============================================================================
// FONCTIONS DE CHIFFREMENT AES-GCM
// ============================================================================

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits recommandés pour GCM
const SALT_LENGTH = 16;
const ITERATIONS = 100000;

// ============================================================================
// GÉNÉRATION DE CLÉ DEPUIS MOT DE PASSE
// ============================================================================

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Importer le mot de passe comme clé PBKDF2
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Dériver la clé AES
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

// ============================================================================
// GÉNÉRATION D'IV ET SALT ALÉATOIRES
// ============================================================================

function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

// ============================================================================
// CHIFFREMENT
// ============================================================================

export async function encrypt(
  data: any,
  password: string
): Promise<{ data: string; iv: string; salt: string }> {
  try {
    // Convertir les données en JSON puis en ArrayBuffer
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(jsonString);

    // Générer salt et IV aléatoires
    const salt = generateRandomBytes(SALT_LENGTH);
    const iv = generateRandomBytes(IV_LENGTH);

    // Dériver la clé depuis le mot de passe
    const key = await deriveKey(password, salt);

    // Chiffrer
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv as BufferSource,
      },
      key,
      dataBuffer
    );

    // Convertir en base64
    const encryptedArray = new Uint8Array(encryptedBuffer);
    const encryptedBase64 = btoa(String.fromCharCode(...encryptedArray));
    const ivBase64 = btoa(String.fromCharCode(...iv));
    const saltBase64 = btoa(String.fromCharCode(...salt));

    return {
      data: encryptedBase64,
      iv: ivBase64,
      salt: saltBase64,
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Échec du chiffrement des données');
  }
}

// ============================================================================
// DÉCHIFFREMENT
// ============================================================================

export async function decrypt(
  encryptedData: { data: string; iv: string; salt: string },
  password: string
): Promise<any> {
  try {
    // Convertir depuis base64
    const encryptedArray = Uint8Array.from(atob(encryptedData.data), (c) =>
      c.charCodeAt(0)
    );
    const iv = Uint8Array.from(atob(encryptedData.iv), (c) => c.charCodeAt(0));
    const salt = Uint8Array.from(atob(encryptedData.salt), (c) =>
      c.charCodeAt(0)
    );

    // Dériver la clé depuis le mot de passe
    const key = await deriveKey(password, salt);

    // Déchiffrer
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      encryptedArray
    );

    // Convertir en JSON
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedBuffer);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Échec du déchiffrement - Mot de passe incorrect ?');
  }
}

// ============================================================================
// VÉRIFICATION DE MOT DE PASSE
// ============================================================================

export async function verifyPassword(
  encryptedData: { data: string; iv: string; salt: string },
  password: string
): Promise<boolean> {
  try {
    await decrypt(encryptedData, password);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// GÉNÉRATION DE HASH (pour vérification sans déchiffrement complet)
// ============================================================================

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
