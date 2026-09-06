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

    const { id } = await params

    // Verify user is family member
    const { data: isMember, error: memberCheckError } = await supabase
      .rpc('is_family_member', { family_id: id })

    if (memberCheckError || !isMember) {
      return NextResponse.json(
        { error: 'Not authorized to view this family' },
        { status: 403 }
      )
    }

    // Get family with members
    const { data: family, error: familyError } = await supabase
      .from('families')
      .select(`
        *,
        family_members(
          id,
          user_id,
          role,
          joined_at,
          profiles(full_name, avatar_url)
        )
      `)
      .eq('id', id)
      .single()

    if (familyError) {
      return NextResponse.json(
        { error: 'Family not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { data: family },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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

    const { id } = await params
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
        { error: 'Only family owner can update family' },
        { status: 403 }
      )
    }

    const { data: family, error: updateError } = await supabase
      .from('families')
      .update({
        name: body.name,
        description: body.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update family' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: family },
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

    const { id } = await params

    // Verify user is owner
    const { data: memberRole } = await supabase
      .from('family_members')
      .select('role')
      .eq('family_id', id)
      .eq('user_id', user.id)
      .single()

    if (!memberRole || memberRole.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only family owner can delete family' },
        { status: 403 }
      )
    }

    const { error: deleteError } = await supabase
      .from('families')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete family' },
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
