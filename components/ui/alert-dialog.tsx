'use client'

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  isLoading?: boolean
  isDangerous?: boolean
  children: React.ReactNode
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading = false,
  isDangerous = false,
  children,
}: AlertDialogProps) {
  return (
    <>
      <div onClick={() => onOpenChange(true)}>{children}</div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-sm w-full mx-4 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground mt-2">{description}</p>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 ${
                  isDangerous
                    ? 'bg-destructive hover:bg-destructive/90'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isLoading ? 'Please wait...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
