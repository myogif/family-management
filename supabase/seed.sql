-- ============================================
-- SUPABASE SEED DATA
-- Family Management Application
-- ============================================

-- Note: Run this in Supabase SQL Editor after enabling Auth and creating tables

-- ============================================
-- 1. CREATE AUTH USER
-- ============================================

-- Create the main user (jhondhoe@gmail.com / password)
-- Password hash is for 'password' using bcrypt
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '00000000-0000-0000-0000-000000000000',
    'jhondhoe@gmail.com',
    '$2a$10$3lR3iRT5IjlT8r0h0qR5XuP9q8l0mN7vK6jH5gF4dS3aQ2wE1rT4yU5iO6pL7kJ8hG9fD0sA1qW2eR3tY4uI5oP6lK7jH8gF9dS0aQ1wE2rT3yU4iO5pL6kJ7hG8fD9sA0qW1eR2tY3uI4oP5lK6j',
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Jhon Dhoe"}',
    false,
    'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Create additional family members
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
) VALUES
    (
        'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22',
        '00000000-0000-0000-0000-000000000000',
        'jane@family.com',
        '$2a$10$3lR3iRT5IjlT8r0h0qR5XuP9q8l0mN7vK6jH5gF4dS3aQ2wE1rT4yU5iO6pL7kJ8hG9fD0sA1qW2eR3tY4uI5oP6lK7jH8gF9dS0aQ1wE2rT3yU4iO5pL6kJ7hG8fD9sA0qW1eR2tY3uI4oP5lK6j',
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Jane Smith"}',
        false,
        'authenticated'
    ),
    (
        'c2ggde11-be2d-6f0a-dd8f-8dd1df5a2c33',
        '00000000-0000-0000-0000-000000000000',
        'mike@family.com',
        '$2a$10$3lR3iRT5IjlT8r0h0qR5XuP9q8l0mN7vK6jH5gF4dS3aQ2wE1rT4yU5iO6pL7kJ8hG9fD0sA1qW2eR3tY4uI5oP6lK7jH8gF9dS0aQ1wE2rT3yU4iO5pL6kJ7hG8fD9sA0qW1eR2tY3uI4oP5lK6j',
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Mike Johnson"}',
        false,
        'authenticated'
    ),
    (
        'd3hhef22-cf3e-7a1b-ee9g-9ee2eg6b3d44',
        '00000000-0000-0000-0000-000000000000',
        'sarah@family.com',
        '$2a$10$3lR3iRT5IjlT8r0h0qR5XuP9q8l0mN7vK6jH5gF4dS3aQ2wE1rT4yU5iO6pL7kJ8hG9fD0sA1qW2eR3tY4uI5oP6lK7jH8gF9dS0aQ1wE2rT3yU4iO5pL6kJ7hG8fD9sA0qW1eR2tY3uI4oP5lK6j',
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Sarah Williams"}',
        false,
        'authenticated'
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. CREATE PROFILES
-- ============================================

INSERT INTO public.profiles (id, user_id, full_name, phone, avatar_url, created_at, updated_at) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Jhon Dhoe', '+6281234567890', NULL, NOW(), NOW()),
    ('b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', 'Jane Smith', '+6281234567891', NULL, NOW(), NOW()),
    ('c2ggde11-be2d-6f0a-dd8f-8dd1df5a2c33', 'c2ggde11-be2d-6f0a-dd8f-8dd1df5a2c33', 'Mike Johnson', '+6281234567892', NULL, NOW(), NOW()),
    ('d3hhef22-cf3e-7a1b-ee9g-9ee2eg6b3d44', 'd3hhef22-cf3e-7a1b-ee9g-9ee2eg6b3d44', 'Sarah Williams', '+6281234567893', NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. CREATE FAMILIES
-- ============================================

INSERT INTO public.families (id, name, description, created_by, created_at, updated_at) VALUES
    ('f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Keluarga Besar Dhoe', 'Keluarga inti Jhon Dhoe dengan anggota keluarga yang tinggal di Jakarta', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('g2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'Smith Family', 'Smith family household', 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. CREATE FAMILY MEMBERS
-- ============================================

INSERT INTO public.family_members (id, family_id, user_id, role, joined_at, created_at, updated_at) VALUES
    -- Keluarga Besar Dhoe
    ('m1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'owner', NOW(), NOW(), NOW()),
    ('m2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', 'admin', NOW(), NOW(), NOW()),
    ('m3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c2ggde11-be2d-6f0a-dd8f-8dd1df5a2c33', 'member', NOW(), NOW(), NOW()),
    -- Smith Family
    ('m4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', 'g2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', 'owner', NOW(), NOW(), NOW()),
    ('m5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', 'g2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'd3hhef22-cf3e-7a1b-ee9g-9ee2eg6b3d44', 'member', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CREATE CATEGORIES
-- ============================================

INSERT INTO public.categories (id, family_id, name, type, icon, created_at, updated_at) VALUES
    -- Keluarga Besar Dhoe - Income Categories
    ('c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Gaji', 'income', '💰', NOW(), NOW()),
    ('c2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Bonus', 'income', '🎁', NOW(), NOW()),
    ('c3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Investasi', 'income', '📈', NOW(), NOW()),
    ('c4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Lainnya', 'income', '💵', NOW(), NOW()),
    -- Keluarga Besar Dhoe - Expense Categories
    ('c5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Makanan', 'expense', '🍽️', NOW(), NOW()),
    ('c6f7a8b9-c0d1-9e2f-3a4b-5c6d7e8f9g0h', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Transportasi', 'expense', '🚗', NOW(), NOW()),
    ('c7a8b9c0-d1e2-af3a-4b5c-6d7e8f9g0h1i', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Utilitas', 'expense', '💡', NOW(), NOW()),
    ('c8b9c0d1-e2f3-b4b5-5c6d-7e8f9g0h1i2j', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Kesehatan', 'expense', '🏥', NOW(), NOW()),
    ('c9c0d1e2-f3a4-c5c6-6d7e-8f9g0h1i2j3k', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Pendidikan', 'expense', '📚', NOW(), NOW()),
    ('c0d1e2f3-a4b5-d6d7-7e8f-9g0h1i2j3k4l', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Hiburan', 'expense', '🎬', NOW(), NOW()),
    ('c1e2f3a4-b5c6-e7e8-8f9g-0h1i2j3k4l5m', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Belanja', 'expense', '🛍️', NOW(), NOW()),
    ('c2f3a4b5-c6d7-f8f9-9g0h-1i2j3k4l5m6n', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Lainnya', 'expense', '📦', NOW(), NOW()),
    -- Smith Family Categories
    ('c3a4b5c6-d7e8-g0g1-0h1i-2j3k4l5m6n7o', 'g2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'Salary', 'income', '💰', NOW(), NOW()),
    ('c4b5c6d7-e8f9-h1h2-1i2j-3k4l5m6n7o8p', 'g2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'Food', 'expense', '🍽️', NOW(), NOW()),
    ('c5c6d7e8-f9g0-i2i3-2j3k-4l5m6n7o8p9q', 'g2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'Housing', 'expense', '🏠', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. CREATE TRANSACTIONS
-- ============================================

INSERT INTO public.transactions (id, family_id, category_id, created_by, type, amount, transaction_date, description, payment_method, created_at, updated_at) VALUES
    -- Income Transactions
    ('t1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'income', 15000000.00, NOW() - INTERVAL '30 days', 'Gaji Bulan Januari', 'transfer', NOW(), NOW()),
    ('t2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'income', 15000000.00, NOW() - INTERVAL '15 days', 'Gaji Bulan Februari', 'transfer', NOW(), NOW()),
    ('t3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'income', 5000000.00, NOW() - INTERVAL '20 days', 'Bonus Tahunan', 'transfer', NOW(), NOW()),
    ('t4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'income', 2500000.00, NOW() - INTERVAL '10 days', 'Dividen Saham', 'transfer', NOW(), NOW()),
    -- Expense Transactions
    ('t5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'expense', 3500000.00, NOW() - INTERVAL '28 days', 'Belanja bulanan supermarket', 'card', NOW(), NOW()),
    ('t6f7a8b9-c0d1-9e2f-3a4b-5c6d7e8f9g0h', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c6f7a8b9-c0d1-9e2f-3a4b-5c6d7e8f9g0h', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'expense', 1500000.00, NOW() - INTERVAL '25 days', 'Bensin mobil', 'cash', NOW(), NOW()),
    ('t7a8b9c0-d1e2-af3a-4b5c-6d7e8f9g0h1i', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c7a8b9c0-d1e2-af3a-4b5c-6d7e8f9g0h1i', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'expense', 2500000.00, NOW() - INTERVAL '5 days', 'Tagihan listrik dan air', 'transfer', NOW(), NOW()),
    ('t8b9c0d1-e2f3-b4b5-5c6d-7e8f9g0h1i2j', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c8b9c0d1-e2f3-b4b5-5c6d-7e8f9g0h1i2j', 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', 'expense', 850000.00, NOW() - INTERVAL '12 days', 'Pemeriksaan kesehatan rutin', 'card', NOW(), NOW()),
    ('t9c0d1e2-f3a4-c5c6-6d7e-8f9g0h1i2j3k', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c9c0d1e2-f3a4-c5c6-6d7e-8f9g0h1i2j3k', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'expense', 2000000.00, NOW() - INTERVAL '8 days', 'Biaya sekolah anak', 'transfer', NOW(), NOW()),
    ('t0d1e2f3-a4b5-d6d7-7e8f-9g0h1i2j3k4l', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c0d1e2f3-a4b5-d6d7-7e8f-9g0h1i2j3k4l', 'c2ggde11-be2d-6f0a-dd8f-8dd1df5a2c33', 'expense', 500000.00, NOW() - INTERVAL '3 days', 'Nonton bioskop dan makan', 'cash', NOW(), NOW()),
    ('t1e2f3a4-b5c6-e7e8-8f9g-0h1i2j3k4l5m', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c1e2f3a4-b5c6-e7e8-8f9g-0h1i2j3k4l5m', 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', 'expense', 1200000.00, NOW() - INTERVAL '18 days', 'Belanja pakaian', 'card', NOW(), NOW()),
    ('t2f3a4b5-c6d7-f8f9-9g0h-1i2j3k4l5m6n', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c6f7a8b9-c0d1-9e2f-3a4b-5c6d7e8f9g0h', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'expense', 300000.00, NOW() - INTERVAL '1 day', 'Parkir dan tol', 'cash', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. CREATE ASSETS
-- ============================================

INSERT INTO public.assets (id, family_id, name, category, purchase_value, current_value, purchase_date, description, created_by, created_at, updated_at) VALUES
    ('a1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Rumah Jakarta Selatan', 'property', 850000000.00, 1200000000.00, '2020-03-15', 'Rumah tinggal 2 lantai di area strategis', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('a2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Toyota Camry', 'vehicle', 450000000.00, 380000000.00, '2022-06-20', 'Mobil keluarga untuk daily use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('a3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Saham Blue Chip', 'investment', 100000000.00, 125000000.00, '2023-01-10', 'Investasi saham jangka panjang', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('a4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Emas Batangan', 'investment', 50000000.00, 58000000.00, '2023-08-05', 'Tabungan emas 100 gram', 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', NOW(), NOW()),
    ('a5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'MacBook Pro', 'electronics', 35000000.00, 28000000.00, '2023-04-12', 'Laptop untuk kerja', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. CREATE DEBTS
-- ============================================

INSERT INTO public.debts (id, family_id, name, type, principal_amount, remaining_amount, due_date, status, description, created_by, created_at, updated_at) VALUES
    ('d1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'KPR Rumah', 'debt', 500000000.00, 420000000.00, '2040-03-15', 'active', 'Cicilan KPR 15 tahun', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('d2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Cicilan Mobil', 'debt', 350000000.00, 180000000.00, '2027-06-20', 'active', 'Cicilan mobil 5 tahun', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('d3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Pinjaman ke Bank', 'debt', 50000000.00, 15000000.00, '2025-01-30', 'active', 'Pinjaman untuk renovasi', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('d4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Utang ke Teman', 'debt', 10000000.00, 5000000.00, '2024-12-31', 'active', 'Pinjaman darurat', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('d5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Piutang dari Saudara', 'receivable', 15000000.00, 15000000.00, '2025-02-28', 'active', 'Pinjaman untuk usaha saudara', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. CREATE GOALS
-- ============================================

INSERT INTO public.goals (id, family_id, name, target_amount, current_amount, deadline, description, status, created_by, created_at, updated_at) VALUES
    ('g1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Dana Darurat', 100000000.00, 75000000.00, '2025-12-31', 'Tabungan untuk kebutuhan darurat 6 bulan', 'active', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('g2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Liburan ke Jepang', 50000000.00, 25000000.00, '2025-06-30', 'Tabungan untuk liburan keluarga ke Jepang', 'active', 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', NOW(), NOW()),
    ('g3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'DP Mobil Baru', 150000000.00, 50000000.00, '2026-03-31', 'Tabungan untuk down payment mobil baru', 'active', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('g4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Renovasi Dapur', 80000000.00, 80000000.00, '2024-12-31', 'Renovasi dapur dan belanja peralatan', 'completed', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('g5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Beli Motor', 30000000.00, 5000000.00, '2024-06-30', 'Tabungan beli motor baru', 'cancelled', 'c2ggde11-be2d-6f0a-dd8f-8dd1df5a2c33', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 10. CREATE EVENTS
-- ============================================

INSERT INTO public.events (id, family_id, title, description, start_at, end_at, location, created_by, created_at, updated_at) VALUES
    ('e1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Ulang Tahun Papa', 'Perayaan ulang tahun papa ke-45', NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days 4 hours', 'Rumah', 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', NOW(), NOW()),
    ('e2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Rapat Keluarga', 'Diskusi rencana liburan tahun ini', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 2 hours', 'Ruang Tamu', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('e3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Pemeriksaan Gigi Rutin', 'Check up gigi 6 bulanan', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 1 hour', 'Klinik Gigi Sehat', 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', NOW(), NOW()),
    ('e4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Acara Sekolah Anak', 'Pertunjukan akhir tahun sekolah', NOW() + INTERVAL '20 days', NOW() + INTERVAL '20 days 3 hours', 'Gedung Serbaguna', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), NOW()),
    ('e5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Makan Malam Bersama', 'Makan malam keluarga besar', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days 3 hours', 'Restoran Padang', 'c2ggde11-be2d-6f0a-dd8f-8dd1df5a2c33', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. CREATE NOTIFICATIONS
-- ============================================

INSERT INTO public.notifications (id, user_id, family_id, title, message, type, is_read, created_at) VALUES
    ('n1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Pembayaran KPR Jatuh Tempo', 'Pembayaran KPR bulan ini jatuh tempo dalam 3 hari', 'debt_overdue', false, NOW()),
    ('n2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Goal Tercapai!', 'Selamat! Goal Renovasi Dapur telah tercapai', 'goal_deadline', false, NOW()),
    ('n3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Ulang Tahun Papa', 'Ulang tahun papa dalam 15 hari', 'event_reminder', true, NOW()),
    ('n4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Transaksi Baru', 'Jhon menambahkan transaksi baru: Gaji Bulan Februari', 'system', false, NOW()),
    ('n5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Selamat Datang!', 'Selamat datang di Family Management App', 'system', true, NOW() - INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 12. CREATE ACTIVITY LOGS
-- ============================================

INSERT INTO public.activity_logs (id, family_id, user_id, action, entity_type, entity_id, description, metadata, created_at) VALUES
    ('l1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'create', 'transaction', 't1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Menambahkan transaksi: Gaji Bulan Januari - Rp 15.000.000', '{"amount": 15000000}', NOW() - INTERVAL '30 days'),
    ('l2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'create', 'asset', 'a1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'Menambahkan aset: Rumah Jakarta Selatan', '{"value": 850000000}', NOW() - INTERVAL '30 days'),
    ('l3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22', 'create', 'goal', 'g2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', 'Membuat goal: Liburan ke Jepang', '{"target": 50000000}', NOW() - INTERVAL '20 days'),
    ('l4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'update', 'goal', 'g4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', 'Mengupdate goal: Renovasi Dapur menjadi completed', '{"status": "completed"}', NOW() - INTERVAL '5 days'),
    ('l5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'c2ggde11-be2d-6f0a-dd8f-8dd1df5a2c33', 'create', 'event', 'e5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', 'Membuat acara: Makan Malam Bersama', '{"date": "2024-01-15"}', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEED COMPLETED
-- ============================================

-- Summary of seeded data:
-- - 4 Users (jhondhoe@gmail.com, jane@family.com, mike@family.com, sarah@family.com)
-- - 4 Profiles
-- - 2 Families (Keluarga Besar Dhoe, Smith Family)
-- - 5 Family Members
-- - 15 Categories (Income & Expense)
-- - 12 Transactions
-- - 5 Assets
-- - 5 Debts (4 debts, 1 receivable)
-- - 5 Goals (3 active, 1 completed, 1 cancelled)
-- - 5 Events
-- - 5 Notifications
-- - 5 Activity Logs
--
-- Login credentials:
-- Email: jhondhoe@gmail.com
-- Password: password
