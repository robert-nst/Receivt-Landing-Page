"use server"

import { encryptData } from "@/lib/encryption"
import { addEmailToFirebase } from "@/lib/firebase"

export async function saveEmail(email: string) {
    try {
        // Validate email
        if (!email || !email.includes("@")) {
            throw new Error("Invalid email address")
        }

        // Encrypt the email before storing
        // const encryptedEmail = await encryptData(email)
        const encryptedEmail = email;

        // Save to Firebase
        await addEmailToFirebase(encryptedEmail)

        return { success: true }
    } catch (error) {
        console.error("Error in saveEmail action:", error)
        throw new Error("Failed to save email")
    }
}
