# Resep Bunda v2.0 🍳  
**“Menghadirkan Kehangatan Dapur dalam Genggaman”**

**Resep Bunda** adalah aplikasi mobile intuitif yang dirancang sebagai **central hub** untuk menemukan inspirasi masakan, mengelola resep pribadi, dan mendorong kebiasaan memasak di rumah.

---

## 📋 Project Overview

### Visi & Tujuan

**Masalah**
- Pengguna sering kehabisan ide masakan harian.
- Catatan resep keluarga sering hilang atau tercecer.

**Solusi**
- Aplikasi mobile terpusat untuk semua kebutuhan resep.

**Tujuan Utama**
- **Inspirasi Cepat**: Menemukan ide masakan dalam hitungan detik.
- **Manajemen Terpusat**: Menyimpan resep pribadi dan publik dengan rapi.
- **Kebiasaan Positif**: Mendorong pengguna untuk lebih sering memasak.

---

## ✨ Fitur Kunci (MVP)

- **Penemuan (Discovery)**  
  Feed resep publik, pencarian judul, dan filter kategori.

- **Kreasi (Creation)**  
  Form tambah resep (foto, bahan, langkah) dengan opsi privasi (Public/Private).

- **Pengelolaan (Management)**  
  Mengelola **Resep Saya** dan fitur **Bookmark (Simpan Resep)** sekali tap.

- **Akses (Access)**  
  Autentikasi aman (Login/Register) dan pemulihan akun.

---

## 👥 Tim Pengembang (Kelompok 6)

| Posisi | Nama Anggota | NIM | Tanggung Jawab Utama |
|------|--------------|-----|----------------------|
| Project Manager & QA | Lutfi Zain | 1001230027 | Manajemen Proyek, Test Plan, QA Testing |
| Code Reviewer | R. Purba Kusuma | 1002230076 | Code Review, Standarisasi Kode, Best Practice |
| Dev 1 | Jumanta | 1003240040 | Project Setup: Init, Navigation, Types, Helpers |
| Dev 2 | Syahrul Ramadhan | 1002230052 | Auth & Profile: Login, Register, Profile UI/Logic |
| Dev 3 | Zikri Firmansyah | 1003230043 | Home Screen: Feed, Search, Category Filter |
| Dev 4 | Deni Hermawan | 1003230027 | Recipe Detail: Layout, Ingredients, Steps View |
| Dev 5 | Vointra Namara Fidelito | 1002230062 | My Recipes: Tab Layout, Filter Author, Edit/Delete |
| Dev 6 | M. Syahid Azhar Azizi | 1003230019 | Saved Recipes: Bookmark List, Empty State |
| Dev 7 | Dyo Aristo | 1003230028 | Create/Edit Recipe: Form, Image Picker, Dynamic List |

---

## 🛠️ Fondasi Teknologi

- **Framework**: React Native (Expo SDK 50+)  
- **Language**: TypeScript  
- **Database (Hybrid)**:
  - **SQLite (expo-sqlite)**: Penyimpanan utama (offline-first).
  - **AsyncStorage**: Token sesi & preferensi tema.
- **Font**: Inter Sans.

### Arsitektur Data
- Properti `isPrivate` (boolean) pada resep untuk kontrol privasi.
- Logic favorit yang scalable (disimpan pada referensi User).

---

## 🚀 Instalasi & Setup

**Prasyarat**  
Node.js (LTS), Git, Android Studio (untuk emulator).

