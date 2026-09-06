// Database Types
export interface Profile {
  id: string
  userId: string
  fullName: string
  phone?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Family {
  id: string
  name: string
  description?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type FamilyRole = 'owner' | 'admin' | 'member'

export interface FamilyMember {
  id: string
  familyId: string
  userId: string
  role: FamilyRole
  joinedAt: string
  createdAt: string
  updatedAt: string
}

export type CategoryType = 'income' | 'expense' | 'both'

export interface Category {
  id: string
  familyId: string
  name: string
  type: CategoryType
  icon?: string
  createdAt: string
  updatedAt: string
}

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  familyId: string
  categoryId: string
  createdBy: string
  type: TransactionType
  amount: string
  transactionDate: string
  description: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface Asset {
  id: string
  familyId: string
  name: string
  category: string
  purchaseValue: string
  currentValue: string
  purchaseDate: string
  description: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type DebtType = 'debt' | 'receivable'
export type DebtStatus = 'active' | 'paid' | 'overdue'

export interface Debt {
  id: string
  familyId: string
  name: string
  type: DebtType
  principalAmount: string
  remainingAmount: string
  dueDate: string
  status: DebtStatus
  description: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type GoalStatus = 'active' | 'completed' | 'cancelled'

export interface Goal {
  id: string
  familyId: string
  name: string
  targetAmount: string
  currentAmount: string
  deadline: string
  description: string
  status: GoalStatus
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  familyId: string
  title: string
  description: string
  startAt: string
  endAt: string
  location: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  familyId: string
  name: string
  filePath: string
  fileType: string
  fileSize: number
  description: string
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

export type NotificationType = 'debt_overdue' | 'goal_deadline' | 'event_reminder' | 'system'

export interface Notification {
  id: string
  userId: string
  familyId: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: string
}

export interface ActivityLog {
  id: string
  familyId: string
  userId: string
  action: string
  entityType: string
  entityId: string
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}
