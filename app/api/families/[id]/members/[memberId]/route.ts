import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
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

    const { id, memberId } = await params
    const body = await request.json()

    // Verify user is owner
    const { data: memberRole } = await supabase
      .from('family_members')
      .select('role')
      .eq('family_id', id)
      .eq('user_id', user.id)
      .single()

    if (!memberRole || memberRole.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only family owner can change member roles' },
        { status: 403 }
      )
    }

    // Update member role
    const { data: updatedMember, error } = await supabase
      .from('family_members')
      .update({ role: body.role })
      .eq('id', memberId)
      .eq('family_id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update member role' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: updatedMember },
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
  { params }: { params: Promise<{ id: string; memberId: string }> }
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

    const { id, memberId } = await params

    // Verify user is owner
    const { data: memberRole } = await supabase
      .from('family_members')
      .select('role')
      .eq('family_id', id)
      .eq('user_id', user.id)
      .single()

    if (!memberRole || memberRole.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only family owner can remove members' },
        { status: 403 }
      )
    }

    // Prevent removing the owner
    const { data: targetMember } = await supabase
      .from('family_members')
      .select('role')
      .eq('id', memberId)
      .single()

    if (targetMember?.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot remove family owner' },
        { status: 400 }
      )
    }

    // Remove member
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', memberId)
      .eq('family_id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to remove member' },
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
