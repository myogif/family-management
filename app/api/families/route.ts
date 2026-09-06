import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createFamilySchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = createFamilySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Create family
    const { data: family, error: familyError } = await supabase
      .from('families')
      .insert({
        name: validation.data.name,
        description: validation.data.description,
        created_by: user.id,
      })
      .select()
      .single()

    if (familyError) {
      return NextResponse.json(
        { error: 'Failed to create family' },
        { status: 500 }
      )
    }

    // Add user as owner
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        family_id: family.id,
        user_id: user.id,
        role: 'owner',
      })

    if (memberError) {
      return NextResponse.json(
        { error: 'Failed to add user to family' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: family },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get families for current user
    const { data: families, error: familiesError } = await supabase
      .from('families')
      .select(`
        *,
        family_members!inner(*)
      `)
      .eq('family_members.user_id', user.id)

    if (familiesError) {
      return NextResponse.json(
        { error: 'Failed to fetch families' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: families },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
