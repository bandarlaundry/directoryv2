import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Guard Akses Halaman
export function requireAuth(requiredRole = null, onUserLoaded = null) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = '/auth/login.html';
      return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;

    if (requiredRole && userData?.role !== requiredRole) {
      if (userData?.role === 'admin') {
        window.location.href = '/dashboard/admin.html';
      } else {
        window.location.href = '/dashboard/owner.html';
      }
      return;
    }

    if (onUserLoaded) onUserLoaded(user, userData);
  });
}

// Register Owner Baru
export async function registerOwner(name, email, phone, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  await setDoc(doc(db, "users", uid), {
    uid,
    name,
    email,
    phone,
    role: "owner",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return cred.user;
}

// Login User
export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, "users", cred.user.uid));
  const userData = userDoc.data();
  return { user: cred.user, role: userData?.role || 'owner' };
}

// Logout
export async function logoutUser() {
  await signOut(auth);
  window.location.href = '/auth/login.html';
}

// Reset Password
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}
