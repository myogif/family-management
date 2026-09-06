import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: familyId } = await params

    // Verify membership
    const { data: isMember } = await supabase
      .rpc('is_family_member', { family_id: familyId })

    if (!isMember) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // Get current month date range
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

    // Total income all time
    const { data: incomeData, error: incomeError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('family_id', familyId)
      .eq('type', 'income')

    // Total expense all time
    const { data: expenseData, error: expenseError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('family_id', familyId)
      .eq('type', 'expense')

    // This month's expenses
    const { data: thisMonthData, error: monthError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('family_id', familyId)
      .eq('type', 'expense')
      .gte('transaction_date', monthStart)
      .lte('transaction_date', monthEnd)

    // Total assets
    const { data: assetsData, error: assetsError } = await supabase
      .from('assets')
      .select('current_value')
      .eq('family_id', familyId)

    // Total debts
    const { data: debtsData, error: debtsError } = await supabase
      .from('debts')
      .select('remaining_amount')
      .eq('family_id', familyId)
      .eq('status', 'active')

    // Active goals
    const { data: goalsData, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('family_id', familyId)
      .eq('status', 'active')

    // Upcoming events
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('family_id', familyId)
      .gte('start_at', new Date().toISOString())
      .order('start_at', { ascending: true })
      .limit(5)

    const totalIncome = incomeData?.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0) || 0
    const totalExpense = expenseData?.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0) || 0
    const thisMonthExpense = thisMonthData?.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0) || 0
    const totalAssets = assetsData?.reduce((sum, a) => sum + parseFloat(a.current_value || '0'), 0) || 0
    const totalDebts = debtsData?.reduce((sum, d) => sum + parseFloat(d.remaining_amount || '0'), 0) || 0

    return NextResponse.json(
      {
        data: {
          finance: {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
            thisMonthExpense,
          },
          assets: {
            totalValue: totalAssets,
            count: assetsData?.length || 0,
          },
          debts: {
            totalAmount: totalDebts,
            count: debtsData?.length || 0,
          },
          goals: {
            active: goalsData || [],
            count: goalsData?.length || 0,
          },
          events: {
            upcoming: eventsData || [],
            count: eventsData?.length || 0,
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
