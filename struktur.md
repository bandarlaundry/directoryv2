repositoryv2/
├── index.html              # Halaman Utama (Peta di atas + List 10 data + Navigasi)
├── 404.html                # Routing Fallback GitHub Pages
├── admin.html              # Admin V1 & Legacy
├── vercel.json             # (Opsional) Tetap disimpan untuk kompatibilitas
│
├── auth/
│   ├── login.html          # Login Owner & Admin
│   └── register.html       # Registrasi Owner
│
├── dashboard/
│   ├── owner.html          # Dashboard Owner (Kelola Bisnis & Verifikasi)
│   └── admin.html          # Dashboard Admin (Approve Claims & Verifications)
│
├── business/
│   └── detail.html         # Detail Usaha (SEO + Schema.org + Claim Button)
│
├── css/
│   └── style.css           # CSS Responsive (Layout Peta di atas)
│
└── js/
    ├── firebase-config.js  # Config Firebase
    ├── business.js         # Business Model & Utilities
    ├── map.js              # Modul Leaflet Map
    ├── auth.js             # Autentikasi V2
    ├── claim.js            # Modul Klaim V2
    └── verification.js     # Modul Verifikasi V2
