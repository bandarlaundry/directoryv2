import { db } from './firebase-config.js';
import { 
  collection, addDoc, getDocs, query, where, doc, updateDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Submit Klaim Usaha
export async function submitClaim(businessId, userId, userData, message) {
  // 1. Cek Proteksi Klaim Ganda
  const existingClaimQuery = query(
    collection(db, "claims"),
    where("businessId", "==", businessId),
    where("status", "==", "pending")
  );
  const existingSnap = await getDocs(existingClaimQuery);
  if (!existingSnap.empty) {
    throw new Error("Bisnis ini sudah dalam proses klaim oleh pengguna lain atau Anda sendiri.");
  }

  // 2. Buat Dokumen Klaim Baru
  return await addDoc(collection(db, "claims"), {
    businessId,
    userId,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    message,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

// Admin Approve Klaim
export async function approveClaim(claimId, businessId, userId, adminId) {
  // Update Status Klaim
  await updateDoc(doc(db, "claims", claimId), {
    status: "approved",
    reviewedAt: serverTimestamp(),
    reviewedBy: adminId,
    updatedAt: serverTimestamp()
  });

  // Assign Owner ke Bisnis
  await updateDoc(doc(db, "businesses", businessId), {
    ownerId: userId,
    updatedAt: serverTimestamp()
  });

  // Kirim Notifikasi Internal
  await addDoc(collection(db, "notifications"), {
    userId,
    title: "Klaim Bisnis Disetujui",
    message: "Permintaan klaim milik Anda telah disetujui. Sekarang Anda dapat mengelola bisnis ini.",
    read: false,
    createdAt: serverTimestamp()
  });
}

// Admin Reject Klaim
export async function rejectClaim(claimId, userId, adminId) {
  await updateDoc(doc(db, "claims", claimId), {
    status: "rejected",
    reviewedAt: serverTimestamp(),
    reviewedBy: adminId,
    updatedAt: serverTimestamp()
  });

  await addDoc(collection(db, "notifications"), {
    userId,
    title: "Klaim Bisnis Ditolak",
    message: "Permintaan klaim Anda ditolak. Silakan hubungi dukungan pelanggan untuk informasi lebih lanjut.",
    read: false,
    createdAt: serverTimestamp()
  });
}
