

//@ts-ignore
const secretKey = import.meta.env.VITE_SECRET_KEY;

const serverPublicKeyPem =
//@ts-ignore
  import.meta.env.VITE_SERVER_PUBLIC_KEY_PEM.replace(/\\n/g, "\n");


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

// export const formatFileSize = (bytes?: number) => {
//   if (!bytes) return "";
//   if (bytes < 1024) return bytes + " B";
//   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
//   if (bytes < 1024 * 1024 * 1024)
//     return (bytes / (1024 * 1024)).toFixed(2) + " MB";
//   return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
// };

export function formatFileSize(bytes: number | string | undefined): string {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n < 0) return "0 B";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(2)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

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


function bytesToBase64(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return btoa(String.fromCharCode(...arr));
}

async function importServerPublicKey(pem:any) {
  const binaryDer = Uint8Array.from(
    atob(
      pem
        .replace("-----BEGIN PUBLIC KEY-----", "")
        .replace("-----END PUBLIC KEY-----", "")
        .replace(/\s/g, "")
    ),
    c => c.charCodeAt(0)
  );

  return crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256", // 🚨 MUST MATCH BACKEND
    },
    false,
    ["encrypt"]
  );
}
export async function encryptPayload(payload:any, ) {

  const publicKey = await importServerPublicKey(serverPublicKeyPem);

  // AES key
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(payload));

  // Encrypt data
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded
  );

  // Export AES key
  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);

  // 🔐 RSA-OAEP encrypt AES key
  const encryptedAesKey = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" }, // hash already bound in key
    publicKey,
    rawAesKey
  );

  // Split tag (last 16 bytes)
  const encryptedBytes = new Uint8Array(encrypted);
  const tag = encryptedBytes.slice(-16);
  const cipherText = encryptedBytes.slice(0, -16);



  return {
    encryptedKey: bytesToBase64(new Uint8Array(encryptedAesKey)),
    iv: bytesToBase64(iv),
    tag: bytesToBase64(tag),
    data: bytesToBase64(cipherText),
  };
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: any,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}