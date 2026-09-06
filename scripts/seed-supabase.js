#!/usr/bin/env node

/**
 * Supabase Seeder Script
 *
 * Usage:
 * 1. Set environment variables in .env.local
 * 2. Run: node scripts/seed-supabase.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// UUIDs for consistent seeding
const IDS = {
  users: {
    jhon: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    jane: 'b1ffcd00-ad1c-5ef9-cc7e-7cc0ce491b22',
    mike: 'c2ggde11-be2d-6f0a-dd8f-8dd1df5a2c33',
    sarah: 'd3hhef22-cf3e-7a1b-ee9g-9ee2eg6b3d44'
  },
  families: {
    dhoe: 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    smith: 'g2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d'
  }
}

async function createAuthUsers() {
  console.log('Creating auth users...')

  const users = [
    {
      id: IDS.users.jhon,
      email: 'jhondhoe@gmail.com',
      password: 'password',
      options: {
        data: { full_name: 'Jhon Dhoe' }
      }
    },
    {
      id: IDS.users.jane,
      email: 'jane@family.com',
      password: 'password',
      options: {
        data: { full_name: 'Jane Smith' }
      }
    },
    {
      id: IDS.users.mike,
      email: 'mike@family.com',
      password: 'password',
      options: {
        data: { full_name: 'Mike Johnson' }
      }
    },
    {
      id: IDS.users.sarah,
      email: 'sarah@family.com',
      password: 'password',
      options: {
        data: { full_name: 'Sarah Williams' }
      }
    }
  ]

  for (const user of users) {
    const { error } = await supabase.auth.admin.createUser({
      id: user.id,
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: user.options.data
    })

    if (error && !error.message.includes('already been registered')) {
      console.error(`Error creating user ${user.email}:`, error.message)
    } else {
      console.log(`✓ User ${user.email} ${error ? 'already exists' : 'created'}`)
    }
  }
}

async function createProfiles() {
  console.log('\nCreating profiles...')

  const profiles = [
    { id: IDS.users.jhon, user_id: IDS.users.jhon, full_name: 'Jhon Dhoe', phone: '+6281234567890' },
    { id: IDS.users.jane, user_id: IDS.users.jane, full_name: 'Jane Smith', phone: '+6281234567891' },
    { id: IDS.users.mike, user_id: IDS.users.mike, full_name: 'Mike Johnson', phone: '+6281234567892' },
    { id: IDS.users.sarah, user_id: IDS.users.sarah, full_name: 'Sarah Williams', phone: '+6281234567893' }
  ]

  for (const profile of profiles) {
    const { error } = await supabase.from('profiles').upsert(profile)
    if (error) {
      console.error(`Error creating profile for ${profile.full_name}:`, error.message)
    } else {
      console.log(`✓ Profile ${profile.full_name}`)
    }
  }
}

async function createFamilies() {
  console.log('\nCreating families...')

  const families = [
    {
      id: IDS.families.dhoe,
      name: 'Keluarga Besar Dhoe',
      description: 'Keluarga inti Jhon Dhoe dengan anggota keluarga yang tinggal di Jakarta',
      created_by: IDS.users.jhon
    },
    {
      id: IDS.families.smith,
      name: 'Smith Family',
      description: 'Smith family household',
      created_by: IDS.users.jane
    }
  ]

  for (const family of families) {
    const { error } = await supabase.from('families').upsert(family)
    if (error) {
      console.error(`Error creating family ${family.name}:`, error.message)
    } else {
      console.log(`✓ Family ${family.name}`)
    }
  }
}

async function createFamilyMembers() {
  console.log('\nCreating family members...')

  const members = [
    { id: 'm1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', family_id: IDS.families.dhoe, user_id: IDS.users.jhon, role: 'owner' },
    { id: 'm2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', family_id: IDS.families.dhoe, user_id: IDS.users.jane, role: 'admin' },
    { id: 'm3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', family_id: IDS.families.dhoe, user_id: IDS.users.mike, role: 'member' },
    { id: 'm4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', family_id: IDS.families.smith, user_id: IDS.users.jane, role: 'owner' },
    { id: 'm5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', family_id: IDS.families.smith, user_id: IDS.users.sarah, role: 'member' }
  ]

  for (const member of members) {
    const { error } = await supabase.from('family_members').upsert(member)
    if (error) {
      console.error(`Error creating family member:`, error.message)
    } else {
      console.log(`✓ Family member ${member.role}`)
    }
  }
}

async function createCategories() {
  console.log('\nCreating categories...')

  const categories = [
    // Income categories for Dhoe family
    { id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', family_id: IDS.families.dhoe, name: 'Gaji', type: 'income', icon: '💰' },
    { id: 'c2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', family_id: IDS.families.dhoe, name: 'Bonus', type: 'income', icon: '🎁' },
    { id: 'c3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', family_id: IDS.families.dhoe, name: 'Investasi', type: 'income', icon: '📈' },
    { id: 'c4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', family_id: IDS.families.dhoe, name: 'Lainnya', type: 'income', icon: '💵' },
    // Expense categories for Dhoe family
    { id: 'c5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', family_id: IDS.families.dhoe, name: 'Makanan', type: 'expense', icon: '🍽️' },
    { id: 'c6f7a8b9-c0d1-9e2f-3a4b-5c6d7e8f9g0h', family_id: IDS.families.dhoe, name: 'Transportasi', type: 'expense', icon: '🚗' },
    { id: 'c7a8b9c0-d1e2-af3a-4b5c-6d7e8f9g0h1i', family_id: IDS.families.dhoe, name: 'Utilitas', type: 'expense', icon: '💡' },
    { id: 'c8b9c0d1-e2f3-b4b5-5c6d-7e8f9g0h1i2j', family_id: IDS.families.dhoe, name: 'Kesehatan', type: 'expense', icon: '🏥' },
    { id: 'c9c0d1e2-f3a4-c5c6-6d7e-8f9g0h1i2j3k', family_id: IDS.families.dhoe, name: 'Pendidikan', type: 'expense', icon: '📚' },
    { id: 'c0d1e2f3-a4b5-d6d7-7e8f-9g0h1i2j3k4l', family_id: IDS.families.dhoe, name: 'Hiburan', type: 'expense', icon: '🎬' },
    { id: 'c1e2f3a4-b5c6-e7e8-8f9g-0h1i2j3k4l5m', family_id: IDS.families.dhoe, name: 'Belanja', type: 'expense', icon: '🛍️' },
    { id: 'c2f3a4b5-c6d7-f8f9-9g0h-1i2j3k4l5m6n', family_id: IDS.families.dhoe, name: 'Lainnya', type: 'expense', icon: '📦' },
    // Smith family categories
    { id: 'c3a4b5c6-d7e8-g0g1-0h1i-2j3k4l5m6n7o', family_id: IDS.families.smith, name: 'Salary', type: 'income', icon: '💰' },
    { id: 'c4b5c6d7-e8f9-h1h2-1i2j-3k4l5m6n7o8p', family_id: IDS.families.smith, name: 'Food', type: 'expense', icon: '🍽️' },
    { id: 'c5c6d7e8-f9g0-i2i3-2j3k-4l5m6n7o8p9q', family_id: IDS.families.smith, name: 'Housing', type: 'expense', icon: '🏠' }
  ]

  for (const category of categories) {
    const { error } = await supabase.from('categories').upsert(category)
    if (error) {
      console.error(`Error creating category ${category.name}:`, error.message)
    } else {
      console.log(`✓ Category ${category.name}`)
    }
  }
}

async function createTransactions() {
  console.log('\nCreating transactions...')

  const transactions = [
    // Income
    { id: 't1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', family_id: IDS.families.dhoe, category_id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', created_by: IDS.users.jhon, type: 'income', amount: 15000000, description: 'Gaji Bulan Januari', payment_method: 'transfer' },
    { id: 't2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', family_id: IDS.families.dhoe, category_id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', created_by: IDS.users.jhon, type: 'income', amount: 15000000, description: 'Gaji Bulan Februari', payment_method: 'transfer' },
    { id: 't3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', family_id: IDS.families.dhoe, category_id: 'c2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', created_by: IDS.users.jhon, type: 'income', amount: 5000000, description: 'Bonus Tahunan', payment_method: 'transfer' },
    { id: 't4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', family_id: IDS.families.dhoe, category_id: 'c3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', created_by: IDS.users.jhon, type: 'income', amount: 2500000, description: 'Dividen Saham', payment_method: 'transfer' },
    // Expense
    { id: 't5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', family_id: IDS.families.dhoe, category_id: 'c5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', created_by: IDS.users.jhon, type: 'expense', amount: 3500000, description: 'Belanja bulanan supermarket', payment_method: 'card' },
    { id: 't6f7a8b9-c0d1-9e2f-3a4b-5c6d7e8f9g0h', family_id: IDS.families.dhoe, category_id: 'c6f7a8b9-c0d1-9e2f-3a4b-5c6d7e8f9g0h', created_by: IDS.users.jhon, type: 'expense', amount: 1500000, description: 'Bensin mobil', payment_method: 'cash' },
    { id: 't7a8b9c0-d1e2-af3a-4b5c-6d7e8f9g0h1i', family_id: IDS.families.dhoe, category_id: 'c7a8b9c0-d1e2-af3a-4b5c-6d7e8f9g0h1i', created_by: IDS.users.jhon, type: 'expense', amount: 2500000, description: 'Tagihan listrik dan air', payment_method: 'transfer' },
    { id: 't8b9c0d1-e2f3-b4b5-5c6d-7e8f9g0h1i2j', family_id: IDS.families.dhoe, category_id: 'c8b9c0d1-e2f3-b4b5-5c6d-7e8f9g0h1i2j', created_by: IDS.users.jane, type: 'expense', amount: 850000, description: 'Pemeriksaan kesehatan rutin', payment_method: 'card' },
    { id: 't9c0d1e2-f3a4-c5c6-6d7e-8f9g0h1i2j3k', family_id: IDS.families.dhoe, category_id: 'c9c0d1e2-f3a4-c5c6-6d7e-8f9g0h1i2j3k', created_by: IDS.users.jhon, type: 'expense', amount: 2000000, description: 'Biaya sekolah anak', payment_method: 'transfer' },
    { id: 't0d1e2f3-a4b5-d6d7-7e8f-9g0h1i2j3k4l', family_id: IDS.families.dhoe, category_id: 'c0d1e2f3-a4b5-d6d7-7e8f-9g0h1i2j3k4l', created_by: IDS.users.mike, type: 'expense', amount: 500000, description: 'Nonton bioskop dan makan', payment_method: 'cash' },
    { id: 't1e2f3a4-b5c6-e7e8-8f9g-0h1i2j3k4l5m', family_id: IDS.families.dhoe, category_id: 'c1e2f3a4-b5c6-e7e8-8f9g-0h1i2j3k4l5m', created_by: IDS.users.jane, type: 'expense', amount: 1200000, description: 'Belanja pakaian', payment_method: 'card' },
    { id: 't2f3a4b5-c6d7-f8f9-9g0h-1i2j3k4l5m6n', family_id: IDS.families.dhoe, category_id: 'c6f7a8b9-c0d1-9e2f-3a4b-5c6d7e8f9g0h', created_by: IDS.users.jhon, type: 'expense', amount: 300000, description: 'Parkir dan tol', payment_method: 'cash' }
  ]

  for (const tx of transactions) {
    const { error } = await supabase.from('transactions').upsert({
      ...tx,
      transaction_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })
    if (error) {
      console.error(`Error creating transaction:`, error.message)
    } else {
      console.log(`✓ Transaction ${tx.type}: ${tx.description}`)
    }
  }
}

async function createAssets() {
  console.log('\nCreating assets...')

  const assets = [
    { id: 'a1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', family_id: IDS.families.dhoe, name: 'Rumah Jakarta Selatan', category: 'property', purchase_value: 850000000, current_value: 1200000000, purchase_date: '2020-03-15', description: 'Rumah tinggal 2 lantai di area strategis', created_by: IDS.users.jhon },
    { id: 'a2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', family_id: IDS.families.dhoe, name: 'Toyota Camry', category: 'vehicle', purchase_value: 450000000, current_value: 380000000, purchase_date: '2022-06-20', description: 'Mobil keluarga untuk daily use', created_by: IDS.users.jhon },
    { id: 'a3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', family_id: IDS.families.dhoe, name: 'Saham Blue Chip', category: 'investment', purchase_value: 100000000, current_value: 125000000, purchase_date: '2023-01-10', description: 'Investasi saham jangka panjang', created_by: IDS.users.jhon },
    { id: 'a4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', family_id: IDS.families.dhoe, name: 'Emas Batangan', category: 'investment', purchase_value: 50000000, current_value: 58000000, purchase_date: '2023-08-05', description: 'Tabungan emas 100 gram', created_by: IDS.users.jane },
    { id: 'a5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', family_id: IDS.families.dhoe, name: 'MacBook Pro', category: 'electronics', purchase_value: 35000000, current_value: 28000000, purchase_date: '2023-04-12', description: 'Laptop untuk kerja', created_by: IDS.users.jhon }
  ]

  for (const asset of assets) {
    const { error } = await supabase.from('assets').upsert(asset)
    if (error) {
      console.error(`Error creating asset ${asset.name}:`, error.message)
    } else {
      console.log(`✓ Asset ${asset.name}`)
    }
  }
}

async function createDebts() {
  console.log('\nCreating debts...')

  const debts = [
    { id: 'd1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', family_id: IDS.families.dhoe, name: 'KPR Rumah', type: 'debt', principal_amount: 500000000, remaining_amount: 420000000, due_date: '2040-03-15', status: 'active', description: 'Cicilan KPR 15 tahun', created_by: IDS.users.jhon },
    { id: 'd2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', family_id: IDS.families.dhoe, name: 'Cicilan Mobil', type: 'debt', principal_amount: 350000000, remaining_amount: 180000000, due_date: '2027-06-20', status: 'active', description: 'Cicilan mobil 5 tahun', created_by: IDS.users.jhon },
    { id: 'd3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', family_id: IDS.families.dhoe, name: 'Pinjaman ke Bank', type: 'debt', principal_amount: 50000000, remaining_amount: 15000000, due_date: '2025-01-30', status: 'active', description: 'Pinjaman untuk renovasi', created_by: IDS.users.jhon },
    { id: 'd4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', family_id: IDS.families.dhoe, name: 'Utang ke Teman', type: 'debt', principal_amount: 10000000, remaining_amount: 5000000, due_date: '2024-12-31', status: 'active', description: 'Pinjaman darurat', created_by: IDS.users.jhon },
    { id: 'd5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', family_id: IDS.families.dhoe, name: 'Piutang dari Saudara', type: 'receivable', principal_amount: 15000000, remaining_amount: 15000000, due_date: '2025-02-28', status: 'active', description: 'Pinjaman untuk usaha saudara', created_by: IDS.users.jhon }
  ]

  for (const debt of debts) {
    const { error } = await supabase.from('debts').upsert(debt)
    if (error) {
      console.error(`Error creating debt ${debt.name}:`, error.message)
    } else {
      console.log(`✓ Debt ${debt.name}`)
    }
  }
}

async function createGoals() {
  console.log('\nCreating goals...')

  const goals = [
    { id: 'g1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', family_id: IDS.families.dhoe, name: 'Dana Darurat', target_amount: 100000000, current_amount: 75000000, deadline: '2025-12-31', description: 'Tabungan untuk kebutuhan darurat 6 bulan', status: 'active', created_by: IDS.users.jhon },
    { id: 'g2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', family_id: IDS.families.dhoe, name: 'Liburan ke Jepang', target_amount: 50000000, current_amount: 25000000, deadline: '2025-06-30', description: 'Tabungan untuk liburan keluarga ke Jepang', status: 'active', created_by: IDS.users.jane },
    { id: 'g3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', family_id: IDS.families.dhoe, name: 'DP Mobil Baru', target_amount: 150000000, current_amount: 50000000, deadline: '2026-03-31', description: 'Tabungan untuk down payment mobil baru', status: 'active', created_by: IDS.users.jhon },
    { id: 'g4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', family_id: IDS.families.dhoe, name: 'Renovasi Dapur', target_amount: 80000000, current_amount: 80000000, deadline: '2024-12-31', description: 'Renovasi dapur dan belanja peralatan', status: 'completed', created_by: IDS.users.jhon },
    { id: 'g5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', family_id: IDS.families.dhoe, name: 'Beli Motor', target_amount: 30000000, current_amount: 5000000, deadline: '2024-06-30', description: 'Tabungan beli motor baru', status: 'cancelled', created_by: IDS.users.mike }
  ]

  for (const goal of goals) {
    const { error } = await supabase.from('goals').upsert(goal)
    if (error) {
      console.error(`Error creating goal ${goal.name}:`, error.message)
    } else {
      console.log(`✓ Goal ${goal.name}`)
    }
  }
}

async function createEvents() {
  console.log('\nCreating events...')

  const events = [
    { id: 'e1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', family_id: IDS.families.dhoe, title: 'Ulang Tahun Papa', description: 'Perayaan ulang tahun papa ke-45', start_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), end_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), location: 'Rumah', created_by: IDS.users.jane },
    { id: 'e2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', family_id: IDS.families.dhoe, title: 'Rapat Keluarga', description: 'Diskusi rencana liburan tahun ini', start_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), end_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), location: 'Ruang Tamu', created_by: IDS.users.jhon },
    { id: 'e3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', family_id: IDS.families.dhoe, title: 'Pemeriksaan Gigi Rutin', description: 'Check up gigi 6 bulanan', start_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), end_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(), location: 'Klinik Gigi Sehat', created_by: IDS.users.jane },
    { id: 'e4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', family_id: IDS.families.dhoe, title: 'Acara Sekolah Anak', description: 'Pertunjukan akhir tahun sekolah', start_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), end_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), location: 'Gedung Serbaguna', created_by: IDS.users.jhon },
    { id: 'e5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', family_id: IDS.families.dhoe, title: 'Makan Malam Bersama', description: 'Makan malam keluarga besar', start_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), end_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), location: 'Restoran Padang', created_by: IDS.users.mike }
  ]

  for (const event of events) {
    const { error } = await supabase.from('events').upsert(event)
    if (error) {
      console.error(`Error creating event ${event.title}:`, error.message)
    } else {
      console.log(`✓ Event ${event.title}`)
    }
  }
}

async function createNotifications() {
  console.log('\nCreating notifications...')

  const notifications = [
    { id: 'n1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', user_id: IDS.users.jhon, family_id: IDS.families.dhoe, title: 'Pembayaran KPR Jatuh Tempo', message: 'Pembayaran KPR bulan ini jatuh tempo dalam 3 hari', type: 'debt_overdue', is_read: false },
    { id: 'n2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', user_id: IDS.users.jhon, family_id: IDS.families.dhoe, title: 'Goal Tercapai!', message: 'Selamat! Goal Renovasi Dapur telah tercapai', type: 'goal_deadline', is_read: false },
    { id: 'n3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', user_id: IDS.users.jhon, family_id: IDS.families.dhoe, title: 'Ulang Tahun Papa', message: 'Ulang tahun papa dalam 15 hari', type: 'event_reminder', is_read: true },
    { id: 'n4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', user_id: IDS.users.jane, family_id: IDS.families.dhoe, title: 'Transaksi Baru', message: 'Jhon menambahkan transaksi baru: Gaji Bulan Februari', type: 'system', is_read: false },
    { id: 'n5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', user_id: IDS.users.jhon, family_id: IDS.families.dhoe, title: 'Selamat Datang!', message: 'Selamat datang di Family Management App', type: 'system', is_read: true }
  ]

  for (const notif of notifications) {
    const { error } = await supabase.from('notifications').upsert({
      ...notif,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })
    if (error) {
      console.error(`Error creating notification:`, error.message)
    } else {
      console.log(`✓ Notification ${notif.title}`)
    }
  }
}

async function createActivityLogs() {
  console.log('\nCreating activity logs...')

  const logs = [
    { id: 'l1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', family_id: IDS.families.dhoe, user_id: IDS.users.jhon, action: 'create', entity_type: 'transaction', entity_id: 't1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', description: 'Menambahkan transaksi: Gaji Bulan Januari - Rp 15.000.000', metadata: { amount: 15000000 } },
    { id: 'l2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', family_id: IDS.families.dhoe, user_id: IDS.users.jhon, action: 'create', entity_type: 'asset', entity_id: 'a1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', description: 'Menambahkan aset: Rumah Jakarta Selatan', metadata: { value: 850000000 } },
    { id: 'l3c4d5e6-f7a8-6b9c-0d1e-2f3a4b5c6d7e', family_id: IDS.families.dhoe, user_id: IDS.users.jane, action: 'create', entity_type: 'goal', entity_id: 'g2b3c4d5-e6f7-5a8b-9c0d-1e2f3a4b5c6d', description: 'Membuat goal: Liburan ke Jepang', metadata: { target: 50000000 } },
    { id: 'l4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', family_id: IDS.families.dhoe, user_id: IDS.users.jhon, action: 'update', entity_type: 'goal', entity_id: 'g4d5e6f7-a8b9-7c0d-1e2f-3a4b5c6d7e8f', description: 'Mengupdate goal: Renovasi Dapur menjadi completed', metadata: { status: 'completed' } },
    { id: 'l5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', family_id: IDS.families.dhoe, user_id: IDS.users.mike, action: 'create', entity_type: 'event', entity_id: 'e5e6f7a8-b9c0-8d1e-2f3a-4b5c6d7e8f9g', description: 'Membuat acara: Makan Malam Bersama', metadata: { date: '2024-01-15' } }
  ]

  for (const log of logs) {
    const { error } = await supabase.from('activity_logs').upsert({
      ...log,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })
    if (error) {
      console.error(`Error creating activity log:`, error.message)
    } else {
      console.log(`✓ Activity log ${log.action}`)
    }
  }
}

async function seed() {
  console.log('🌱 Starting Supabase seed...\n')

  try {
    await createAuthUsers()
    await createProfiles()
    await createFamilies()
    await createFamilyMembers()
    await createCategories()
    await createTransactions()
    await createAssets()
    await createDebts()
    await createGoals()
    await createEvents()
    await createNotifications()
    await createActivityLogs()

    console.log('\n✅ Seed completed successfully!')
    console.log('\nLogin credentials:')
    console.log('  Email: jhondhoe@gmail.com')
    console.log('  Password: password')
    console.log('\nOther users: jane@family.com, mike@family.com, sarah@family.com')
    console.log('All with password: password')
  } catch (error) {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()
