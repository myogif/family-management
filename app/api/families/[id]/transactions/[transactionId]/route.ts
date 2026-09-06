import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; transactionId: string }> }
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

    const { id: familyId, transactionId } = await params
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

    // Verify user role for permission check
    const { data: memberRole } = await supabase
      .from('family_members')
      .select('role')
      .eq('family_id', familyId)
      .eq('user_id', user.id)
      .single()

    // Get transaction to check creator
    const { data: transaction } = await supabase
      .from('transactions')
      .select('created_by')
      .eq('id', transactionId)
      .eq('family_id', familyId)
      .single()

    // Only creator, owner, or admin can update
    const isCreator = transaction?.created_by === user.id
    const isAdmin = memberRole?.role === 'owner' || memberRole?.role === 'admin'

    if (!isCreator && !isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to update this transaction' },
        { status: 403 }
      )
    }

    const { data: updated, error } = await supabase
      .from('transactions')
      .update({
        amount: body.amount,
        category_id: body.categoryId,
        type: body.type,
        transaction_date: body.transactionDate,
        description: body.description,
        payment_method: body.paymentMethod,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transactionId)
      .eq('family_id', familyId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: updated },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; transactionId: string }> }
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

    const { id: familyId, transactionId } = await params

    // Verify membership
    const { data: isMember } = await supabase
      .rpc('is_family_member', { family_id: familyId })

    if (!isMember) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // Verify user role for permission check
    const { data: memberRole } = await supabase
      .from('family_members')
      .select('role')
      .eq('family_id', familyId)
      .eq('user_id', user.id)
      .single()

    // Get transaction to check creator
    const { data: transaction } = await supabase
      .from('transactions')
      .select('created_by')
      .eq('id', transactionId)
      .eq('family_id', familyId)
      .single()

    // Only creator, owner, or admin can delete
    const isCreator = transaction?.created_by === user.id
    const isAdmin = memberRole?.role === 'owner' || memberRole?.role === 'admin'

    if (!isCreator && !isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to delete this transaction' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)
      .eq('family_id', familyId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete transaction' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
