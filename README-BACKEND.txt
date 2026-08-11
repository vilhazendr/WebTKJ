XI TKJ 1 — BACKEND

JALAN DI TERMUX
1. Extract ZIP.
2. cd ke folder project.
3. pkg update
4. pkg install nodejs
5. node server.js
6. Buka browser: http://localhost:3000

TIDAK PERLU npm install.
Backend memakai Node.js bawaan (modul http + crypto).

LOGIN ADMIN
Username: kinkndra
Password: ndrasigma

API
GET /api/materials
GET /api/materials/:id
POST /api/materials (admin)
PUT /api/materials/:id (admin)
DELETE /api/materials/:id (admin)
GET /api/admin/stats (admin)

Data materi tersimpan di data/db.json.
Materi awal: Linux, Jaringan, Coding, Security, Database/Backend.

Catatan: jadwal dan piket pada script.js dipertahankan.

YOUTUBE MUSIC
- YouTube Data API v3 key sudah dipasang di music.js sesuai permintaan.
- Batasi API key di Google Cloud berdasarkan domain/API agar tidak mudah disalahgunakan.


FITUR BARU AKUN SISWA
- 36 akun siswa otomatis dibuat dari daftar XI TKJ 1.
- Login siswa: Portal Siswa di halaman utama.
- Username unik per siswa.
- Password awal unik dan hanya dibuat saat seed/reset.
- Password disimpan sebagai hash scrypt di database.
- Admin dapat melihat daftar username melalui GET /api/admin/students.
- Admin dapat reset password melalui POST /api/admin/students/reset.
- Jangan upload file data/db.json ke repository publik jika ingin menjaga data akun.

WALI KELAS
- Nama wali kelas di halaman utama sudah diubah menjadi Bu Luluk.

CATATAN
- Jadwal dan piket pada script.js tidak diubah.
