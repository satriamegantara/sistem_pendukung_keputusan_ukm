# Panduan Penggunaan SPK Rekomendasi UKM

## Daftar Isi

1. [Tentang Sistem](#1-tentang-sistem)
2. [Persyaratan Sistem](#2-persyaratan-sistem)
3. [Cara Membuka Aplikasi](#3-cara-membuka-aplikasi)
4. [Navigasi Menu](#4-navigasi-menu)
5. [Halaman Beranda](#5-halaman-beranda)
6. [Isi Kuesioner](#6-isi-kuesioner)
7. [Melihat Perhitungan](#7-melihat-perhitungan)
8. [Melihat Hasil & Rekomendasi](#8-melihat-hasil--rekomendasi)
9. [Halaman Tentang](#9-halaman-tentang)
10. [Cetak Laporan](#10-cetak-laporan)

---

## 1. Tentang Sistem

**SPK Rekomendasi UKM** adalah Sistem Pendukung Keputusan yang membantu mahasiswa Fakultas Teknik Universitas Jenderal Soedirman untuk menentukan Unit Kegiatan Mahasiswa (UKM) yang paling sesuai dengan minat dan kebutuhan pengembangan diri.

Sistem ini menggunakan metode **TOPSIS** (Technique for Order Preference by Similarity to Ideal Solution), yaitu metode pengambilan keputusan multikriteria yang menilai alternatif berdasarkan kedekatan dengan solusi ideal positif dan kejauhan dari solusi ideal negatif.

### Alternatif UKM yang Dinilai

| Kode | Nama UKM |
|------|----------|
| A1 | SEEO |
| A2 | EEC |
| A3 | SALMAN |
| A4 | KSMPA Titik Nol |
| A5 | PMKT |
| A6 | REKURSIF |

### Kriteria Penilaian

| Kode | Kriteria | Tipe | Keterangan |
|------|----------|------|------------|
| C1 | Pengembangan Diri | Benefit | Manfaat pengembangan diri yang diperoleh |
| C2 | Peminatan | Benefit | Kesesuaian UKM dengan minat mahasiswa |
| C3 | Popularitas UKM | Benefit | Jumlah anggota aktif UKM |
| C4 | Prestasi UKM | Benefit | Jumlah pencapaian/penghargaan |
| C5 | Frekuensi Pertemuan | Cost | Frekuensi pertemuan per minggu |

- **Benefit**: Semakin tinggi nilainya semakin baik.
- **Cost**: Semakin rendah nilainya semakin baik.

---

## 2. Persyaratan Sistem

- **Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, atau browser modern lainnya.
- **Koneksi Internet**: Diperlukan hanya untuk memuat font dari Google Fonts.
- **Tidak memerlukan server**: Aplikasi berjalan sepenuhnya di browser (client-side).

---

## 3. Cara Membuka Aplikasi

1. Buka folder tempat aplikasi disimpan.
2. Klik dua kali file `index.html`.
3. Halaman akan terbuka di browser secara otomatis.
4. Aplikasi siap digunakan.

---

## 4. Navigasi Menu

Di bagian atas halaman terdapat menu navigasi dengan 5 halaman:

| Menu | Fungsi |
|------|--------|
| **Beranda** | Informasi umum tentang sistem, kriteria, dan metode TOPSIS |
| **Input Data** | Isi kuesioner preferensi kriteria (nilai 1-5) |
| **Perhitungan** | Lihat tahapan perhitungan TOPSIS secara lengkap |
| **Hasil** | Lihat ranking dan rekomendasi UKM terbaik |
| **Tentang** | Informasi latar belakang, metode, dan peneliti |

Klik tombol menu untuk berpindah halaman. Menu yang aktif ditandai dengan warna berbeda.

---

## 5. Halaman Beranda

Halaman ini menampilkan:

- **Judul dan deskripsi sistem**
- **Ringkasan penelitian**: jumlah kriteria, alternatif UKM, metode, dan hasil rekomendasi default
- **Fitur utama**: Multikriteria, Objektif & Transparan, Ranking UKM
- **Daftar kriteria dan bobot** yang digunakan dalam penilaian

Halaman ini bersifat informatif dan tidak memerlukan interaksi.

---

## 6. Isi Kuesioner

Ini adalah langkah utama dalam penggunaan sistem. Ikuti langkah berikut:

### Langkah 1: Buka Halaman Input Data
Klik menu **Input Data** di navigasi atas.

### Langkah 2: Beri Nilai Setiap Kriteria
Anda akan melihat 5 kriteria penilaian. Untuk setiap kriteria, pilih salah satu nilai dari skala Likert 1 hingga 5:

| Nilai | Arti |
|-------|------|
| **1** | Sangat Tidak Penting |
| **2** | Tidak Penting |
| **3** | Netral |
| **4** | Penting |
| **5** | Sangat Penting |

**Contoh:**
- Jika "Pengembangan Diri" sangat penting bagi Anda, pilih nilai **5**.
- Jika "Frekuensi Pertemuan" kurang penting, pilih nilai **1** atau **2**.

### Langkah 3: Klik "Cari Rekomendasi"
Setelah semua kriteria diisi, klik tombol biru **Cari Rekomendasi** di bagian bawah form.

> **Catatan:** Semua 5 kriteria harus diisi sebelum tombol dapat diklik. Sistem akan menampilkan peringatan jika ada kriteria yang belum dijawab.

---

## 7. Melihat Perhitungan

Setelah mengisi kuesioner dan klik "Cari Rekomendasi", Anda akan diarahkan ke halaman **Perhitungan** yang menampilkan 7 tahapan TOPSIS secara lengkap:

### Tahap 1: Matriks Keputusan (X)
Menampilkan data asli setiap alternatif UKM berdasarkan 5 kriteria.

### Tahap 2: Normalisasi Matriks Keputusan
Menampilkan nilai yang sudah dinormalisasi menggunakan rumus:
```
rij = xij / √(Σxij²)
```

### Tahap 3: Matriks Normalisasi Terbobot
Menampilkan hasil perkalian antara bobot kriteria dengan matriks ternormalisasi:
```
yij = wj × rij
```

### Tahap 4: Solusi Ideal Positif (A+) & Negatif (A-)
Menampilkan vektor solusi ideal:
- **A+**: Nilai terbaik setiap kriteria (max untuk benefit, min untuk cost)
- **A-**: Nilai terburuk setiap kriteria (min untuk benefit, max untuk cost)

### Tahap 5: Jarak terhadap Solusi Ideal
Menampilkan jarak Euclidean masing-masing alternatif ke solusi ideal positif (D+) dan negatif (D-):
```
Di+ = √(Σ(yj+ − yij)²)
Di- = √(Σ(yij − yj-)²)
```

### Tahap 6: Nilai Preferensi
Menampilkan skor preferensi akhir (Vi) dan ranking:
```
Vi = Di- / (Di+ + Di-)
```
Semakin mendekati 1, semakin baik alternatif tersebut.

### Tahap Tambahan: Bobot Kriteria
Menampilkan bobot yang dihasilkan dari jawaban kuesioner Anda (input Likert dinormalisasi hingga total = 1.00).

---

## 8. Melihat Hasil & Rekomendasi

Halaman **Hasil** menampilkan 3 komponen utama:

### A. Rekomendasi Terbaik
Menampilkan UKM dengan peringkat #1 beserta nilai preferensinya, lengkap dengan ikon piala 🏆.

### B. Top 3 Rekomendasi
Menampilkan 3 UKM terbaik dengan medali:
- 🥇 Peringkat 1
- 🥈 Peringkat 2
- 🥉 Peringkat 3

Klik **"Lihat nilai kriteria"** pada setiap kartu untuk melihat detail nilai masing-masing kriteria.

### C. Tabel Ranking Lengkap
Menampilkan seluruh 6 UKM yang telah diurutkan berdasarkan nilai preferensi tertinggi. Kolom tabel:

| Kolom | Keterangan |
|-------|------------|
| Ranking | Peringkat (1-6) |
| Alternatif UKM | Nama UKM |
| Nilai Preferensi (Vi) | Skor akhir TOPSIS |
| D+ | Jarak ke solusi ideal positif |
| D- | Jarak ke solusi ideal negatif |
| Status | Rekomendasi #1 / Top 3 / Alternatif |

### D. Laporan Naratif
Ringkasan teks yang menjelaskan:
- 3 rekomendasi teratas
- Alasan mengapa UKM terbaik direkomendasikan
- Bobot kriteria yang digunakan
- Tanggal hasil dihitung

---

## 9. Halaman Tentang

Halaman ini berisi informasi:

- **Latar Belakang**: Mengapa sistem ini dibuat dan masalah yang diselesaikan
- **Metode TOPSIS**: Penjelasan singkat tentang cara kerja metode TOPSIS dalam 6 langkah
- **Daftar Alternatif UKM**: Nama-nama UKM yang dinilai
- **Peneliti**: Nama dan NIM kelompok pengembang (Kelompok KICAU)

---

## 10. Cetak Laporan

Untuk mencetak atau menyimpan hasil sebagai PDF:

1. Buka halaman **Hasil**.
2. Klik tombol **Cetak Laporan** di pojok kanan atas halaman hasil.
3. Jendela cetak browser akan terbuka.
4. Pilih **Simpan sebagai PDF** pada tujuan printer, atau pilih printer fisik Anda.
5. Klik **Cetak** atau **Save**.

> **Tips:** Untuk hasil terbaik, gunakan pengaturan orientasi **Landscape** saat mencetak.

---

## Alur Penggunaan Singkat

```
Buka Aplikasi → Beranda (Informasi) → Input Data (Isi Kuesioner)
→ Klik "Cari Rekomendasi" → Perhitungan (Lihat Proses) → Hasil (Lihat Ranking)
→ Cetak Laporan (Opsional)
```

---

## FAQ (Pertanyaan Umum)

**Q: Apakah saya bisa mengubah data UKM?**  
A: Saat ini data UKM (nama, nilai kriteria) bersifat tetap. Yang dapat Anda ubah adalah bobot kriteria melalui kuesioner.

**Q: Bagaimana jika saya ingin menghitung ulang dengan preferensi berbeda?**  
A: Kembali ke halaman **Input Data**, isi ulang kuesioner, dan klik "Cari Rekomendasi" lagi. Hasil sebelumnya akan diperbarui.

**Q: Apa arti nilai preferensi?**  
A: Nilai preferensi (Vi) berkisar antara 0 hingga 1. Semakin mendekati 1, semakin sesuai UKM tersebut dengan preferensi Anda.

**Q: Apakah data kuesioner disimpan?**  
A: Data tidak disimpan secara permanen. Setiap kali Anda menghitung, data baru digunakan langsung tanpa tersimpan di server.

---

## Kontak

Sistem ini dikembangkan oleh Kelompok KICAU — Sistem Pendukung Keputusan, Fakultas Teknik Universitas Jenderal Soedirman.

Untuk pertanyaan atau masukan mengenai sistem ini, silakan hubungi penulis penelitian terkait.
