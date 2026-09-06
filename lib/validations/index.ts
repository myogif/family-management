import { z } from 'zod'

// Auth
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  passwordConfirm: z.string(),
  fullName: z.string().min(2, 'Full name is required'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
})

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// Profile
export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
})

// Family
export const createFamilySchema = z.object({
  name: z.string().min(1, 'Family name is required').max(100),
  description: z.string().max(500).optional(),
})

export const updateFamilySchema = createFamilySchema

// Categories
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  type: z.enum(['income', 'expense', 'both']),
  icon: z.string().optional(),
})

// Transactions
export const createTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Must be a positive number'),
  categoryId: z.string().uuid('Invalid category'),
  transactionDate: z.string().datetime(),
  description: z.string().optional().default(''),
  paymentMethod: z.string().optional().default('cash'),
})

// Assets
export const createAssetSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  category: z.string().min(1, 'Category is required'),
  purchaseValue: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Must be a non-negative number'),
  currentValue: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Must be a non-negative number'),
  purchaseDate: z.string().datetime(),
  description: z.string().optional().default(''),
})

// Debts
export const createDebtSchema = z.object({
  name: z.string().min(1, 'Debt name is required'),
  type: z.enum(['debt', 'receivable']),
  principalAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Must be a positive number'),
  remainingAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Must be a non-negative number'),
  dueDate: z.string().datetime(),
  status: z.enum(['active', 'paid', 'overdue']),
  description: z.string().optional().default(''),
})

// Goals
export const createGoalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  targetAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Must be a positive number'),
  currentAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Must be a non-negative number'),
  deadline: z.string().datetime(),
  description: z.string().optional().default(''),
  status: z.enum(['active', 'completed', 'cancelled']).optional().default('active'),
})

// Events
export const createEventSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional().default(''),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  location: z.string().optional().default(''),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type CreateFamilyInput = z.infer<typeof createFamilySchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type CreateAssetInput = z.infer<typeof createAssetSchema>
export type CreateDebtInput = z.infer<typeof createDebtSchema>
export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type CreateEventInput = z.infer<typeof createEventSchema>
