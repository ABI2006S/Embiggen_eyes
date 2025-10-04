import { db, isFirebaseAvailable } from "./firebase"
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"

export interface Annotation {
  id: string
  x: number
  y: number
  text: string
  timestamp: number
}

export async function getAnnotations(imageId: string): Promise<Annotation[]> {
  if (!isFirebaseAvailable || !db) {
    console.log("[v0] Firebase not available - annotations disabled")
    return []
  }

  try {
    const docRef = doc(db, "annotations", imageId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data().annotations || []
    }
    return []
  } catch (error) {
    console.error("[v0] Error fetching annotations:", error)
    return []
  }
}

export async function addAnnotation(imageId: string, annotation: Annotation): Promise<void> {
  if (!isFirebaseAvailable || !db) {
    throw new Error("Annotations feature is not available. Please configure Firebase to enable this feature.")
  }

  try {
    const docRef = doc(db, "annotations", imageId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        annotations: arrayUnion(annotation),
      })
    } else {
      await setDoc(docRef, {
        annotations: [annotation],
      })
    }
  } catch (error) {
    console.error("[v0] Error adding annotation:", error)
    throw error
  }
}

export async function deleteAnnotation(imageId: string, annotation: Annotation): Promise<void> {
  if (!isFirebaseAvailable || !db) {
    throw new Error("Annotations feature is not available. Please configure Firebase to enable this feature.")
  }

  try {
    const docRef = doc(db, "annotations", imageId)
    await updateDoc(docRef, {
      annotations: arrayRemove(annotation),
    })
  } catch (error) {
    console.error("[v0] Error deleting annotation:", error)
    throw error
  }
}
