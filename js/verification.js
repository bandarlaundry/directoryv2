import { db, storage } from './firebase-config.js';
import { 
  collection, addDoc, doc, updateDoc, query, where, getDocs, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Upload Bukti Verifikasi ke Storage & Buat Request
export async function requestVerification(businessId, ownerId, filesArray, notes) {
  // Cek Proteksi Request Ganda
  const qPending = query(
    collection(db, "verificationRequests"),
    where("businessId", "==", businessId),
    where("status", "==", "pending")
  );
  const snapPending = await getDocs(qPending);
  if (!snapPending.empty) {
    throw new Error("Verifikasi usaha ini sedang dalam proses pemeriksaan admin.");
  }

  // Upload File ke Firebase Storage
  const documentUrls = [];
  for (const file of filesArray) {
    const storageRef = ref(storage, `verifications/${ownerId}/${Date.now()}_${file.name}`);
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    documentUrls.push(downloadUrl);
  }

  // Simpan Request ke Firestore
  await addDoc(collection(db, "verificationRequests"), {
    businessId,
    ownerId,
    documents: documentUrls,
    notes,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Update Status Bisnis Menjadi Pending
  await updateDoc(doc(db, "businesses", businessId), {
    verificationStatus: "pending",
    updatedAt: serverTimestamp()
  });
}

// Admin Approve Verifikasi
export async function approveVerification(requestId, businessId, ownerId, adminId) {
  await updateDoc(doc(db, "verificationRequests", requestId), {
    status: "approved",
    reviewedAt: serverTimestamp(),
    reviewedBy: adminId,
    updatedAt: serverTimestamp()
  });

  await updateDoc(doc(db, "businesses", businessId), {
    verificationStatus: "verified",
    updatedAt: serverTimestamp()
  });

  await addDoc(collection(db, "notifications"), {
    userId: ownerId,
    title: "Verifikasi Disetujui!",
    message: "Selamat! Bisnis Anda kini memiliki badge Verified Business.",
    read: false,
    createdAt: serverTimestamp()
  });
}
