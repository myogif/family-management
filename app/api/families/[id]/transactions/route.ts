import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createTransactionSchema } from '@/lib/validations'

const ITEMS_PER_PAGE = 50

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
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const type = url.searchParams.get('type')
    const categoryId = url.searchParams.get('categoryId')
    const dateFrom = url.searchParams.get('dateFrom')
    const dateTo = url.searchParams.get('dateTo')
    const search = url.searchParams.get('search')

    // Verify membership
    const { data: isMember } = await supabase
      .rpc('is_family_member', { family_id: familyId })

    if (!isMember) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // Build query
    let query = supabase
      .from('transactions')
      .select('*, categories(name, icon, type)', { count: 'exact' })
      .eq('family_id', familyId)

    if (type) {
      query = query.eq('type', type)
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (dateFrom) {
      query = query.gte('transaction_date', dateFrom)
    }

    if (dateTo) {
      query = query.lte('transaction_date', dateTo)
    }

    if (search) {
      query = query.or(`description.ilike.%${search}%`)
    }

    // Pagination
    const offset = (page - 1) * ITEMS_PER_PAGE
    query = query
      .order('transaction_date', { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1)

    const { data: transactions, count, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      )
    }

    const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

    return NextResponse.json(
      {
        data: transactions,
        meta: {
          total: count || 0,
          page,
          limit: ITEMS_PER_PAGE,
          totalPages,
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

export async function POST(
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
    const body = await request.json()

    // Verify membership
    const { data: isMember } = await supabase
      .rpc('is_family_member', { family_id: familyId })

    if (!isMember) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    const validation = createTransactionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Verify category belongs to family
    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', validation.data.categoryId)
      .eq('family_id', familyId)
      .single()

    if (catError || !category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        family_id: familyId,
        category_id: validation.data.categoryId,
        created_by: user.id,
        type: validation.data.type,
        amount: validation.data.amount,
        transaction_date: validation.data.transactionDate,
        description: validation.data.description,
        payment_method: validation.data.paymentMethod,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: transaction },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
