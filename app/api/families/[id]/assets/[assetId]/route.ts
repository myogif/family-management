import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> }
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

    const { id: familyId, assetId } = await params
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

    const { data: asset, error } = await supabase
      .from('assets')
      .update({
        name: body.name,
        category: body.category,
        purchase_value: body.purchaseValue,
        current_value: body.currentValue,
        purchase_date: body.purchaseDate,
        description: body.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', assetId)
      .eq('family_id', familyId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update asset' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: asset },
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
  { params }: { params: Promise<{ id: string; assetId: string }> }
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

    const { id: familyId, assetId } = await params

    // Verify membership
    const { data: isMember } = await supabase
      .rpc('is_family_member', { family_id: familyId })

    if (!isMember) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', assetId)
      .eq('family_id', familyId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete asset' },
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
