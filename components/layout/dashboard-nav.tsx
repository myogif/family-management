'use client'

import { useAuth } from '@/lib/auth/context'
import { useAuthActions } from '@/hooks/useAuthActions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from 'sonner'
import { MobileNav } from './mobile-nav'

export function DashboardNav() {
  const { user } = useAuth()
  const { logout } = useAuthActions()
  const router = useRouter()

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      toast.success('Logged out successfully')
      router.push('/auth/login')
    }
  }

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4 md:gap-8">
          <MobileNav />
          <Link href="/dashboard" className="text-lg md:text-xl font-bold">
            Family Management
          </Link>
          <div className="hidden md:flex gap-4">
            <Link href="/dashboard" className="text-sm hover:text-primary">
              Dashboard
            </Link>
            <Link href="/families" className="text-sm hover:text-primary">
              Families
            </Link>
            <Link href="/profile" className="text-sm hover:text-primary">
              Profile
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-sm text-muted-foreground truncate max-w-[150px]">
            {user?.email}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Exit</span>
          </Button>
        </div>
      </div>
      <Toaster />
    </nav>
  )
}
