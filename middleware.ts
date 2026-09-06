import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = await createServerClient()
  const { data } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/')
  const isDashboardPage = request.nextUrl.pathname.startsWith('/(dashboard)')

  // Redirect to login if accessing protected routes without auth
  if (isDashboardPage && !data.user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect to dashboard if already logged in and accessing auth pages
  if (isAuthPage && data.user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
