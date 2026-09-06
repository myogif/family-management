import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createEventSchema } from '@/lib/validations'

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
    const dateFrom = url.searchParams.get('dateFrom')
    const dateTo = url.searchParams.get('dateTo')

    // Verify membership
    const { data: isMember } = await supabase
      .rpc('is_family_member', { family_id: familyId })

    if (!isMember) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    let query = supabase
      .from('events')
      .select('*')
      .eq('family_id', familyId)

    if (dateFrom) {
      query = query.gte('start_at', dateFrom)
    }

    if (dateTo) {
      query = query.lte('end_at', dateTo)
    }

    const { data: events, error } = await query
      .order('start_at', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: events },
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

    const validation = createEventSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        family_id: familyId,
        title: validation.data.title,
        description: validation.data.description,
        start_at: validation.data.startAt,
        end_at: validation.data.endAt,
        location: validation.data.location,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: event },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
