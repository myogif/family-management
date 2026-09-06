import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; debtId: string }> }
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

    const { id: familyId, debtId } = await params
    const body = await request.json()

    // Verify membership & admin role
    const { data: memberRole } = await supabase
      .from('family_members')
      .select('role')
      .eq('family_id', familyId)
      .eq('user_id', user.id)
      .single()

    if (!memberRole || !['owner', 'admin'].includes(memberRole.role)) {
      return NextResponse.json(
        { error: 'Only admins can update debts' },
        { status: 403 }
      )
    }

    const { data: debt, error } = await supabase
      .from('debts')
      .update({
        name: body.name,
        type: body.type,
        principal_amount: body.principalAmount,
        remaining_amount: body.remainingAmount,
        due_date: body.dueDate,
        status: body.status,
        description: body.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', debtId)
      .eq('family_id', familyId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update debt' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: debt },
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
  { params }: { params: Promise<{ id: string; debtId: string }> }
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

    const { id: familyId, debtId } = await params

    // Verify membership & admin role
    const { data: memberRole } = await supabase
      .from('family_members')
      .select('role')
      .eq('family_id', familyId)
      .eq('user_id', user.id)
      .single()

    if (!memberRole || !['owner', 'admin'].includes(memberRole.role)) {
      return NextResponse.json(
        { error: 'Only admins can delete debts' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('debts')
      .delete()
      .eq('id', debtId)
      .eq('family_id', familyId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete debt' },
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
