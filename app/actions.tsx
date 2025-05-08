"use server"

import { encryptData } from "@/lib/encryption"
import { addEmailToFirebase, addWebsiteToFirebase } from "@/lib/firebase"

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

export async function saveWebsite(websiteData: {
    url: string;
}) {
    try {
        // Validate website data
        if (!websiteData.url || !websiteData.url.includes("http")) {
            throw new Error("Invalid website URL")
        }

        // Save to Firebase
        await addWebsiteToFirebase(websiteData)

        return { success: true }
    } catch (error) {
        console.error("Error in saveWebsite action:", error)
        throw new Error("Failed to save website")
    }
}