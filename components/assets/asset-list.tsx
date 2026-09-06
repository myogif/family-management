'use client'

import { useEffect, useState } from 'react'
import { useAssetActions } from '@/hooks/useAssetActions'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { TableSkeleton } from '@/components/ui/skeleton'
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
        {loading ? (
          <TableSkeleton />
        ) : assets.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No assets yet</p>
            <Link href={`/families/${familyId}/assets/create`}>
              <Button variant="outline" size="sm" className="mt-4">
                Add Asset
              </Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Name</th>
                  <th className="text-left p-4 text-sm font-medium">Category</th>
                  <th className="text-right p-4 text-sm font-medium">Purchase Value</th>
                  <th className="text-right p-4 text-sm font-medium">Current Value</th>
                  <th className="text-left p-4 text-sm font-medium">Date</th>
                  <th className="text-right p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-t hover:bg-muted/50">
                    <td className="p-4 text-sm font-semibold">{asset.name}</td>
                    <td className="p-4 text-sm">
                      <Badge variant="outline">{asset.category}</Badge>
                    </td>
                    <td className="p-4 text-sm text-right">
                      {formatCurrency(asset.purchase_value)}
                    </td>
                    <td className="p-4 text-sm text-right font-semibold">
                      {formatCurrency(asset.current_value)}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(asset.purchase_date)}
                    </td>
                    <td className="p-4 text-sm text-right space-x-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Toaster />
    </>
  )
}
