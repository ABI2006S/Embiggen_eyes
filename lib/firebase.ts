import { initializeApp, getApps } from "firebase/app"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"
import type { FirebaseApp } from "firebase/app"
import type { Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const isFirebaseConfigured = () => {
  return !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId)
}

let app: FirebaseApp | null = null
let db: Firestore | null = null
let isFirebaseAvailable = false

if (typeof window !== "undefined" && isFirebaseConfigured()) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
      db = getFirestore(app)

      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === "failed-precondition") {
          console.warn("[v0] Firebase persistence failed: Multiple tabs open")
        } else if (err.code === "unimplemented") {
          console.warn("[v0] Firebase persistence not available in this browser")
        }
      })

      isFirebaseAvailable = true
      console.log("[v0] Firebase initialized successfully")
    } else {
      app = getApps()[0]
      db = getFirestore(app)
      isFirebaseAvailable = true
    }
  } catch (error) {
    console.error("[v0] Firebase initialization failed:", error)
    isFirebaseAvailable = false
  }
} else {
  console.warn("[v0] Firebase not configured - annotations will be disabled")
}

export { app, db, isFirebaseAvailable }
