/**
 * Data default berdasarkan Draft Artikel SPK KICAU #1
 * SPK Rekomendasi UKM Fakultas Teknik Unsoed - Metode TOPSIS
 */

const DEFAULT_DATA = {
  title: 'SPK Rekomendasi Unit Kegiatan Mahasiswa (UKM)',
  subtitle: 'Fakultas Teknik Universitas Jenderal Soedirman',
  method: 'TOPSIS',
  authors: [
    'Satria Megantara Wildan Irchamy (H1D024022)',
    'Nindya Alif Romland (H1D024031)',
    'Edgina Syafa Ayu Wicaksono (H1D024046)'
  ],
  criteria: [
    {
      id: 'C1',
      name: 'Pengembangan Diri',
      type: 'benefit',
      weight: 0.30,
      description: 'Manfaat pengembangan diri yang diperoleh mahasiswa'
    },
    {
      id: 'C2',
      name: 'Peminatan',
      type: 'benefit',
      weight: 0.25,
      description: 'Kesesuaian UKM dengan minat mahasiswa'
    },
    {
      id: 'C3',
      name: 'Popularitas UKM',
      type: 'benefit',
      weight: 0.22,
      description: 'Jumlah anggota aktif UKM'
    },
    {
      id: 'C4',
      name: 'Prestasi UKM',
      type: 'benefit',
      weight: 0.17,
      description: 'Jumlah pencapaian/penghargaan yang dimiliki UKM'
    },
    {
      id: 'C5',
      name: 'Frekuensi Pertemuan',
      type: 'cost',
      weight: 0.06,
      description: 'Frekuensi pertemuan dalam satuan kali per minggu'
    }
  ],
  alternatives: [
    { id: 'A1', name: 'SEEO', values: [5, 4, 43, 7, 2] },
    { id: 'A2', name: 'EEC', values: [3, 3, 40, 2, 1] },
    { id: 'A3', name: 'SALMAN', values: [4, 3, 40, 0, 2] },
    { id: 'A4', name: 'KSMPA Titik Nol', values: [5, 2, 11, 1, 2] },
    { id: 'A5', name: 'PMKT', values: [3, 2, 31, 0, 2] },
    { id: 'A6', name: 'REKURSIF', values: [3, 3, 8, 0, 0] }
  ],
  expectedResults: [
    { name: 'SEEO', preference: 0.8788, rank: 1 },
    { name: 'EEC', preference: 0.4400, rank: 2 },
    { name: 'SALMAN', preference: 0.3709, rank: 3 },
    { name: 'KSMPA Titik Nol', preference: 0.2691, rank: 4 },
    { name: 'PMKT', preference: 0.2506, rank: 5 },
    { name: 'REKURSIF', preference: 0.1838, rank: 6 }
  ]
};
