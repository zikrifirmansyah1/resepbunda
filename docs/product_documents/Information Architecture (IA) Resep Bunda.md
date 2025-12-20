# Information Architecture (IA): Resep Bunda

Dokumen ini mendefinisikan struktur navigasi, model data, dan logika interaksi untuk pengembangan aplikasi Resep Bunda v2.0.

## **1. Sitemap & Routing Structure**

Struktur rute dipisahkan antara akses publik dan terproteksi (membutuhkan login).

### **A. Public Routes**

- **GET /**: Login / Splash Screen.
- *Feature*: "Forgot Password" link yang memicu mailto:support@kelompok6.itts.ac.id.
- **GET /register**: Sign Up (Opsional untuk MVP).

### **B. Protected Routes (Requires Auth)**

- **Main Layout** (Memiliki Bottom Navigation Bar):
- **GET /home**: Feed utama resep publik.
- **GET /my-recipes**: Dashboard untuk mengelola resep milik user sendiri.
- **GET /saved**: Daftar resep yang disimpan (bookmarks).
- **GET /profile**: Informasi profil pengguna.
- **Standalone Pages** (Tanpa Bottom Nav untuk fokus):
- **GET /recipe/create**: Form pembuatan resep baru.
- **GET /recipe/edit/:id**: Form edit resep yang sudah ada.
- **GET /recipe/:id**: Detail resep lengkap.
- **GET /profile/edit**: Form untuk memperbarui data user (Avatar, Bio, Nama).

## **2. Data Models (Schema Definition)**

### **A. Recipe Object**

Model data untuk satu entitas resep.

type Difficulty = 'Easy' | 'Medium' | 'Hard';

type RecipeStatus = 'Draft' | 'Published';

interface Recipe {

id: string;               // UUID

authorId: string;         // ID pemilik resep (Relasi ke User)

title: string;

description: string;

category: string;         // e.g., "Mpasi", "Dinner", "Snack"

// Metadata

time: number;             // Dalam menit

difficulty: Difficulty;

// Media

imageUrl: string;         // Base64 (Local) atau URL (Cloud)

// Content

ingredients: Ingredient[];

steps: string[];          // List instruksi

// System & Privacy

status: RecipeStatus;

isPrivate: boolean;       // TRUE: Hanya muncul di 'My Recipes', FALSE: Muncul di Feed Umum

createdAt: string;        // ISO Date String

}

interface Ingredient {

item: string;             // e.g., "Bawang Putih"

qty: string;              // e.g., "3 siung"

}

### **B. User Object**

Model data pengguna yang tersimpan di sistem/LocalStorage.

interface User {

id: string;

name: string;

email: string;

avatarUrl?: string;

bio?: string;

savedRecipeIds: string[]; // List ID resep yang difavoritkan (Personal)

}

Catatan Penting isFavorite:

Properti isFavorite dihapus dari model Recipe karena bersifat global. Status favorit kini ditentukan secara dinamis di UI:

isFavorite = user.savedRecipeIds.includes(recipe.id)

## **3. Detailed User Flows**

### **Flow: Forgot Password Interaction**

1. User berada di halaman Login.
2. User klik teks "Lupa Password?".
3. **System Action**: Membuka aplikasi email default perangkat dengan tujuan support@kelompok6.itts.ac.id dan subjek otomatis (e.g., "Reset Password Request - Resep Bunda").

### **Flow: Filtering & Privacy Logic (Feed Utama)**

1. Sistem mengambil allRecipes.
2. **Step 1 (Privacy Filter)**: Hanya tampilkan resep dengan isPrivate: false.
3. **Step 2 (Search)**: Cocokkan keyword pada title atau category.
4. **Step 3 (Render)**: Tampilkan hasil ke user.

## **4. UI/UX States (Interaction Design)**

| **Component** | **State** | **Behavior / Visual** |
| --- | --- | --- |
| **Recipe Card** | Normal | Info dasar resep. Tombol hati merah jika ID ada di savedRecipeIds. |
| **Privacy Toggle** | Switch | Label "Private" (Gembok) atau "Public" (Dunia) pada form create/edit. |
| **Save Button** | Interaction | Klik -> Tambah/Hapus ID dari user.savedRecipeIds. Animasi *pop* pada ikon hati. |
| **Empty State** | Display | Jika my-recipes kosong, tampilkan ilustrasi dapur rapi + teks "Bunda belum menulis resep". |
| **Input Field** | Validation | Border merah jika field wajib (Judul, Bahan) kosong saat tombol Save ditekan. |