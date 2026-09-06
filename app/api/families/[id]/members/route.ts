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
    const { data: isMember } = await supabase
      .rpc('is_family_member', { family_id: id })

    if (!isMember) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // Get family members
    const { data: members, error } = await supabase
      .from('family_members')
      .select(`
        id,
        user_id,
        role,
        joined_at,
        profiles(id, full_name, avatar_url, phone)
      `)
      .eq('family_id', id)
      .order('joined_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch members' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: members },
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
        { error: 'Only family owner can invite members' },
        { status: 403 }
      )
    }

    // Check if user already exists in family
    const { data: existingMember } = await supabase
      .from('family_members')
      .select('id')
      .eq('family_id', id)
      .eq('user_id', body.userId)
      .single()

    if (existingMember) {
      return NextResponse.json(
        { error: 'User already in family' },
        { status: 400 }
      )
    }

    // Add member
    const { data: newMember, error } = await supabase
      .from('family_members')
      .insert({
        family_id: id,
        user_id: body.userId,
        role: body.role || 'member',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to add member' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: newMember },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
