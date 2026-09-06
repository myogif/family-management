'use client'

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-muted rounded-md ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-full" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted p-4">
        <Skeleton className="h-4 w-full" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-t p-4 space-y-2">
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  )
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(fields)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-full mt-6" />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
