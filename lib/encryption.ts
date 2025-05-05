import crypto from "crypto"

// You can generate a secure encryption key with this command:
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

// Encryption key and initialization vector should be stored securely
// For production, use environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const IV_LENGTH = 16 // For AES, this is always 16 bytes

/**
 * Encrypts data using AES-256-CBC
 * @param data - The data to encrypt
 * @returns The encrypted data as a base64 string
 */
export async function encryptData(data: string): Promise<string> {
    try {
        // Generate a random initialization vector
        const iv = crypto.randomBytes(IV_LENGTH)

        if (ENCRYPTION_KEY.length !== 32) {
            throw new Error("Encryption key must be 32 bytes long")
        }

        // Create cipher with key and iv
        const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)

        // Encrypt the data
        let encrypted = cipher.update(data, "utf8", "base64")
        encrypted += cipher.final("base64")

        // Prepend the IV to the encrypted data (so we can decrypt later)
        // IV is not secret and can be stored with the encrypted data
        return iv.toString("hex") + ":" + encrypted
    } catch (error) {
        console.error("Encryption error:", error)
        throw new Error("Failed to encrypt data")
    }
}

/**
 * Decrypts data that was encrypted with encryptData
 * @param encryptedData - The encrypted data as a base64 string
 * @returns The decrypted data
 */
export async function decryptData(encryptedData: string): Promise<string> {
    try {
        // Split the encrypted data to get the IV and the encrypted text
        const textParts = encryptedData.split(":")
        const iv = Buffer.from(textParts[0], "hex")
        const encryptedText = textParts[1]

        // Create decipher with key and iv
        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)

        // Decrypt the data
        let decrypted = decipher.update(encryptedText, "base64", "utf8")
        decrypted += decipher.final("utf8")

        return decrypted
    } catch (error) {
        console.error("Decryption error:", error)
        throw new Error("Failed to decrypt data")
    }
}
