export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function calculateProgress(current: number | string, target: number | string): number {
  const curr = typeof current === 'string' ? parseFloat(current) : current
  const targ = typeof target === 'string' ? parseFloat(target) : target

  if (targ === 0) return 0

  const progress = (curr / targ) * 100
  return Math.min(Math.max(progress, 0), 100)
}

export function isOverdue(date: string): boolean {
  return new Date(date) < new Date()
}

export function isUpcoming(date: string, days: number = 7): boolean {
  const today = new Date()
  const upcoming = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
  const checkDate = new Date(date)
  return checkDate >= today && checkDate <= upcoming
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
