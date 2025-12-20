# Product Requirements Document (PRD): Resep Bunda

## **1. Product Overview**

Resep Bunda adalah aplikasi mobile native (iOS & Android) yang dibangun dengan React Native untuk para ibu dan home cook yang ingin menemukan, menyimpan, dan mengelola resep keluarga secara praktis dan terorganisir. Produk menekankan nuansa hangat dan familiar, dengan fokus pada kemudahan menemukan inspirasi masakan harian dan menjaga koleksi resep pribadi maupun publik.

**Source of truth teknis** (routing, data model, user flows, interaction states) didefinisikan di dokumen:

**Information Architecture (IA): Resep Bunda v2.0**

## **2. Goals & Success Metrics**

## **2.1 Product Goals**

- Membantu pengguna menemukan ide masakan harian dengan cepat dan relevan.
- Memudahkan pengguna menyimpan dan mengelola resep sendiri (publik maupun pribadi).
- Mendorong kebiasaan memasak di rumah dengan resep yang sederhana dan bisa diandalkan.

## **2.2 Success Metrics (MVP)**

- Minimal 3 resep dibuat per user aktif dalam 2 minggu pertama penggunaan.
- Minimal 5 resep tersimpan (saved) per user aktif dalam 1 bulan.
- Retensi 2-mingguan: ≥ 40% pengguna kembali membuka aplikasi untuk melihat/mengelola resep.

## **3. Target Audience & Personas**

## **3.1 Primary Audience**

- Ibu rumah tangga atau pekerja yang tetap memasak di rumah, usia 25–45 tahun.
- Kebutuhan utama: inspirasi menu harian, pengelolaan resep keluarga, dan kemudahan menyiapkan makanan bergizi dengan waktu terbatas.

## **3.2 Secondary Audience**

- Food enthusiast dan pemula yang ingin mencoba resep sederhana dan jelas langkah-langkahnya.
- Kebutuhan utama: resep yang mudah diikuti, bahan tidak rumit, dan hasil yang konsisten.

## **3.3 Sample User Stories**

- Sebagai ibu yang sibuk, aku ingin menyimpan resep-resep andalan keluargaku agar bisa dengan cepat aku akses saat memasak.
- Sebagai pengguna baru, aku ingin melihat resep publik yang simpel dan menarik di halaman utama agar terinspirasi untuk memasak.
- Sebagai pengguna, aku ingin menyimpan resep favorit ke daftar pribadi (saved) agar mudah kucari lagi nanti.
- Sebagai pengguna, aku ingin bisa menandai resep sebagai private agar resep keluarga tertentu hanya terlihat olehku sendiri.

## **4. Core Features & Scope (MVP)**

## **4.1 Authentication & Access**

**Tujuan bisnis:** Mengelola akses pengguna sehingga fitur personal seperti My Recipes dan Saved Recipes bisa berjalan.

- Login dengan email/password.
- Halaman register opsional untuk MVP (dapat diaktifkan jika dibutuhkan untuk pengujian user).
- Forgot Password menggunakan mekanisme sederhana: membuka aplikasi email dengan tujuan ke tim support (mailto ke support@kelompok6.itts.ac.id) dengan subject terisi otomatis (mis. “Reset Password Request - Resep Bunda”).

Detail rute dan perilaku: lihat IA v2.0 bagian *Sitemap & Routing Structure*.

## **4.2 Recipe Discovery (Home Feed)**

**Tujuan bisnis:** Menjadi titik masuk utama inspirasi masakan untuk pengguna baru dan lama.

- Feed resep publik (hanya menampilkan resep dengan status publik, bukan private).
- Pencarian berdasarkan judul atau kategori.
- Filter kategori utama: Breakfast, Lunch, Dinner, MPASI, Snacks.
- Filter tambahan (seperti waktu masak, tingkat kesulitan) dapat disesuaikan secara iteratif; prioritas utama adalah pengalaman browsing yang ringan dan jelas.

Logika filtering & privacy: didefinisikan di IA v2.0 pada bagian *Filtering & Privacy Logic (Feed Utama)*.

## **4.3 Recipe Management**

**Tujuan bisnis:** Menjadikan Resep Bunda sebagai “single place” untuk menyimpan dan mengelola resep pengguna.

- **My Recipes**
    - Menampilkan resep milik pengguna sendiri, termasuk resep private.
    - Membantu pengguna mengelola recipe lifecycle (Draft vs Published).
- **Privacy (Private vs Public)**
    - Pengguna dapat menandai resep sebagai private atau public.
    - Resep private hanya muncul di My Recipes dan tidak ditampilkan di feed umum.
    - Fitur ini penting untuk resep keluarga yang ingin disimpan tapi tidak dibagikan.
- **Saved Recipes (Bookmarks)**
    - Pengguna bisa menyimpan resep publik ke daftar Saved.
    - Fokus pada pengalaman “1 tap save/unsave” dengan feedback visual jelas.
    - Status favorit dihitung dari perspektif user (bukan mengubah data global resep).
- **Add / Edit Recipe**
    - Form untuk menambahkan dan mengedit resep yang memuat:
        - Judul resep.
        - Deskripsi singkat.
        - Kategori (MPASI, Dinner, Snack, dll).
        - Waktu masak (estimasi).
        - Tingkat kesulitan (Easy/Medium/Hard).
        - Daftar bahan (ingredient list).
        - Langkah memasak (step-by-step).
        - Upload gambar.
        - Pengaturan privacy (Private/Public).

Struktur data, enum Difficulty, RecipeStatus, dan properti seperti isPrivate serta savedRecipeIds didefinisikan di IA v2.0 pada bagian *Data Models*.

## **4.4 Profile & Edit Profile**

**Tujuan bisnis:** Memberi identitas personal pada resep dan meningkatkan engagement.

- Halaman Profile:
    - Menampilkan avatar, nama, dan bio singkat.
    - Shortcut ke My Recipes dan Saved Recipes.
- Halaman Edit Profile:
    - Pengguna dapat memperbarui avatar, nama, dan bio.
    - Perubahan ini mempengaruhi bagaimana resep tampil (atribusi author).

## **5. UX & Interaction Principles**

PRD ini tidak mengulang detail interaction states yang sudah rinci di IA, tetapi menetapkan prinsip-prinsip utamanya:

- Aplikasi harus terasa hangat, bersih, dan tidak mengintimidasi.
- Empty state pada halaman penting (mis. My Recipes kosong) harus tetap memberikan dorongan positif agar pengguna mulai membuat resep.
- Feedback visual harus jelas ketika pengguna menyimpan resep, mengubah privacy, atau gagal mengisi field wajib.

Detil state komponen seperti empty state, validation, animasi ikon hati, dan toggle privacy ada di IA v2.0 bagian *UI/UX States (Interaction Design)*.

## **6. Technical Constraints & Guidelines**

PRD ini hanya merangkum constraint utama untuk memastikan keselarasan tim, tanpa mengulangi detail teknis IA:

- **Framework:** React Native dengan TypeScript.
- **Styling:** StyleSheet API atau styled-components untuk React Native.
- **Navigation:** React Navigation (Stack Navigator, Tab Navigator) mengikuti struktur route di IA.
- **State Management:** React Hooks dasar (useState, dsb.) untuk MVP.
- **Local Storage:** AsyncStorage dari @react-native-async-storage/async-storage untuk menyimpan data lokal.
- **Platform Target:** iOS dan Android (cross-platform native mobile app).
- **Development Tools:** Expo (opsional untuk rapid development) atau bare React Native CLI.