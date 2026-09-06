'use client'

import { useEffect, useState } from 'react'
import { useDocumentActions } from '@/hooks/useDocumentActions'
import { Button } from '@/components/ui/button'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { DataTable } from '@/components/ui/data-table'
import { Toaster, toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface DocumentListProps {
  familyId: string
}

export function DocumentList({ familyId }: DocumentListProps) {
  const [documents, setDocuments] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const {
    getDocuments,
    deleteDocument,
    downloadDocument,
    formatFileSize,
    getFileIcon,
    loading,
    error,
  } = useDocumentActions()

  useEffect(() => {
    const loadDocuments = async () => {
      const result = await getDocuments(familyId)
      if (result?.data) {
        setDocuments(result.data)
      }
    }

    loadDocuments()
  }, [familyId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteDocument(familyId, deleteId)
    if (result) {
      toast.success('Document deleted')
      setDocuments(documents.filter((d) => d.id !== deleteId))
      setDeleteId(null)
      setShowDeleteDialog(false)
    }
  }

  const handleDownload = async (documentId: string, fileName: string) => {
    const result = await downloadDocument(familyId, documentId)
    if (result?.data?.downloadUrl) {
      // Create temporary link to download
      const link = document.createElement('a')
      link.href = result.data.downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Download started')
    }
  }

  const totalSize = documents.reduce((sum, d) => sum + (d.file_size || 0), 0)

  return (
    <>
      <div className="space-y-4">
        {/* Summary Card */}
        {documents.length > 0 && (
          <div className="p-6 border rounded-lg bg-muted/50">
            <h3 className="text-sm font-medium text-muted-foreground">Total Documents</h3>
            <p className="text-3xl font-bold mt-2">{documents.length}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Total size: {formatFileSize(totalSize)}
            </p>
          </div>
        )}

        {/* Documents List */}
        <DataTable
          columns={[
            {
              header: 'File',
              accessor: (doc) => (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileIcon(doc.file_type)}</span>
                  <div>
                    <p className="font-semibold text-sm">{doc.name}</p>
                    {doc.description && (
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                    )}
                  </div>
                </div>
              ),
            },
            {
              header: 'Type',
              accessor: (doc) => doc.file_type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
            },
            {
              header: 'Size',
              accessor: (doc) => formatFileSize(doc.file_size),
            },
            {
              header: 'Uploaded',
              accessor: (doc) => formatDate(doc.created_at),
            },
            {
              header: 'Actions',
              accessor: (doc) => (
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc.id, doc.name)}
                    disabled={loading}
                  >
                    Download
                  </Button>
                  <AlertDialog
                    open={showDeleteDialog && deleteId === doc.id}
                    onOpenChange={(open) => {
                      if (open) {
                        setDeleteId(doc.id)
                      }
                      setShowDeleteDialog(open)
                    }}
                    title="Delete Document?"
                    description="This action cannot be undone. The file will be permanently deleted."
                    onConfirm={handleDelete}
                    isLoading={loading}
                    isDangerous
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteId(doc.id)
                        setShowDeleteDialog(true)
                      }}
                    >
                      Delete
                    </Button>
                  </AlertDialog>
                </div>
              ),
            },
          ]}
          data={documents}
          keyExtractor={(doc) => doc.id}
          isLoading={loading}
          emptyMessage="No documents yet"
          emptyAction={
            <p className="text-sm text-muted-foreground mt-2">
              Upload family documents like certificates, bills, or photos
            </p>
          }
        />
      </div>
      <Toaster />
    </>
  )
}
