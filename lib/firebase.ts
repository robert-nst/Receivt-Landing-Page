import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"
import { getAuth, signInAnonymously } from "firebase/auth"

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

/**
 * Adds an encrypted email to the Firebase Firestore database
 * @param encryptedEmail - The encrypted email to store
 * @returns A promise that resolves when the email is added
 */
export async function addEmailToFirebase(encryptedEmail: string) {
    try {
        // Ensure the user is authenticated
        const auth = getAuth(app)
        if (!auth.currentUser) {
            await signInAnonymously(auth)
        }

        const emailsCollection = collection(db, "emails")
        console.log(emailsCollection)

        await addDoc(emailsCollection, {
            email: encryptedEmail,
            createdAt: serverTimestamp(),
        })

        console.log("Email added to Firebase successfully")
        return true
    } catch (error) {
        console.error("Error adding email to Firebase:", error)
        throw error
    }
}