### Clone Repository
```bash
git clone https://github.com/syahrullrmdhn/resepbunda.git
cd resepbunda
````

### Install Dependencies

```bash
npm install
```

### Jalankan Aplikasi

```bash
npx expo start
```

* **Fisik**: Scan QR Code dengan Expo Go.
* **Emulator**: Tekan `a` di terminal (pastikan emulator menyala).

---

## 📂 Struktur Folder

Gunakan direktori `src` untuk source code. **Jangan menaruh komponen di root.**

```text
resepbunda/
├── src/
│   ├── assets/          # Gambar statis & icons
│   ├── components/      # Komponen UI reusable
│   ├── constants/       # Konfigurasi statis
│   ├── hooks/           # Custom hooks
│   ├── navigation/      # React Navigation (Stack & Tab)
│   ├── screens/         # Halaman utama
│   ├── services/        # Logic Database & API
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Helper functions
│   └── theme/           # Global styles
├── App.tsx              # Entry point (Init DB & Fonts)
└── package.json
```

---

## 📝 Development Guidelines

### 1. Naming Conventions

* **PascalCase**: `LoginScreen.tsx`, `RecipeCard.tsx`
* **camelCase**: `getUserData`, `isLoading`
* **UPPER_SNAKE_CASE**: `API_TIMEOUT`, `MAX_RETRY`

### 2. Styling Rules

* Hindari inline styles.
* Gunakan `StyleSheet.create`.
* Gunakan warna dari `src/constants/Colors.ts`.

### 3. Database Rules (SQLite)

* Semua operasi DB di `src/services/Database.ts`.
* UI hanya memanggil fungsi JS:

  ```ts
  await getRecipes();
  ```

### 4. Git Workflow

Format commit:

```text
type: message
```

Contoh:

```text
feat: add login screen
fix: resolve sqlite table error
docs: update readme
chore: clean up unused imports
```

---

## 📅 Rincian Tugas & Jadwal (Task Breakdown)

### 1. Project Setup (Dev 1 - Jumanta)

| ID  | Task                                    | Estimasi (Jam) |
| --- | --------------------------------------- | -------------- |
| 0.1 | Init RN project + dependencies          | 2              |
| 0.2 | Navigation setup (Stack, Tab, Modal)    | 3              |
| 0.3 | TypeScript types & interfaces           | 2              |
| 0.4 | SQLite/AsyncStorage helpers + mock data | 2              |
| 0.5 | Git workflow & PR template              | 1              |

### 2. Login & Profile (Dev 2 - Syahrul)

| ID  | Task                           | Dependency |
| --- | ------------------------------ | ---------- |
| 1.1 | Login UI (email & password)    | 0.2        |
| 1.2 | Login logic & save session     | 0.4, 1.1   |
| 1.3 | Forgot password (mailto link)  | 1.1        |
| 7.1 | Profile UI (avatar, name, bio) | 0.3, 1.2   |
| 7.2 | Edit profile form              | 7.1        |
| 7.3 | Logout button + logic          | 0.4, 7.1   |

### 3. Home Screen (Dev 3 - Zikri)

| ID  | Task                   | Dependency |
| --- | ---------------------- | ---------- |
| 2.1 | Recipe card component  | 0.3        |
| 2.2 | Feed layout (FlatList) | 2.1        |
| 2.3 | Search bar             | 2.2        |
| 2.4 | Category filter chips  | 2.2        |
| 2.5 | Filter logic           | 2.3, 2.4   |

### 4. Recipe Detail (Dev 4 - Deni)

| ID  | Task                          | Dependency |
| --- | ----------------------------- | ---------- |
| 3.1 | Header layout (image & title) | 0.2        |
| 3.2 | Ingredients section           | 3.1        |
| 3.3 | Steps section                 | 3.1        |
| 3.4 | Save/unsave button + logic    | 0.4, 3.1   |

### 5. My Recipes (Dev 5 - Vointra)

| ID  | Task                         | Dependency |
| --- | ---------------------------- | ---------- |
| 4.1 | Tab layout (Published/Draft) | 2.1        |
| 4.2 | Filter by authorId           | 0.4, 4.1   |
| 4.3 | Empty state                  | 4.1        |
| 4.4 | Edit & delete actions        | 4.1        |

### 6. Saved Recipes (Dev 6 - Syahid)

| ID  | Task                     | Dependency |
| --- | ------------------------ | ---------- |
| 5.1 | FlatList layout          | 2.1        |
| 5.2 | Filter by savedRecipeIds | 0.4, 5.1   |
| 5.3 | Empty state              | 5.1        |

### 7. Create/Edit Recipe (Dev 7 - Dyo)

| ID  | Task                            | Dependency |
| --- | ------------------------------- | ---------- |
| 6.1 | Form UI (title, desc, category) | 0.3        |
| 6.2 | Time & difficulty inputs        | 6.1        |
| 6.3 | Image picker integration        | 0.1, 6.1   |
| 6.4 | Dynamic ingredients             | 6.1        |
| 6.5 | Dynamic steps                   | 6.1        |
| 6.6 | Privacy toggle                  | 6.1        |
| 6.7 | Save logic (Draft/Published)    | 0.4, 6.1   |

### 8. Quality Control

* **Code Review (Purba)**: Setelah setiap modul (R.1–R.9).
* **QA Testing (Lutfi)**: Test Plan, Functional Test, Final Acceptance Test.
* **Bug Fixes (All Devs)**: Berdasarkan laporan QA.

---

**Happy Coding! 
Tim ResepBunda**
