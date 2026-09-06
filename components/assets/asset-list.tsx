'use client'

import { useEffect, useState } from 'react'
import { useAssetActions } from '@/hooks/useAssetActions'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { DataTable } from '@/components/ui/data-table'
import { Toaster, toast } from 'sonner'
import Link from 'next/link'

interface AssetListProps {
  familyId: string
}

export function AssetList({ familyId }: AssetListProps) {
  const [assets, setAssets] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { getAssets, deleteAsset, loading, error } = useAssetActions()

  useEffect(() => {
    const loadAssets = async () => {
      const result = await getAssets(familyId)
      if (result?.data) {
        setAssets(result.data)
      }
    }

    loadAssets()
  }, [familyId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteAsset(familyId, deleteId)
    if (result) {
      toast.success('Asset deleted')
      setAssets(assets.filter((a) => a.id !== deleteId))
      setDeleteId(null)
      setShowDeleteDialog(false)
    }
  }

  const totalValue = assets.reduce((sum, a) => sum + parseFloat(a.current_value || '0'), 0)

  return (
    <>
      <div className="space-y-4">
        {/* Summary Card */}
        <div className="p-6 border rounded-lg bg-muted/50">
          <h3 className="text-sm font-medium text-muted-foreground">Total Asset Value</h3>
          <p className="text-3xl font-bold mt-2">{formatCurrency(totalValue)}</p>
          <p className="text-xs text-muted-foreground mt-4">{assets.length} assets</p>
        </div>

        {/* Assets List */}
        <DataTable
          columns={[
            { header: 'Name', accessor: (asset) => asset.name, cellClassName: 'font-semibold' },
            {
              header: 'Category',
              accessor: (asset) => <Badge variant="outline">{asset.category}</Badge>,
            },
            {
              header: 'Purchase Value',
              accessor: (asset) => formatCurrency(asset.purchase_value),
            },
            {
              header: 'Current Value',
              accessor: (asset) => formatCurrency(asset.current_value),
              cellClassName: 'font-semibold',
            },
            {
              header: 'Date',
              accessor: (asset) => formatDate(asset.purchase_date),
            },
            {
              header: 'Actions',
              accessor: (asset) => (
                <div className="flex gap-2 justify-end">
                  <Link href={`/families/${familyId}/assets/${asset.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog
                    open={showDeleteDialog && deleteId === asset.id}
                    onOpenChange={(open) => {
                      if (open) {
                        setDeleteId(asset.id)
                      }
                      setShowDeleteDialog(open)
                    }}
                    title="Delete Asset?"
                    description="This action cannot be undone."
                    onConfirm={handleDelete}
                    isLoading={loading}
                    isDangerous
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteId(asset.id)
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
          data={assets}
          keyExtractor={(asset) => asset.id}
          isLoading={loading}
          emptyMessage="No assets yet"
          emptyAction={
            <Link href={`/families/${familyId}/assets/create`}>
              <Button variant="outline" size="sm">
                Add Asset
              </Button>
            </Link>
          }
        />
      </div>
      <Toaster />
    </>
  )
}
