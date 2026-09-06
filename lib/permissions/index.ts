import { FamilyRole } from '@/types'

// Permission definitions for each role
const rolePermissions: Record<FamilyRole, Set<string>> = {
  owner: new Set([
    'view_family',
    'edit_family',
    'delete_family',
    'manage_members',
    'change_member_role',
    'remove_member',
    'invite_member',
    'create_category',
    'edit_category',
    'delete_category',
    'create_transaction',
    'edit_transaction',
    'delete_transaction',
    'create_asset',
    'edit_asset',
    'delete_asset',
    'create_debt',
    'edit_debt',
    'delete_debt',
    'create_goal',
    'edit_goal',
    'delete_goal',
    'create_event',
    'edit_event',
    'delete_event',
    'upload_document',
    'delete_document',
    'view_activity_log',
    'view_notifications',
  ]),
  admin: new Set([
    'view_family',
    'create_category',
    'edit_category',
    'delete_category',
    'create_transaction',
    'edit_transaction',
    'delete_transaction',
    'create_asset',
    'edit_asset',
    'delete_asset',
    'create_debt',
    'edit_debt',
    'delete_debt',
    'create_goal',
    'edit_goal',
    'delete_goal',
    'create_event',
    'edit_event',
    'delete_event',
    'upload_document',
    'delete_document',
    'view_activity_log',
    'view_notifications',
  ]),
  member: new Set([
    'view_family',
    'create_transaction',
    'edit_transaction',
    'create_asset',
    'create_event',
    'upload_document',
    'view_notifications',
  ]),
}

export function hasPermission(role: FamilyRole, permission: string): boolean {
  return rolePermissions[role]?.has(permission) ?? false
}

export function canManageFamily(role: FamilyRole): boolean {
  return role === 'owner'
}

export function canManageMembers(role: FamilyRole): boolean {
  return role === 'owner'
}

export function canDeleteTransaction(role: FamilyRole, createdBy: string, currentUserId: string): boolean {
  if (role === 'owner' || role === 'admin') return true
  // Members can only delete their own transactions
  return createdBy === currentUserId && hasPermission(role, 'delete_transaction')
}

export function canEditTransaction(role: FamilyRole, createdBy: string, currentUserId: string): boolean {
  if (role === 'owner' || role === 'admin') return true
  // Members can only edit their own transactions
  return createdBy === currentUserId && hasPermission(role, 'edit_transaction')
}

export function canDeleteAsset(role: FamilyRole, createdBy: string, currentUserId: string): boolean {
  if (role === 'owner' || role === 'admin') return true
  return createdBy === currentUserId && hasPermission(role, 'delete_asset')
}

export function canEditAsset(role: FamilyRole, createdBy: string, currentUserId: string): boolean {
  if (role === 'owner' || role === 'admin') return true
  return createdBy === currentUserId && hasPermission(role, 'edit_asset')
}

export function canDeleteDebt(role: FamilyRole): boolean {
  return role === 'owner' || role === 'admin'
}

export function canEditDebt(role: FamilyRole): boolean {
  return role === 'owner' || role === 'admin'
}
