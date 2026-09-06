import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; categoryId: string }> }
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

    const { id: familyId, categoryId } = await params
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
        { error: 'Only admins can update categories' },
        { status: 403 }
      )
    }

    const { data: category, error } = await supabase
      .from('categories')
      .update({
        name: body.name,
        type: body.type,
        icon: body.icon,
        updated_at: new Date().toISOString(),
      })
      .eq('id', categoryId)
      .eq('family_id', familyId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: category },
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
  { params }: { params: Promise<{ id: string; categoryId: string }> }
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

    const { id: familyId, categoryId } = await params

    // Verify membership & admin role
    const { data: memberRole } = await supabase
      .from('family_members')
      .select('role')
      .eq('family_id', familyId)
      .eq('user_id', user.id)
      .single()

    if (!memberRole || !['owner', 'admin'].includes(memberRole.role)) {
      return NextResponse.json(
        { error: 'Only admins can delete categories' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
      .eq('family_id', familyId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete category' },
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
