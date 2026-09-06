'use client'

import { AssetList } from '@/components/assets/asset-list'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'

interface AssetsPageProps {
  params: Promise<{ id: string }>
}

export default function AssetsPage({ params }: AssetsPageProps) {
  const [familyId, setFamilyId] = React.useState<string>('')

  React.useEffect(() => {
    params.then((p) => setFamilyId(p.id))
  }, [params])

  if (!familyId) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Assets</h1>
          <p className="text-muted-foreground mt-2">Track your family assets and valuables</p>
        </div>
        <Link href={`/families/${familyId}/assets/create`}>
          <Button>Add Asset</Button>
        </Link>
      </div>

      <AssetList familyId={familyId} />
    </div>
  )
}
