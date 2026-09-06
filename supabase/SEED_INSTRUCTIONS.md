# Supabase Seeder Instructions

## Cara Menjalankan Seeder di Supabase

### Langkah 1: Setup Supabase Project

1. Buat project baru di [Supabase](https://supabase.com)
2. Copy Project URL dan Anon Key ke file `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Langkah 2: Jalankan Migrations

1. Buka Supabase Dashboard → SQL Editor
2. Jalankan migration files secara berurutan:
   - `migrations/00000000000000_baseline_migration.sql`
   - `migrations/20240101000000_add_functions.sql`

### Langkah 3: Jalankan Seeder

1. Buka Supabase Dashboard → SQL Editor
2. Copy isi file `supabase/seed.sql`
3. Paste ke SQL Editor
4. Klik "Run"

### Langkah 4: Verifikasi Data

Jalankan query berikut untuk memastikan data sudah masuk:

```sql
-- Cek users
SELECT email, raw_user_meta_data->>'full_name' as name 
FROM auth.users;

-- Cek families
SELECT * FROM families;

-- Cek transactions
SELECT * FROM transactions LIMIT 5;

-- Cek assets
SELECT * FROM assets;
```

---

## Data Dummy yang Dibuat

### Users (Login)
| Email | Password | Nama | Role |
|-------|----------|------|------|
| jhondhoe@gmail.com | password | Jhon Dhoe | Owner (Keluarga Besar Dhoe) |
| jane@family.com | password | Jane Smith | Admin (Keluarga Besar Dhoe) |
| mike@family.com | password | Mike Johnson | Member (Keluarga Besar Dhoe) |
| sarah@family.com | password | Sarah Williams | Member (Smith Family) |

### Families
1. **Keluarga Besar Dhoe** - Keluarga inti Jhon Dhoe di Jakarta
2. **Smith Family** - Keluarga Jane Smith

### Categories
- **Income**: Gaji, Bonus, Investasi, Lainnya
- **Expense**: Makanan, Transportasi, Utilitas, Kesehatan, Pendidikan, Hiburan, Belanja, Lainnya

### Transactions (12 transaksi)
- Income: Gaji (2x), Bonus, Dividen
- Expense: Makanan, Transportasi, Utilitas, Kesehatan, Pendidikan, Hiburan, Belanja, Parkir

### Assets (5 aset)
- Rumah Jakarta Selatan (Rp 1.2M)
- Toyota Camry (Rp 380jt)
- Saham Blue Chip (Rp 125jt)
- Emas Batangan (Rp 58jt)
- MacBook Pro (Rp 28jt)

### Debts (5 hutang/piutang)
- KPR Rumah (sisa Rp 420jt)
- Cicilan Mobil (sisa Rp 180jt)
- Pinjaman Bank (sisa Rp 15jt)
- Utang ke Teman (sisa Rp 5jt)
- Piutang dari Saudara (Rp 15jt)

### Goals (5 goals)
- Dana Darurat (75% tercapai)
- Liburan ke Jepang (50% tercapai)
- DP Mobil Baru (33% tercapai)
- Renovasi Dapur (100% - completed)
- Beli Motor (cancelled)

### Events (5 acara)
- Ulang Tahun Papa (15 hari lagi)
- Rapat Keluarga (3 hari lagi)
- Pemeriksaan Gigi (7 hari lagi)
- Acara Sekolah Anak (20 hari lagi)
- Makan Malam Bersama (sudah lewat)

### Notifications (5 notifikasi)
- Pembayaran KPR jatuh tempo
- Goal tercapai
- Ulang tahun reminder
- Transaksi baru
- Welcome message

---

## Troubleshooting

### Error: "duplicate key value violates unique constraint"
Ini normal jika menjalankan seeder berkali-kali. Data sudah ada.

### Error: "relation does not exist"
Jalankan migration files terlebih dahulu sebelum seeder.

### User tidak bisa login
1. Pastikan auth.users sudah dibuat
2. Cek di Authentication → Users di Supabase Dashboard
3. Jika belum ada, jalankan bagian "CREATE AUTH USER" saja dari seed.sql

---

## Catatan Penting

1. **Password** untuk semua user adalah: `password`
2. **User utama** untuk login: `jhondhoe@gmail.com`
3. Semua ID menggunakan UUID yang fixed untuk konsistensi
4. Data menggunakan `ON CONFLICT DO NOTHING` jadi aman dijalankan ulang
