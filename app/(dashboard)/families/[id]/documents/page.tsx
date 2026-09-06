'use client'

import { DocumentList } from '@/components/documents/document-list'
import { DocumentUpload } from '@/components/documents/document-upload'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import React from 'react'

interface DocumentsPageProps {
  params: Promise<{ id: string }>
}

export default function DocumentsPage({ params }: DocumentsPageProps) {
  const [familyId, setFamilyId] = React.useState<string>('')
  const [refreshKey, setRefreshKey] = useState(0)

  React.useEffect(() => {
    params.then((p) => setFamilyId(p.id))
  }, [params])

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  if (!familyId) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Documents</h1>
        <p className="text-muted-foreground mt-2">
          Store and manage family documents securely
        </p>
      </div>

      {/* Upload Section */}
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
        <DocumentUpload familyId={familyId} onSuccess={handleUploadSuccess} />
      </div>

      {/* Documents List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Documents</h2>
        <DocumentList key={refreshKey} familyId={familyId} />
      </div>
    </div>
  )
}
