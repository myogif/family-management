import { hasPermission, canManageFamily, canManageMembers } from '@/lib/permissions'

describe('Permissions', () => {
  describe('hasPermission', () => {
    it('owner should have all permissions', () => {
      expect(hasPermission('owner', 'delete_family')).toBe(true)
      expect(hasPermission('owner', 'manage_members')).toBe(true)
      expect(hasPermission('owner', 'create_transaction')).toBe(true)
    })

    it('admin should have most permissions except family management', () => {
      expect(hasPermission('admin', 'delete_family')).toBe(false)
      expect(hasPermission('admin', 'manage_members')).toBe(false)
      expect(hasPermission('admin', 'create_transaction')).toBe(true)
    })

    it('member should have limited permissions', () => {
      expect(hasPermission('member', 'delete_family')).toBe(false)
      expect(hasPermission('member', 'manage_members')).toBe(false)
      expect(hasPermission('member', 'create_transaction')).toBe(true)
      expect(hasPermission('member', 'edit_category')).toBe(false)
    })
  })

  describe('canManageFamily', () => {
    it('only owner can manage family', () => {
      expect(canManageFamily('owner')).toBe(true)
      expect(canManageFamily('admin')).toBe(false)
      expect(canManageFamily('member')).toBe(false)
    })
  })

  describe('canManageMembers', () => {
    it('only owner can manage members', () => {
      expect(canManageMembers('owner')).toBe(true)
      expect(canManageMembers('admin')).toBe(false)
      expect(canManageMembers('member')).toBe(false)
    })
  })
})
