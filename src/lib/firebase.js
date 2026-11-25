import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export async function addAwayDate(data) {
  return addDoc(collection(db, 'awayDates'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export function subscribeToAwayDates(callback) {
  return onSnapshot(collection(db, 'awayDates'), snapshot => {
    const dates = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(dates)
  })
}

export async function deleteAwayDate(id) {
  return deleteDoc(doc(db, 'awayDates', id))
}
