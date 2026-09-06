import { calculateProgress, formatCurrency, isOverdue, isUpcoming, getInitials } from '@/lib/utils'

describe('Utils', () => {
  describe('calculateProgress', () => {
    it('should calculate progress correctly', () => {
      expect(calculateProgress(50, 100)).toBe(50)
      expect(calculateProgress(35000000, 100000000)).toBe(35)
    })

    it('should return 0 when target is 0', () => {
      expect(calculateProgress(50, 0)).toBe(0)
    })

    it('should cap progress at 100', () => {
      expect(calculateProgress(150, 100)).toBe(100)
    })

    it('should handle string inputs', () => {
      expect(calculateProgress('50', '100')).toBe(50)
    })
  })

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      const result = formatCurrency(1000000)
      expect(result).toContain('1')
      expect(result).toContain('000')
    })

    it('should handle string input', () => {
      const result = formatCurrency('1000000')
      expect(result).toContain('1')
    })
  })

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      expect(isOverdue(pastDate)).toBe(true)
    })

    it('should return false for future dates', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
      expect(isOverdue(futureDate)).toBe(false)
    })
  })

  describe('isUpcoming', () => {
    it('should return true for dates within upcoming range', () => {
      const upcomingDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString()
      expect(isUpcoming(upcomingDate, 7)).toBe(true)
    })

    it('should return false for dates outside upcoming range', () => {
      const farFutureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString()
      expect(isUpcoming(farFutureDate, 7)).toBe(false)
    })
  })

  describe('getInitials', () => {
    it('should return initials correctly', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Alice Bob Smith')).toBe('AB')
    })

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J')
    })
  })
})
