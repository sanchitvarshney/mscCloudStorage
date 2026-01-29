

//@ts-ignore
const secretKey = import.meta.env.VITE_SECRET_KEY;


export const formatDate = (date: Date) => {
  const now = new Date();
  const diffTime = Math.abs(now?.getTime() - date?.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return "Last month";
  return date?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatFileSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
};

export const getViewTitle = (currentView: string) => {
  switch (currentView) {
    case "home":
      return "Home";
    case "myDrive":
      return "My Drive";
    case "sharedDrives":
      return "Shared Drives";
    case "sharedWithMe":
      return "Shared with me";
    case "starred":
      return "Starred";
    case "spam":
      return "Spam";
    case "trash":
      return "Trash";
    default:
      return "Files";
  }
};

export const groupFilesByDate = (files: any[]) => {
  const groups: { [key: string]: any[] } = {
    Yesterday: [],
    "Last month": [],
    Older: [],
  };

  files.forEach((file) => {
    const date = file.dateShared || file.modified;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      groups["Yesterday"].push(file);
    } else if (diffDays <= 30) {
      groups["Last month"].push(file);
    } else {
      groups["Older"].push(file);
    }
  });

  return groups;
};

export const keyPairPromise = window.crypto.subtle.generateKey(
  {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
  },
  true,
  ["encrypt", "decrypt"],
);

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function bytesToBase64(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return btoa(String.fromCharCode(...arr));
}



export const decryptedData = async (payload: any) => {
  const keyPair = await keyPairPromise;

  // RSA decrypt AES key
  const encryptedKeyBytes = base64ToBytes(payload.encryptedKey);

  const aesKeyRaw = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    keyPair.privateKey,
    encryptedKeyBytes
  );

  const aesKey = await crypto.subtle.importKey(
    "raw",
    aesKeyRaw,
    "AES-GCM",
    false,
    ["decrypt"]
  );

  // Decode parts
  const iv = base64ToBytes(payload.iv);
  const ciphertext = base64ToBytes(payload.data);
  const tag = base64ToBytes(payload.tag);

  // ✅ CONCAT ciphertext + tag (THIS IS CRITICAL)
  const combined = new Uint8Array(ciphertext.length + tag.length);
  combined.set(ciphertext);
  combined.set(tag, ciphertext.length);

  // AES-GCM decrypt
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
      tagLength: 128,
    },
    aesKey,
    combined
  );

  const decoded = new TextDecoder().decode(decrypted);

  return JSON.parse(decoded);
};


export const encryptedData = async (payload: unknown): Promise<{
  encryptedKey: string;
  iv: string;
  data: string;
  tag: string;
}> => {
  const keyPair = await keyPairPromise;

  // Generate random AES key for AES-GCM
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );

  // Generate random IV (12 bytes for GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encode payload to bytes
  const encoded = new TextEncoder().encode(JSON.stringify(payload));

  // AES-GCM encrypt (returns ciphertext + tag combined)
  const combined = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: 128,
    },
    aesKey,
    encoded
  );

  // Split ciphertext and tag (last 16 bytes = 128-bit tag)
  const tagLengthBytes = 16;
  const ciphertext = combined.slice(0, combined.byteLength - tagLengthBytes);
  const tag = combined.slice(combined.byteLength - tagLengthBytes);

  // Export AES key and encrypt it with our public key (RSA-OAEP)
  const rawKey = await crypto.subtle.exportKey("raw", aesKey);
  const encryptedKeyBytes = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    keyPair.publicKey,
    rawKey
  );

 

  return {
    encryptedKey: bytesToBase64(encryptedKeyBytes),
    iv: bytesToBase64(iv),
    data: bytesToBase64(ciphertext),
    tag: bytesToBase64(tag),
  };
};
